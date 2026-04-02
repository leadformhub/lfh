"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NavItem = "dashboard" | "setting";

export function SuperAdminShell({ usersCount }: { usersCount: number }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<NavItem>("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("");
  const [smtpSupportEmail, setSmtpSupportEmail] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpTestToEmail, setSmtpTestToEmail] = useState("");
  const [smtpTestLoading, setSmtpTestLoading] = useState(false);
  const [smtpTestMessage, setSmtpTestMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [smtpSaveLoading, setSmtpSaveLoading] = useState(false);
  const [smtpSaveMessage, setSmtpSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/super-admin/logout", { method: "POST" });
      router.push("/super-admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    if (activeItem !== "setting") return;
    let cancelled = false;

    async function loadSmtpSettings() {
      try {
        const res = await fetch("/api/super-admin/smtp", { method: "GET" });
        const data = await res.json();
        if (!res.ok || !data.smtp || cancelled) return;
        setSmtpHost(data.smtp.host || "");
        setSmtpPort(String(data.smtp.port || "587"));
        setSmtpUsername(data.smtp.username || "");
        setSmtpPassword(data.smtp.password || "");
        setSmtpFromEmail(data.smtp.fromEmail || "");
        setSmtpFromName(data.smtp.fromName || "");
        setSmtpSupportEmail(data.smtp.supportEmail || "");
        setSmtpSecure(Boolean(data.smtp.secure));
      } catch {
        // Keep UI usable even if saved settings fail to load.
      }
    }

    void loadSmtpSettings();
    return () => {
      cancelled = true;
    };
  }, [activeItem]);

  async function handleSaveSmtpSettings() {
    setSmtpSaveMessage(null);
    if (
      !smtpHost.trim() ||
      !smtpPort.trim() ||
      !smtpUsername.trim() ||
      !smtpPassword.trim() ||
      !smtpFromEmail.trim()
    ) {
      setSmtpSaveMessage({
        type: "error",
        text: "Please fill all required SMTP fields before saving.",
      });
      return;
    }

    setSmtpSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          username: smtpUsername.trim(),
          password: smtpPassword,
          fromEmail: smtpFromEmail.trim(),
          fromName: smtpFromName.trim() || "",
          supportEmail: smtpSupportEmail.trim() || "",
          secure: smtpSecure,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSmtpSaveMessage({ type: "error", text: data.error || "Failed to save SMTP settings." });
        return;
      }
      setSmtpSaveMessage({ type: "success", text: data.message || "SMTP settings saved." });
    } catch {
      setSmtpSaveMessage({ type: "error", text: "Something went wrong while saving SMTP settings." });
    } finally {
      setSmtpSaveLoading(false);
    }
  }

  async function handleSendTestEmail() {
    setSmtpTestMessage(null);

    if (!smtpTestToEmail.trim()) {
      setSmtpTestMessage({
        type: "error",
        text: "Please enter Test To Email.",
      });
      return;
    }

    setSmtpTestLoading(true);
    try {
      const res = await fetch("/api/super-admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          username: smtpUsername.trim(),
          password: smtpPassword,
          fromEmail: smtpFromEmail.trim(),
          fromName: smtpFromName.trim() || undefined,
          secure: smtpSecure,
          testToEmail: smtpTestToEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSmtpTestMessage({ type: "error", text: data.error || "Failed to send test email." });
        return;
      }

      setSmtpTestMessage({
        type: "success",
        text: data.message || "Test email sent successfully.",
      });
    } catch {
      setSmtpTestMessage({
        type: "error",
        text: "Something went wrong while sending test email.",
      });
    } finally {
      setSmtpTestLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="w-64 border-r border-gray-200 bg-white p-4">
          <h1 className="mb-6 text-lg font-semibold text-gray-900">Super Admin</h1>
          <button
            type="button"
            onClick={() => setActiveItem("dashboard")}
            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "dashboard"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveItem("setting")}
            className={`mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "setting"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Setting
          </button>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <p className="text-base font-semibold text-gray-900">
              {activeItem === "dashboard" ? "Dashboard" : "Setting"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </header>

          <div className="p-6">
            {activeItem === "dashboard" ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Users Count</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{usersCount}</p>
              </div>
            ) : null}
            {activeItem === "setting" ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 1</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    SMTP Email Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure SMTP provider details for outgoing emails.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="587"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Username
                      </label>
                      <input
                        type="text"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        placeholder="smtp-user"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Password
                      </label>
                      <input
                        type="password"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={smtpFromEmail}
                        onChange={(e) => setSmtpFromEmail(e.target.value)}
                        placeholder="noreply@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={smtpFromName}
                        onChange={(e) => setSmtpFromName(e.target.value)}
                        placeholder="LeadFormHub"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={smtpSupportEmail}
                        onChange={(e) => setSmtpSupportEmail(e.target.value)}
                        placeholder="support@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={smtpSecure}
                          onChange={(e) => setSmtpSecure(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Use SSL/TLS (secure connection)
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveSmtpSettings}
                        disabled={smtpSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {smtpSaveLoading ? "Saving..." : "Save SMTP Settings"}
                      </button>
                    </div>

                    {smtpSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          smtpSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {smtpSaveMessage.text}
                      </div>
                    ) : null}

                    <div className="md:col-span-2 mt-2 border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-800">Test Email</p>
                      <p className="mt-1 text-xs text-gray-600">
                        Send a test email using the current SMTP values above.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Test To Email
                      </label>
                      <input
                        type="email"
                        value={smtpTestToEmail}
                        onChange={(e) => setSmtpTestToEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={smtpTestLoading}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {smtpTestLoading ? "Sending..." : "Send Test Email"}
                      </button>
                    </div>

                    {smtpTestMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          smtpTestMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {smtpTestMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
