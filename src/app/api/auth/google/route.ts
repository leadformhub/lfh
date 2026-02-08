import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = ["openid", "email", "profile"].join(" ");
const STATE_COOKIE = "leadformhub_google_state";
const FROM_COOKIE = "leadformhub_google_from";
const STATE_MAX_AGE = 60 * 10; // 10 minutes

function getBaseUrl(req: NextRequest): string {
  const url = req.nextUrl;
  return url.origin;
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google sign-in is not configured" }, { status: 503 });
  }
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const state = nanoid(32);
  const from = req.nextUrl.searchParams.get("from"); // "signup" | "login" (default)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    state,
    access_type: "online",
  });

  const res = NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, 302);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE,
    path: "/",
  });
  if (from === "signup") {
    res.cookies.set(FROM_COOKIE, "signup", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: STATE_MAX_AGE,
      path: "/",
    });
  }
  return res;
}
