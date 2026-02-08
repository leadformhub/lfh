import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { UserPlan, UserStatus } from "@prisma/client";
import { sendVerificationEmail, sendPasswordResetEmail, sendEmailChangeVerification } from "@/lib/email";
import { nanoid } from "nanoid";

const SALT_ROUNDS = 12;
const VERIFY_EXPIRY_HOURS = 24;
const RESET_EXPIRY_HOURS = 1;
const EMAIL_CHANGE_EXPIRY_HOURS = 1;

export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username.toLowerCase() }],
    },
  });
  if (existing) {
    if (existing.email === input.email) throw new Error("Email already registered");
    throw new Error("Username already taken");
  }

  const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
  const username = input.username.toLowerCase().replace(/\s/g, "");
  const user = await prisma.user.create({
    data: {
      name: input.name,
      username,
      email: input.email.toLowerCase(),
      password: hashed,
      plan: "free" as UserPlan,
      status: "active" as UserStatus,
    },
  });
  return user;
}

/** Derive name and username from email and create user (email+password only signup). */
export async function createUserWithEmailOnly(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) throw new Error("Email already registered");

  const baseUsername = (normalizedEmail.replace(/@.*/, "").replace(/[^a-z0-9_-]/gi, "") || "user").toLowerCase().slice(0, 25);
  let username = baseUsername;
  let attempts = 0;
  while (attempts < 100) {
    const taken = await prisma.user.findUnique({ where: { username } });
    if (!taken) break;
    username = `${baseUsername}${attempts === 0 ? "" : attempts}${nanoid(5)}`;
    attempts++;
  }

  const name = (normalizedEmail.replace(/@.*/, "") || "User").trim().slice(0, 100);
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name,
      username,
      email: normalizedEmail,
      password: hashed,
      plan: "free" as UserPlan,
      status: "active" as UserStatus,
    },
  });
  return user;
}

export async function sendEmailVerification(userId: string, baseUrl: string) {
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + VERIFY_EXPIRY_HOURS * 60 * 60 * 1000);
  await prisma.verificationToken.create({
    data: { userId, token, expiresAt },
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const url = `${baseUrl}/api/auth/verify-email?token=${token}`;
  await sendVerificationEmail(user.email, url);
}

export async function verifyEmailToken(token: string) {
  const vt = await prisma.verificationToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
  });
  if (!vt) return null;
  await prisma.user.update({
    where: { id: vt.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await prisma.verificationToken.deleteMany({ where: { token } });
  return vt.userId;
}

/** Resend verification email for unverified users. Rate-limited to once per 2 minutes per email. */
const RESEND_VERIFICATION_COOLDOWN_MS = 2 * 60 * 1000;

export async function resendEmailVerification(email: string): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.toLowerCase().trim();
  const user = await findUserByEmail(normalized);
  if (!user) {
    return { ok: false, error: "No account found with this email." };
  }
  if (user.emailVerifiedAt) {
    return { ok: false, error: "This email is already verified. You can log in." };
  }

  const latestToken = await prisma.verificationToken.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  if (latestToken && Date.now() - latestToken.createdAt.getTime() < RESEND_VERIFICATION_COOLDOWN_MS) {
    return { ok: false, error: "Please wait a few minutes before requesting another verification email." };
  }

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  await sendEmailVerification(user.id, baseUrl);
  return { ok: true };
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase(), status: "active" },
  });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase(), status: "active" },
  });
}

export async function validatePassword(userId: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}

/** Delete account: removes user (login). Leads are kept and unmapped (userId set to null). */
export async function deleteAccount(userId: string, password: string): Promise<void> {
  const valid = await validatePassword(userId, password);
  if (!valid) throw new Error("Invalid password");
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function updatePassword(userId: string, newPassword: string) {
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}

export async function createPasswordResetToken(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const token = nanoid(32);
  await prisma.passwordReset.create({
    data: {
      email: user.email,
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000),
    },
  });
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL || "leadformhub.com"}`
    : "https://leadformhub.com";
  await sendPasswordResetEmail(user.email, `${baseUrl}/reset-password?token=${token}`);
  return token;
}

export async function consumePasswordResetToken(token: string) {
  const reset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) return null;
  await prisma.passwordReset.update({
    where: { id: reset.id },
    data: { usedAt: new Date() },
  });
  return reset.userId;
}

export async function createEmailChangeRequest(userId: string, newEmail: string) {
  const normalized = newEmail.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing && existing.id !== userId) throw new Error("Email already in use");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email === normalized) throw new Error("New email is same as current");
  await prisma.emailChangeRequest.deleteMany({ where: { userId } });
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + EMAIL_CHANGE_EXPIRY_HOURS * 60 * 60 * 1000);
  await prisma.emailChangeRequest.create({
    data: { userId, newEmail: normalized, token, expiresAt },
  });
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email-change?token=${token}`;
  await sendEmailChangeVerification(normalized, verifyUrl);
  return token;
}

export async function verifyEmailChangeToken(token: string): Promise<{ userId: string; newEmail: string } | null> {
  const req = await prisma.emailChangeRequest.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
  });
  if (!req) return null;
  const existing = await prisma.user.findUnique({ where: { email: req.newEmail } });
  if (existing) return null;
  await prisma.user.update({
    where: { id: req.userId },
    data: { email: req.newEmail, emailVerifiedAt: new Date() },
  });
  await prisma.emailChangeRequest.deleteMany({ where: { token } });
  return { userId: req.userId, newEmail: req.newEmail };
}

/** Google OAuth profile from userinfo endpoint. */
export interface GoogleProfile {
  id: string;
  email: string | null;
  name?: string | null;
  picture?: string | null;
}

/** Find user by email or create one from Google profile. OAuth users get a random password placeholder. */
export async function findOrCreateUserByGoogle(profile: GoogleProfile): Promise<{ user: Awaited<ReturnType<typeof prisma.user.findUnique>>; isNewUser: boolean }> {
  const email = profile.email?.toLowerCase().trim();
  if (!email) throw new Error("Google account has no email");

  const existing = await prisma.user.findUnique({
    where: { email, status: "active" },
  });
  if (existing) return { user: existing, isNewUser: false };

  const baseUsername = (email.replace(/@.*/, "").replace(/[^a-z0-9_-]/gi, "") || "user").toLowerCase().slice(0, 25);
  let username = baseUsername;
  let attempts = 0;
  while (attempts < 100) {
    const taken = await prisma.user.findUnique({ where: { username } });
    if (!taken) break;
    username = `${baseUsername}${attempts === 0 ? "" : attempts}${nanoid(5)}`;
    attempts++;
  }

  const name = (profile.name || email.replace(/@.*/, "") || "User").trim().slice(0, 100);
  const passwordPlaceholder = await bcrypt.hash(nanoid(32), SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: passwordPlaceholder,
      plan: "free" as UserPlan,
      status: "active" as UserStatus,
      emailVerifiedAt: new Date(),
    },
  });
  return { user, isNewUser: true };
}
