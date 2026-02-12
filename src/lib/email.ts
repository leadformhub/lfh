/**
 * Email sending via SMTP (Nodemailer).
 * Uses Laravel-style env: MAIL_MAILER, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD,
 * MAIL_ENCRYPTION (tls|ssl), MAIL_FROM_ADDRESS, MAIL_FROM_NAME.
 */

import nodemailer from "nodemailer";
import { getBaseUrlForEmail } from "@/lib/app-url";

/** Shared email style: neutral gray palette, white card, no gradient bar, consistent footer. */
const EMAIL_STYLE = {
  bg: "#f4f4f5",
  cardBorder: "rgba(0,0,0,0.06)",
  cardBorderSolid: "#f0f0f2",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  headerColor: "#18181b",
  subtitleColor: "#71717a",
  bodyColor: "#3f3f46",
  mutedColor: "#71717a",
  footerColor: "#a1a1aa",
  footerBorder: "#f0f0f2",
  footerBg: "#fafafa",
  footerTagline: "LeadFormHub · Build forms, capture leads.",
  buttonBg: "#2563eb",
  cardShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
} as const;

function getFrom() {
  const address = process.env.MAIL_FROM_ADDRESS || "noreply@leadformhub.com";
  const name = process.env.MAIL_FROM_NAME || "LeadFormHub";
  return { address, name };
}

function getTransport() {
  if (process.env.MAIL_MAILER !== "smtp") return null;
  const host = process.env.MAIL_HOST;
  const username = process.env.MAIL_USERNAME;
  const password = process.env.MAIL_PASSWORD;
  if (!host || !username || !password) return null;
  const port = process.env.MAIL_PORT;
  const encryption = (process.env.MAIL_ENCRYPTION || "tls").toLowerCase();
  const secure = encryption === "ssl";
  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure,
    auth: { user: username, pass: password.trim() },
  });
}

/** True if SMTP is configured (MAIL_MAILER=smtp and MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD set). */
export function isEmailConfigured(): boolean {
  return getTransport() !== null;
}

