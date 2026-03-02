"use client";

import { useState, useEffect, useCallback } from "react";
import type { FormFieldSchema } from "@/lib/form-schema";
import { validateName, validateEmail, validatePhone, isNameField } from "@/lib/validators";
import { trackFacebookLead } from "@/lib/facebook-pixel";

/** reCAPTCHA v3 (score-based): load with render=siteKey for execute() */
function getRecaptchaScriptUrl(siteKey: string): string {
  return `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
}

/** Read UTM params from current URL (client-side). Returns object with only present keys. */
function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  for (const key of keys) {
    const v = params.get(key)?.trim();
    if (v) utm[key] = v;
  }
  return utm;
}

export function PublicForm({
  formId,
  fields,
  mobileOtpEnabled,
  emailOtpEnabled,
  redirectUrl,
  submissionsEnabled = true,
  showBranding = false,
  recaptchaSiteKey = null,
}: {
  formId: string;
  fields: FormFieldSchema[];
  mobileOtpEnabled: boolean;
  emailOtpEnabled?: boolean;
  redirectUrl: string | null;
  submissionsEnabled?: boolean;
  showBranding?: boolean;
  recaptchaSiteKey?: string | null;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const phoneField = fields.find((f) => f.type === "phone");
  const emailField = fields.find((f) => f.type === "email");
  /** reCAPTCHA is enabled for all forms when site key is set (from env). */
  const recaptchaEnabled = Boolean(recaptchaSiteKey);
  const needsOtp = mobileOtpEnabled && phoneField;
  const needsEmailOtp = emailOtpEnabled && emailField;
  const canSubmit =
    submissionsEnabled &&
    (!needsOtp || otpVerified) &&
    (!needsEmailOtp || emailOtpVerified);

  const validateField = useCallback((f: FormFieldSchema, value: string): string | null => {
    const v = (value ?? "").trim();
    if (v === "") return null;
    if (f.type === "email") return validateEmail(v);
    if (f.type === "phone") return validatePhone(v);
    if (isNameField(f)) return validateName(v);
    return null;
  }, []);

  const validateAllFields = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.type === "hidden" || f.type === "recaptcha") continue;
      const v = values[f.id] ?? "";
      if (f.required && !v.trim()) {
        errs[f.id] = `${f.label} is required.`;
      } else {
        const msg = validateField(f, v);
        if (msg) errs[f.id] = msg;
      }
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstId = Object.keys(errs)[0];
      setTimeout(() => {
        document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return false;
    }
    return true;
  }, [fields, values, validateField]);

  useEffect(() => {
    if (!recaptchaSiteKey) return;
    if (typeof window === "undefined") return;
    const scriptUrl = getRecaptchaScriptUrl(recaptchaSiteKey);
    if (document.querySelector(`script[src^="https://www.google.com/recaptcha/api.js"]`)) {
      setRecaptchaReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaReady(true);
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  async function handleSendOtp() {
    const p = phoneField ? (values[phoneField.id] || phone) : "";
    if (!p) {
      setError("Enter phone number first");
      return;
    }
    const phoneErr = validatePhone(p);
    if (phoneErr) {
      setError(phoneErr);
      setFieldErrors((prev) => (phoneField ? { ...prev, [phoneField.id]: phoneErr } : prev));
      return;
    }
    setError("");
    setFieldErrors((prev) => (phoneField ? { ...prev, [phoneField.id]: "" } : prev));
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, phone: p }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setPhone(p);
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, phone: phone || (phoneField ? values[phoneField.id] : ""), otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }
      setOtpVerified(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmailOtp() {
    const e = emailField ? (values[emailField.id] || verifiedEmail) : "";
    if (!e) {
      setError("Enter email address first");
      return;
    }
    const emailErr = validateEmail(e);
    if (emailErr) {
      setError(emailErr);
      setFieldErrors((prev) => (emailField ? { ...prev, [emailField.id]: emailErr } : prev));
      return;
    }
    setError("");
    setFieldErrors((prev) => (emailField ? { ...prev, [emailField.id]: "" } : prev));
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, email: e.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Failed to send OTP");
        return;
      }
      setVerifiedEmail(e.trim());
      setEmailOtpSent(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmailOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          email: verifiedEmail || (emailField ? values[emailField.id] : ""),
          otp: emailOtpCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }
      setEmailOtpVerified(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      if (needsOtp && !otpVerified) setError("Please verify your phone with OTP first.");
      else if (needsEmailOtp && !emailOtpVerified) setError("Please verify your email with OTP first.");
      else setError("Please complete verification before submitting.");
      return;
    }
    if (!validateAllFields()) {
      setError("Please correct the errors below.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let recaptchaToken: string | undefined;
      if (recaptchaEnabled && recaptchaSiteKey && typeof window !== "undefined") {
        const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
        if (!g?.execute) {
          setError("reCAPTCHA is still loading. Please try again.");
          setLoading(false);
          return;
        }
        try {
          recaptchaToken = await new Promise<string>((resolve, reject) => {
            g.ready(() => {
              g.execute(recaptchaSiteKey!, { action: "submit" })
                .then(resolve)
                .catch(reject);
            });
          });
        } catch {
          setError("reCAPTCHA could not run. Please refresh and try again.");
          setLoading(false);
          return;
        }
        if (!recaptchaToken?.trim()) {
          setError("reCAPTCHA verification failed. Please try again.");
          setLoading(false);
          return;
        }
      }
      const payload: Record<string, unknown> = {
        formId,
        data: values,
        recaptchaToken,
      };
      if (typeof window !== "undefined") {
        const utm = getUtmParams();
        if (Object.keys(utm).length > 0) payload.utm = utm;
        if (document.referrer) payload.referrerUrl = document.referrer;
        payload.landingPageUrl = window.location.href;
      }
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }
      setSuccess(true);
      trackFacebookLead();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const formBranding = showBranding ? (
    <div
      className="mt-4 pt-4 border-t border-neutral-200 flex flex-col items-center justify-center gap-0.5 text-center"
      aria-label="LeadFormHub branding"
    >
      <a
        href="https://www.leadformhub.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-500 hover:text-neutral-700 text-sm font-medium transition-colors inline-flex flex-col items-center gap-0.5"
      >
        <span>Powered by LeadFormHub</span>
        <span className="text-neutral-400 text-xs">Start For Free</span>
      </a>
    </div>
  ) : null;

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 text-center w-full max-w-full min-w-0">
        <p className="text-green-600 font-medium">Thank you! Your response has been submitted.</p>
        {formBranding}
      </div>
    );
  }

  const optionsList = (f: FormFieldSchema) =>
    Array.isArray(f.options) ? f.options : (f.options ? String(f.options).split("\n").map((o) => o.trim()).filter(Boolean) : []);

  return (
    <form onSubmit={handleSubmit} className="card-padding bg-white rounded-xl border border-neutral-200 space-y-4 w-full max-w-full min-w-0 box-border">
      {error && <p className="text-red-600 text-base">{error}</p>}
      {fields
        .filter((f) => f.type !== "hidden")
        .map((f) => (
          <div key={f.id} id={`field-${f.id}`}>
            {f.type !== "checkbox" && (
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {f.label}
                {f.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {f.type === "text" && (
              <>
                <input
                  type="text"
                  name={f.id}
                  value={values[f.id] ?? ""}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.id]: e.target.value }));
                    if (fieldErrors[f.id]) setFieldErrors((prev) => ({ ...prev, [f.id]: "" }));
                  }}
                  onBlur={() => {
                    const msg = validateField(f, values[f.id] ?? "");
                    setFieldErrors((prev) => (msg ? { ...prev, [f.id]: msg } : { ...prev, [f.id]: "" }));
                  }}
                  required={f.required}
                  className={`w-full min-w-0 border rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm ${
                    fieldErrors[f.id] ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {fieldErrors[f.id] && <p className="mt-1 text-red-600 text-base">{fieldErrors[f.id]}</p>}
              </>
            )}
            {f.type === "email" && (
              <>
                <input
                  type="email"
                  name={f.id}
                  value={values[f.id] ?? ""}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.id]: e.target.value }));
                    if (fieldErrors[f.id]) setFieldErrors((prev) => ({ ...prev, [f.id]: "" }));
                  }}
                  onBlur={() => {
                    const msg = validateField(f, values[f.id] ?? "");
                    setFieldErrors((prev) => (msg ? { ...prev, [f.id]: msg } : { ...prev, [f.id]: "" }));
                  }}
                  required={f.required}
                  className={`w-full min-w-0 border rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm ${
                    fieldErrors[f.id] ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {fieldErrors[f.id] && <p className="mt-1 text-red-600 text-base">{fieldErrors[f.id]}</p>}
                {needsEmailOtp && emailField?.id === f.id && submissionsEnabled && (
                  <div className="mt-3 space-y-2">
                    {!emailOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={loading}
                        className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 disabled:opacity-50"
                      >
                        Send OTP
                      </button>
                    ) : !emailOtpVerified ? (
                      <>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="Enter 6-digit OTP"
                          value={emailOtpCode}
                          onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 text-base sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyEmailOtp}
                          disabled={loading || emailOtpCode.length !== 6}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Verify OTP
                        </button>
                      </>
                    ) : (
                      <p className="text-green-600 text-base">Email verified</p>
                    )}
                  </div>
                )}
              </>
            )}
            {f.type === "number" && (
              <input
                type="number"
                name={f.id}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                required={f.required}
                className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm"
              />
            )}
            {f.type === "phone" && (
              <>
                <input
                  type="tel"
                  name={f.id}
                  value={values[f.id] ?? ""}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.id]: e.target.value }));
                    if (fieldErrors[f.id]) setFieldErrors((prev) => ({ ...prev, [f.id]: "" }));
                  }}
                  onBlur={() => {
                    const msg = validateField(f, values[f.id] ?? "");
                    setFieldErrors((prev) => (msg ? { ...prev, [f.id]: msg } : { ...prev, [f.id]: "" }));
                  }}
                  required={f.required}
                  className={`w-full min-w-0 border rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm ${
                    fieldErrors[f.id] ? "border-red-500" : "border-neutral-300"
                  }`}
                />
                {fieldErrors[f.id] && <p className="mt-1 text-red-600 text-base">{fieldErrors[f.id]}</p>}
                {needsOtp && phoneField?.id === f.id && submissionsEnabled && (
                  <div className="mt-3 space-y-2">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700 disabled:opacity-50"
                      >
                        Send OTP
                      </button>
                    ) : !otpVerified ? (
                      <>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="Enter 6-digit OTP"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 text-base sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={loading || otpCode.length !== 6}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Verify OTP
                        </button>
                      </>
                    ) : (
                      <p className="text-green-600 text-base">Phone verified</p>
                    )}
                  </div>
                )}
              </>
            )}
            {f.type === "textarea" && (
              <textarea
                name={f.id}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                required={f.required}
                rows={3}
                className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm"
              />
            )}
            {(f.type === "select" || f.type === "dropdown") && (
              <select
                name={f.id}
                value={values[f.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                required={f.required}
                className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 placeholder:text-neutral-400 text-base sm:text-sm"
              >
                <option value="">Select...</option>
                {optionsList(f).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {f.type === "radio" && (
              <div className="space-y-2">
                {optionsList(f).map((opt) => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={f.id}
                      value={opt}
                      checked={(values[f.id] ?? "") === opt}
                      onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {f.type === "checkbox" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={f.id}
                  checked={(values[f.id] ?? "") === "on" || values[f.id] === "true"}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.checked ? "true" : "" }))}
                />
                <span className="text-sm text-neutral-700">{f.label}</span>
              </label>
            )}
            {f.type === "file" && (
              <input
                type="file"
                name={f.id}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValues((v) => ({ ...v, [f.id]: file.name }));
                }}
                required={f.required}
                className="w-full min-w-0 border border-neutral-300 rounded-lg px-3 py-2.5 sm:py-2 bg-white text-neutral-900 text-base sm:text-sm"
              />
            )}
            {f.type === "recaptcha" && (
              <p className="text-neutral-500 text-xs">
                This form is protected by reCAPTCHA (score-based). Verification runs when you submit.
              </p>
            )}
          </div>
        ))}
      {!submissionsEnabled && (
        <p className="text-amber-700 text-base bg-amber-50 rounded-lg px-3 py-2">
          This form is not accepting submissions at the moment.
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !canSubmit || !submissionsEnabled}
        className="w-full py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:bg-neutral-400 min-h-[44px] touch-manipulation"
      >
        {loading ? "Submitting…" : submissionsEnabled ? "Submit" : "Submissions Disabled"}
      </button>
      <p className="text-base text-neutral-500 text-center">
        We respect your privacy. Your data is never shared.
      </p>
      {formBranding}
    </form>
  );
}
