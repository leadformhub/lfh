import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findOrCreateUserByGoogle, type GoogleProfile } from "@/services/auth.service";
import { sendWelcomeEmail } from "@/lib/email";
import { createToken } from "@/lib/jwt";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/jwt";
import { prisma } from "@/lib/db";

const STATE_COOKIE = "leadformhub_google_state";
const FROM_COOKIE = "leadformhub_google_from";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

function getBaseUrl(req: NextRequest): string {
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = getBaseUrl(req);
  const cookieStore = await cookies();
  const fromSignup = cookieStore.get(FROM_COOKIE)?.value === "signup";
  const errorPath = fromSignup ? "/signup" : "/login";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`${errorPath}?error=google_not_configured`, baseUrl));
  }

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    const message = error === "access_denied" ? "access_denied" : "google_error";
    return NextResponse.redirect(new URL(`${errorPath}?error=${message}`, baseUrl));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL(`${errorPath}?error=invalid_callback`, baseUrl));
  }

  const storedState = cookieStore.get(STATE_COOKIE)?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(new URL(`${errorPath}?error=invalid_state`, baseUrl));
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Google token exchange failed:", tokenRes.status, err);
    return NextResponse.redirect(new URL(`${errorPath}?error=token_exchange_failed`, baseUrl));
  }

  const tokens = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokens.access_token;
  if (!accessToken) {
    return NextResponse.redirect(new URL(`${errorPath}?error=no_access_token`, baseUrl));
  }

  const userInfoRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userInfoRes.ok) {
    return NextResponse.redirect(new URL(`${errorPath}?error=userinfo_failed`, baseUrl));
  }

  const raw = (await userInfoRes.json()) as {
    id: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  };
  const profile: GoogleProfile = {
    id: raw.id,
    email: raw.email ?? null,
    name: raw.name ?? null,
    picture: raw.picture ?? null,
  };

  let user: Awaited<ReturnType<typeof findOrCreateUserByGoogle>>["user"];
  let isNewUser: boolean;
  try {
    const result = await findOrCreateUserByGoogle(profile);
    user = result.user;
    isNewUser = result.isNewUser;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Account creation failed";
    console.error("Google findOrCreateUserByGoogle:", msg);
    return NextResponse.redirect(new URL(`${errorPath}?error=${encodeURIComponent(msg)}`, baseUrl));
  }

  if (!user) {
    return NextResponse.redirect(new URL(`${errorPath}?error=no_user`, baseUrl));
  }

  // Ensure existing Google users have authProvider set (legacy migration)
  if (!isNewUser && !user.authProvider) {
    await prisma.user.update({
      where: { id: user.id },
      data: { authProvider: "google" },
    });
    user = { ...user, authProvider: "google" };
  }

  if (isNewUser) {
    await sendWelcomeEmail(user.email, user.name);
  }

  const token = await createToken({
    userId: user.id,
    username: user.username,
    email: user.email,
    plan: user.plan,
    authProvider: user.authProvider ?? "google",
  });

  const redirect = NextResponse.redirect(new URL(`/${user.username}/dashboard`, baseUrl), 302);
  redirect.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: getSessionMaxAge(),
    path: "/",
  });
  redirect.cookies.set(STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  redirect.cookies.set(FROM_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return redirect;
}