/** Shared branded layout: clean header (no gradient bar), body slot, footer with background. */
function buildBrandedEmail(options: {
  headerSubtitle: string;
  body: string;
  title?: string;
}): string {
  const { headerSubtitle, body, title = "LeadFormHub" } = options;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0 0 6px; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
              <p style="margin:0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">${escapeHtml(headerSubtitle)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Email verification template: clean header, flat CTA, notice box. */
function buildVerificationEmail(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email · LeadFormHub</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:32px 32px 24px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
              <p style="margin:8px 0 0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">Verify your email address</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:8px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px;">
                    <p style="margin:0; font-size:12px; font-weight:600; color:#1d4ed8; letter-spacing:0.05em; text-transform:uppercase;">Email verification</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 12px; font-size:17px; font-weight:600; color:${EMAIL_STYLE.headerColor}; line-height:1.4;">One more step to activate your account</p>
              <p style="margin:0 0 24px; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">Thanks for signing up. Click the button below to verify your email address and get full access to your LeadFormHub dashboard.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:24px;">
                    <a href="${verifyUrl}" target="_blank" style="display:inline-block; padding:16px 32px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Verify my email</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 20px; font-size:12px; line-height:1.6; color:${EMAIL_STYLE.buttonBg}; word-break:break-all;">${escapeHtml(verifyUrl)}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.footerBg}; border:1px solid ${EMAIL_STYLE.cardBorderSolid}; border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:${EMAIL_STYLE.bodyColor};">This link expires in 24 hours</p>
                    <p style="margin:0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">If you didn't create a LeadFormHub account, you can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<boolean> {
  const subject = "Verify your LeadFormHub email";
  const html = buildVerificationEmail(verifyUrl);
  return sendEmail(to, subject, html);
}

/** Welcome email: clean header with badge, flat CTA. */
function buildWelcomeEmail(name?: string): string {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const dashboardUrl = `${getBaseUrlForEmail()}/login`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LeadFormHub</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:32px 32px 24px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
              <p style="margin:8px 0 0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">Welcome</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:8px 14px; background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px;">
                    <p style="margin:0; font-size:12px; font-weight:600; color:#059669; letter-spacing:0.05em; text-transform:uppercase;">Welcome</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 12px; font-size:17px; font-weight:600; color:${EMAIL_STYLE.headerColor}; line-height:1.4;">You're all set</p>
              <p style="margin:0 0 20px; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">${greeting}</p>
              <p style="margin:0 0 20px; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">Thank you for signing up. We built LeadFormHub because we wanted a simple, focused way to create forms and capture leads—without the bloat of generic form builders or the lock-in of big platforms.</p>
              <p style="margin:0 0 24px; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">Whether you need contact forms, lead magnets, or OTP-verified submissions, you get a clean dashboard, exportable leads, and a straightforward experience. No unnecessary features, just what you need to grow your business.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:24px;">
                    <a href="${dashboardUrl}" target="_blank" style="display:inline-block; padding:16px 32px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Go to dashboard</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">You can start by creating your first form from your dashboard. If you have questions, check our FAQ or reach out through the support page.</p>
              <p style="margin:0; font-size:15px; line-height:1.65; color:${EMAIL_STYLE.bodyColor};">We're glad you're here.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Welcome email sent after signup (email or OAuth). Same look and feel as verification email. */
export async function sendWelcomeEmail(to: string, name?: string): Promise<boolean> {
  const subject = "Welcome to LeadFormHub";
  const html = buildWelcomeEmail(name);
  return sendEmail(to, subject, html);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const subject = "Reset your LeadFormHub password";
  const html = buildBrandedEmail({
    headerSubtitle: "Reset your password",
    body: `
      <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">You requested a password reset. Click the button below to set a new password.</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 24px;"><tr><td><a href="${resetUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Reset password</a></td></tr></table>
      <p style="margin:0 0 8px; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">This link expires in 1 hour.</p>
      <p style="margin:0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">If you didn't request this, you can safely ignore this email.</p>
    `,
  });
  return sendEmail(to, subject, html);
}

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  const subject = "Your verification code";
  const html = buildOtpVerificationEmail(otp);
  return sendEmail(to, subject, html);
}

/** OTP verification email: clean card, prominent code block. */
function buildOtpVerificationEmail(otp: string): string {
  const safeOtp = escapeHtml(otp);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your verification code</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0 0 6px; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
              <p style="margin:0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 12px; font-size:16px; font-weight:600; color:${EMAIL_STYLE.headerColor};">Your verification code</p>
              <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">Use this one-time code to complete your form submission. Enter it where prompted.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:24px; background:${EMAIL_STYLE.footerBg}; border-radius:12px; border:1px solid ${EMAIL_STYLE.cardBorderSolid};">
                    <span style="font-size:32px; font-weight:700; letter-spacing:0.35em; color:${EMAIL_STYLE.headerColor}; font-variant-numeric:tabular-nums;">${safeOtp}</span>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">Valid for <strong style="color:${EMAIL_STYLE.bodyColor};">5 minutes</strong>. Do not share this code with anyone.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.footerColor};">If you didn't request this code, you can safely ignore this email. ${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendDeleteAccountConfirmation(to: string, confirmUrl: string): Promise<boolean> {
  const subject = "Confirm account deletion · LeadFormHub";
  const html = buildBrandedEmail({
    headerSubtitle: "Confirm account deletion",
    body: `
      <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">You requested to delete your LeadFormHub account. Click the button below to permanently delete your account. This cannot be undone.</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 24px;"><tr><td><a href="${confirmUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:#dc2626; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Delete my account</a></td></tr></table>
      <p style="margin:0 0 8px; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">This link expires in 1 hour.</p>
      <p style="margin:0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">If you didn't request this, you can safely ignore this email. Your account is safe.</p>
    `,
  });
  return sendEmail(to, subject, html);
}

export async function sendEmailChangeVerification(to: string, verifyUrl: string): Promise<boolean> {
  const subject = "Confirm your new email address";
  const html = buildBrandedEmail({
    headerSubtitle: "Confirm your new email",
    body: `
      <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">You requested to change your LeadFormHub account email address. Click the button below to confirm this change.</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 24px;"><tr><td><a href="${verifyUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Confirm new email</a></td></tr></table>
      <p style="margin:0 0 8px; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">This link expires in 1 hour.</p>
      <p style="margin:0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">If you didn't request this change, you can safely ignore this email.</p>
    `,
  });
  return sendEmail(to, subject, html);
}

/** Notify form owner (admin) when a new lead arrives. */
export async function sendNewLeadNotification(
  adminEmail: string,
  payload: { name: string; email: string; source: string; formName: string; username?: string }
): Promise<boolean> {
  const subject = `New lead: ${payload.formName}`;
  const dashboardUrl = payload.username
    ? `${getBaseUrlForEmail()}/${encodeURIComponent(payload.username)}/dashboard`
    : `${getBaseUrlForEmail()}/login`;
  const html = buildBrandedEmail({
    headerSubtitle: "New lead received",
    body: `
      <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">You have a new submission from your form <strong style="color:${EMAIL_STYLE.headerColor};">"${escapeHtml(payload.formName)}"</strong>.</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%; background:${EMAIL_STYLE.footerBg}; border:1px solid ${EMAIL_STYLE.cardBorderSolid}; border-radius:12px; margin-bottom:24px; overflow:hidden;">
        <tr><td style="padding:16px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:11px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; letter-spacing:0.06em; text-transform:uppercase;">Lead details</td></tr>
        <tr><td style="padding:0;">
          <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:13px; color:${EMAIL_STYLE.mutedColor}; width:100px;">Name</td><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px; font-weight:500; color:${EMAIL_STYLE.headerColor};">${escapeHtml(payload.name)}</td></tr>
            <tr><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:13px; color:${EMAIL_STYLE.mutedColor};">Email</td><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px;"><a href="mailto:${escapeHtml(payload.email)}" style="color:${EMAIL_STYLE.buttonBg}; text-decoration:none; font-weight:500;">${escapeHtml(payload.email)}</a></td></tr>
            <tr><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:13px; color:${EMAIL_STYLE.mutedColor};">Source</td><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px; color:${EMAIL_STYLE.headerColor};">${escapeHtml(payload.source)}</td></tr>
            <tr><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:13px; color:${EMAIL_STYLE.mutedColor};">Form</td><td style="padding:14px 20px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px; font-weight:500; color:${EMAIL_STYLE.headerColor};">${escapeHtml(payload.formName)}</td></tr>
          </table>
        </td></tr>
      </table>
      <table cellpadding="0" cellspacing="0" role="presentation"><tr><td><a href="${dashboardUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">View leads in dashboard</a></td></tr></table>
      <p style="margin:14px 0 0; font-size:13px; line-height:1.5; color:${EMAIL_STYLE.mutedColor};">View and manage all leads in your LeadFormHub dashboard.</p>
    `,
  });
  return sendEmail(adminEmail, subject, html);
}

/** Notify support staff when a user submits a support request. */
export async function sendSupportRequestNotification(
  supportEmail: string,
  payload: {
    ticketNumber: string;
    userName: string;
    userEmail: string;
    username: string;
    category: string;
    subject: string;
    message: string;
    requestId: string;
  }
): Promise<boolean> {
  const categoryLabels: Record<string, string> = {
    billing: "Billing",
    bug: "Bug Report",
    feature: "Feature Request",
    general: "General",
    other: "Other",
  };
  const categoryLabel = categoryLabels[payload.category] ?? payload.category;
  const subject = getTicketThreadSubject(payload.ticketNumber, payload.subject);
  const html = buildSupportRequestEmailHtml({
    ticketNumber: payload.ticketNumber,
    categoryLabel,
    subject: payload.subject,
    message: payload.message,
    userName: payload.userName,
    userEmail: payload.userEmail,
    username: payload.username,
    requestId: payload.requestId,
  });
  // Reply-To: user's email so when support clicks "Reply", the reply goes to the user's inbox
  return sendEmail(supportEmail, subject, html, { replyTo: payload.userEmail });
}

/** Notify support when someone submits the public support form (no login). */
export async function sendPublicSupportFormNotification(
  supportEmail: string,
  payload: { name: string; email: string; subject: string; message: string }
): Promise<boolean> {
  const subject = `[Support] ${payload.subject}`;
  const html = buildPublicSupportFormEmailHtml(payload);
  return sendEmail(supportEmail, subject, html, { replyTo: payload.email });
}

function buildPublicSupportFormEmailHtml(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const { name, email, subject, message } = payload;
  const body = `
    <p style="margin:0 0 12px; font-size:14px; color:${EMAIL_STYLE.mutedColor};">From: <strong>${escapeHtml(name)}</strong> &lt;<a href="mailto:${escapeHtml(email)}" style="color:${EMAIL_STYLE.buttonBg}; text-decoration:none;">${escapeHtml(email)}</a>&gt;</p>
    <p style="margin:0 0 8px; font-size:14px; font-weight:600; color:${EMAIL_STYLE.bodyColor};">Subject:</p>
    <p style="margin:0 0 16px; font-size:15px; color:${EMAIL_STYLE.headerColor};">${escapeHtml(subject)}</p>
    <p style="margin:0 0 8px; font-size:14px; font-weight:600; color:${EMAIL_STYLE.bodyColor};">Message:</p>
    <p style="margin:0; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor}; white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;
  return buildBrandedEmail({
    headerSubtitle: "New support form submission",
    body,
    title: "Support form",
  });
}

/** Email the user when support posts a reply (e.g. from dashboard). Uses Re: + thread subject so it stays in the same thread. */
export async function sendSupportReplyToUser(
  userEmail: string,
  payload: { ticketNumber: string; subject: string; replyBody: string }
): Promise<boolean> {
  const threadSubject = getTicketThreadSubject(payload.ticketNumber, payload.subject);
  const subject = `Re: ${threadSubject}`;
  const html = buildSupportReplyEmailHtml(payload.replyBody);
  return sendEmail(userEmail, subject, html);
}

function buildSupportReplyEmailHtml(replyBody: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
        <tr><td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
          <p style="margin:0 0 6px; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
          <p style="margin:0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">Support</p>
        </td></tr>
        <tr><td style="padding:28px 32px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor}; white-space:pre-wrap;">${escapeHtml(replyBody)}</td></tr>
        <tr><td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg}; font-size:12px; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Notify support when the user adds a reply in the dashboard thread. Uses thread subject so it stays in the same inbox thread. */
export async function sendUserReplyNotificationToSupport(
  supportEmail: string,
  payload: {
    ticketNumber: string;
    subject: string;
    userName: string;
    userEmail: string;
    replyBody: string;
  }
): Promise<boolean> {
  const threadSubject = getTicketThreadSubject(payload.ticketNumber, payload.subject);
  const subject = `Re: ${threadSubject}`;
  const html = buildUserReplyNotificationToSupportHtml(payload);
  return sendEmail(supportEmail, subject, html, { replyTo: payload.userEmail });
}

function buildUserReplyNotificationToSupportHtml(payload: {
  ticketNumber: string;
  userName: string;
  userEmail: string;
  replyBody: string;
}): string {
  const { ticketNumber, userName, userEmail, replyBody } = payload;
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
        <tr><td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
          <p style="margin:0 0 6px; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
          <p style="margin:0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">New reply on ticket ${escapeHtml(ticketNumber)}</p>
        </td></tr>
        <tr><td style="padding:0 32px 8px; font-size:13px; color:${EMAIL_STYLE.mutedColor};">From: ${escapeHtml(userName)} &lt;<a href="mailto:${escapeHtml(userEmail)}" style="color:${EMAIL_STYLE.buttonBg}; text-decoration:none;">${escapeHtml(userEmail)}</a>&gt;</td></tr>
        <tr><td style="padding:0 32px 28px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor}; white-space:pre-wrap;">${escapeHtml(replyBody)}</td></tr>
        <tr><td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg}; font-size:12px; color:${EMAIL_STYLE.footerColor};">The user added this reply from the dashboard. Reply to this email to respond. ${EMAIL_STYLE.footerTagline}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Shared thread subject so all emails (confirmation, support notification, replies) thread in the inbox. */
export function getTicketThreadSubject(ticketNumber: string, subject: string): string {
  return `Ticket ${ticketNumber}: ${subject}`;
}

/** Send confirmation to the user when they raise a ticket. Uses thread subject so replies stay in the same thread. */
export async function sendTicketConfirmationToUser(
  userEmail: string,
  payload: { ticketNumber: string; subject: string; categoryLabel: string }
): Promise<boolean> {
  const subject = getTicketThreadSubject(payload.ticketNumber, payload.subject);
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.MAIL_SUPPORT_TO;
  const html = buildTicketConfirmationEmailHtml({
    ticketNumber: payload.ticketNumber,
    subject: payload.subject,
    categoryLabel: payload.categoryLabel,
    supportEmail: supportEmail?.trim() ?? "",
  });
  // Reply-To: support so if the user replies to this email, it goes to support
  const opts = supportEmail?.trim() ? { replyTo: supportEmail.trim() } : undefined;
  return sendEmail(userEmail, subject, html, opts);
}

/** Plan expiry reminder (3 days before). */
export async function sendPlanExpiryReminder(
  to: string,
  planName: string,
  expiryDate: Date,
  upgradeUrl: string
): Promise<boolean> {
  const dateStr = expiryDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const body = `
    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">Your ${escapeHtml(planName)} plan expires on <strong>${escapeHtml(dateStr)}</strong>.</p>
    <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">Renew to keep access to Pro features. After a 1-day grace period you'll be moved to Free and some features will be limited (e.g. only 3 active forms, 50 leads per month).</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td><a href="${upgradeUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px;">Renew or upgrade</a></td></tr></table>
  `;
  const html = buildBrandedEmail({
    headerSubtitle: "Plan expiry reminder",
    body,
    title: "Plan expiry reminder · LeadFormHub",
  });
  return sendEmail(to, "Your LeadFormHub plan expires soon", html);
}

/** User-facing ticket confirmation email. */
function buildTicketConfirmationEmailHtml(options: {
  ticketNumber: string;
  subject: string;
  categoryLabel: string;
  supportEmail: string;
}): string {
  const { ticketNumber, subject, categoryLabel, supportEmail } = options;
  const supportPageUrl = `${getBaseUrlForEmail()}/support`;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request received ${escapeHtml(ticketNumber)}</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0 0 6px; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
              <p style="margin:0; font-size:13px; color:${EMAIL_STYLE.subtitleColor};">Support request received</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor};">We've received your request and our team will get back to you soon.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.footerBg}; border:1px solid ${EMAIL_STYLE.cardBorderSolid}; border-radius:10px; margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px; text-align:center;">
                    <p style="margin:0 0 4px; font-size:11px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; letter-spacing:0.08em; text-transform:uppercase;">Your ticket number</p>
                    <p style="margin:0; font-size:22px; font-weight:700; color:${EMAIL_STYLE.headerColor}; font-variant-numeric:tabular-nums;">${escapeHtml(ticketNumber)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:${EMAIL_STYLE.bodyColor};">Subject</p>
              <p style="margin:0 0 16px; font-size:15px; color:${EMAIL_STYLE.headerColor};">${escapeHtml(subject)}</p>
              <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:${EMAIL_STYLE.bodyColor};">Category</p>
              <p style="margin:0 0 20px; font-size:14px; color:${EMAIL_STYLE.bodyColor};">${escapeHtml(categoryLabel)}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#1d4ed8;">Where to see replies</p>
                    <p style="margin:0; font-size:14px; line-height:1.5; color:#1e3a8a;">When our team replies to your ticket, the reply will be sent to <strong>this email address</strong>. Check your inbox (and spam folder) for messages from LeadFormHub or our support team.</p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px auto 0;"><tr><td><a href="${supportPageUrl}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; background:${EMAIL_STYLE.buttonBg}; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">Open support page</a></td></tr></table>
              ${supportEmail ? `<p style="margin:16px 0 0; font-size:13px; color:${EMAIL_STYLE.mutedColor};">You can also reply to this email to add more information; your reply will go to our support team.</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:12px; line-height:1.5; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Attractive support ticket email: ticket number prominent, clean layout. */
function buildSupportRequestEmailHtml(options: {
  ticketNumber: string;
  categoryLabel: string;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
  username: string;
  requestId: string;
}): string {
  const { ticketNumber, categoryLabel, subject, message, userName, userEmail, username, requestId } = options;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Support ticket ${escapeHtml(ticketNumber)}</title>
</head>
<body style="margin:0; padding:0; background:${EMAIL_STYLE.bg}; font-family:${EMAIL_STYLE.fontFamily}; -webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.bg};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px; background:#ffffff; border-radius:16px; box-shadow:${EMAIL_STYLE.cardShadow}; overflow:hidden; border:1px solid ${EMAIL_STYLE.cardBorder};">
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid ${EMAIL_STYLE.cardBorderSolid};">
              <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:${EMAIL_STYLE.subtitleColor}; letter-spacing:0.05em; text-transform:uppercase;">New support request</p>
              <p style="margin:0; font-size:20px; font-weight:700; color:${EMAIL_STYLE.headerColor}; letter-spacing:-0.02em;">LeadFormHub</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${EMAIL_STYLE.headerColor}; border-radius:12px; overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px; text-align:center;">
                    <p style="margin:0 0 4px; font-size:11px; font-weight:600; color:rgba(255,255,255,0.7); letter-spacing:0.1em; text-transform:uppercase;">Ticket number</p>
                    <p style="margin:0; font-size:28px; font-weight:800; color:#ffffff; letter-spacing:0.02em; font-variant-numeric:tabular-nums;">${escapeHtml(ticketNumber)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 8px; font-size:12px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; text-transform:uppercase; letter-spacing:0.05em;">Category</p>
              <span style="display:inline-block; padding:6px 14px; background:#e0f2fe; color:#0369a1; font-size:13px; font-weight:600; border-radius:9999px;">${escapeHtml(categoryLabel)}</span>
              <p style="margin:20px 0 8px; font-size:12px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; text-transform:uppercase; letter-spacing:0.05em;">Subject</p>
              <p style="margin:0 0 20px; font-size:17px; font-weight:600; color:${EMAIL_STYLE.headerColor}; line-height:1.4;">${escapeHtml(subject)}</p>
              <p style="margin:0 0 8px; font-size:12px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; text-transform:uppercase; letter-spacing:0.05em;">Message</p>
              <div style="padding:18px 20px; background:${EMAIL_STYLE.footerBg}; border:1px solid ${EMAIL_STYLE.cardBorderSolid}; border-radius:10px; font-size:15px; line-height:1.6; color:${EMAIL_STYLE.bodyColor}; white-space:pre-wrap;">${escapeHtml(message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${EMAIL_STYLE.cardBorderSolid}; border-radius:10px; overflow:hidden;">
                <tr><td style="padding:12px 16px; background:${EMAIL_STYLE.footerBg}; font-size:11px; font-weight:600; color:${EMAIL_STYLE.mutedColor}; text-transform:uppercase; letter-spacing:0.05em;">From</td></tr>
                <tr><td style="padding:0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                    <tr><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:12px; color:${EMAIL_STYLE.mutedColor}; width:100px;">Name</td><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px; font-weight:500; color:${EMAIL_STYLE.headerColor};">${escapeHtml(userName)}</td></tr>
                    <tr><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:12px; color:${EMAIL_STYLE.mutedColor};">Email</td><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px;"><a href="mailto:${escapeHtml(userEmail)}" style="color:${EMAIL_STYLE.buttonBg}; text-decoration:none; font-weight:500;">${escapeHtml(userEmail)}</a></td></tr>
                    <tr><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:12px; color:${EMAIL_STYLE.mutedColor};">Username</td><td style="padding:14px 16px; border-top:1px solid ${EMAIL_STYLE.cardBorderSolid}; font-size:14px; font-weight:500; color:${EMAIL_STYLE.headerColor};">${escapeHtml(username)}</td></tr>
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 24px; border-top:1px solid ${EMAIL_STYLE.footerBorder}; background:${EMAIL_STYLE.footerBg};">
              <p style="margin:0; font-size:11px; color:${EMAIL_STYLE.footerColor};">Request ID: ${escapeHtml(requestId)} · Use ${escapeHtml(ticketNumber)} when replying to the user.</p>
              <p style="margin:8px 0 0; font-size:12px; color:${EMAIL_STYLE.footerColor};">${EMAIL_STYLE.footerTagline}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: { replyTo?: string }
): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] Email would be sent to", to, subject, options?.replyTo ? `replyTo=${options.replyTo}` : "");
      return true;
    }
    console.error("[email] SMTP not configured (MAIL_MAILER, MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD). Email not sent.");
    return false;
  }
  const { address, name } = getFrom();
  try {
    await transport.sendMail({
      from: `${name} <${address}>`,
      to,
      subject,
      html,
      ...(options?.replyTo ? { replyTo: options.replyTo } : {}),
    });
    return true;
  } catch (e) {
    console.error("Email send error:", e);
    return false;
  }
}
