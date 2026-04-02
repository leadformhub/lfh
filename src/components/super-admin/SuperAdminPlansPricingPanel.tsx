"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDefaultFeatureComparison,
  PLAN_UNLIMITED_SENTINEL,
  type PlanPricingFullConfig,
} from "@/lib/super-admin-plan-pricing";

export function SuperAdminPlansPricingPanel() {
  const [config, setConfig] = useState<PlanPricingFullConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [featureJson, setFeatureJson] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/super-admin/plan-pricing", { method: "GET" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(typeof data.error === "string" ? data.error : "Failed to load.");
        return;
      }
      const c = data.config as PlanPricingFullConfig;
      setConfig(c);
      setFeatureJson(JSON.stringify(c.useCustomFeatureComparison ? c.customFeatureComparison : [], null, 2));
    } catch {
      setLoadError("Something went wrong while loading plan pricing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    if (!config) return;
    setSaveMessage(null);

    let customFeatureComparison = config.customFeatureComparison;
    if (config.useCustomFeatureComparison) {
      try {
        const parsed = JSON.parse(featureJson) as unknown;
        if (!Array.isArray(parsed)) {
          setSaveMessage({ type: "error", text: "Feature comparison must be a JSON array." });
          return;
        }
        customFeatureComparison = parsed as PlanPricingFullConfig["customFeatureComparison"];
      } catch {
        setSaveMessage({ type: "error", text: "Invalid JSON in feature comparison." });
        return;
      }
    }

    const payload: PlanPricingFullConfig = {
      ...config,
      customFeatureComparison,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/plan-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveMessage({ type: "error", text: typeof data.error === "string" ? data.error : "Save failed." });
        return;
      }
      if (data.config) setConfig(data.config as PlanPricingFullConfig);
      setSaveMessage({ type: "success", text: data.message || "Saved." });
    } catch {
      setSaveMessage({ type: "error", text: "Something went wrong while saving." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-600">Loading plan pricing…</p>;
  }
  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {loadError}
      </div>
    );
  }
  if (!config) return null;

  const planKeys = ["free", "pro", "business"] as const;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Plans and pricing</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure checkout amounts, plan limits, marketing copy, and the public feature comparison table. Changes apply to the marketing site, upgrades, and plan enforcement after a short cache window.
        </p>
      </div>

      {saveMessage ? (
        <div
          className={`rounded-lg border p-3 text-sm ${
            saveMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {saveMessage.text}
        </div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Checkout (Razorpay)</h3>
        <p className="mt-1 text-sm text-gray-600">Amounts in INR per order. Stored in paise internally.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Pro — rupees / month</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={Math.round(config.checkoutAmountsPaise.pro / 100)}
              onChange={(e) => {
                const v = Math.max(1, parseInt(e.target.value, 10) || 0);
                setConfig({
                  ...config,
                  checkoutAmountsPaise: { ...config.checkoutAmountsPaise, pro: v * 100 },
                });
              }}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Business — rupees / month</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={Math.round(config.checkoutAmountsPaise.business / 100)}
              onChange={(e) => {
                const v = Math.max(1, parseInt(e.target.value, 10) || 0);
                setConfig({
                  ...config,
                  checkoutAmountsPaise: { ...config.checkoutAmountsPaise, business: v * 100 },
                });
              }}
            />
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-gray-700">Plan validity (days after payment)</span>
          <input
            type="number"
            min={1}
            className="mt-1 w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Empty = use PLAN_VALIDITY_DAYS env"
            value={config.planValidityDays ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              setConfig({
                ...config,
                planValidityDays: raw === "" ? null : Math.max(1, parseInt(raw, 10) || 30),
              });
            }}
          />
        </label>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Plan limits</h3>
        <p className="mt-1 text-sm text-gray-600">
          Use {PLAN_UNLIMITED_SENTINEL.toLocaleString()} for unlimited forms or team members. Leave &quot;Max leads /
          month&quot; or &quot;OTP limit&quot; blank for unlimited / no OTP on that plan.
        </p>
        <div className="mt-4 space-y-6 overflow-x-auto">
          {planKeys.map((pk) => (
            <div key={pk} className="min-w-[640px] rounded-lg border border-gray-100 p-4">
              <p className="mb-3 text-sm font-semibold capitalize text-gray-800">{pk}</p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(
                  [
                    ["maxForms", "Max forms"],
                    ["maxTeamMembers", "Max team members"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="block text-xs">
                    <span className="text-gray-600">{label}</span>
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={config.limits[pk][key]}
                      onChange={(e) => {
                        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setConfig({
                          ...config,
                          limits: {
                            ...config.limits,
                            [pk]: { ...config.limits[pk], [key]: v },
                          },
                        });
                      }}
                    />
                  </label>
                ))}
                <label className="block text-xs">
                  <span className="text-gray-600">Max leads / month (blank = unlimited)</span>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                    value={config.limits[pk].maxLeadsPerMonth ?? ""}
                    placeholder="unlimited"
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setConfig({
                        ...config,
                        limits: {
                          ...config.limits,
                          [pk]: {
                            ...config.limits[pk],
                            maxLeadsPerMonth: raw === "" ? null : Math.max(0, parseInt(raw, 10) || 0),
                          },
                        },
                      });
                    }}
                  />
                </label>
                <label className="block text-xs">
                  <span className="text-gray-600">OTP limit / month (blank = no OTP)</span>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                    value={config.limits[pk].otpLimit ?? ""}
                    placeholder="none"
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setConfig({
                        ...config,
                        limits: {
                          ...config.limits,
                          [pk]: {
                            ...config.limits[pk],
                            otpLimit: raw === "" ? null : Math.max(0, parseInt(raw, 10) || 0),
                          },
                        },
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Marketing cards (pricing page & previews)</h3>
        <div className="mt-4 space-y-8">
          {planKeys.map((pk) => {
            const card = config.marketingCards[pk];
            return (
              <div key={pk} className="rounded-lg border border-gray-100 p-4">
                <p className="mb-3 text-sm font-semibold capitalize text-gray-800">{pk}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs sm:col-span-2">
                    <span className="text-gray-600">Display name</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.name}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, name: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-600">Price label</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.priceLabel}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, priceLabel: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-600">Strikethrough (optional)</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.strikethroughLabel ?? ""}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: {
                              ...card,
                              strikethroughLabel: e.target.value.trim() === "" ? null : e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="text-gray-600">Period</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.period}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, period: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-xs sm:col-span-2">
                    <span className="text-gray-600">Description</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.description}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, description: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="block text-xs sm:col-span-2">
                    <span className="text-gray-600">CTA label</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                      value={card.cta}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, cta: e.target.value },
                          },
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={card.highlighted}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: { ...card, highlighted: e.target.checked },
                          },
                        })
                      }
                    />
                    Highlight card
                  </label>
                  <label className="block text-xs sm:col-span-2">
                    <span className="text-gray-600">Feature bullets (one per line)</span>
                    <textarea
                      rows={6}
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 font-mono text-sm"
                      value={card.bullets.join("\n")}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          marketingCards: {
                            ...config.marketingCards,
                            [pk]: {
                              ...card,
                              bullets: e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            },
                          },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Feature comparison table</h3>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={config.useCustomFeatureComparison}
            onChange={(e) => {
              const on = e.target.checked;
              setConfig({ ...config, useCustomFeatureComparison: on });
              if (on) {
                setFeatureJson(
                  JSON.stringify(
                    config.customFeatureComparison.length
                      ? config.customFeatureComparison
                      : getDefaultFeatureComparison(),
                    null,
                    2,
                  ),
                );
              }
            }}
          />
          Use custom rows (JSON below). When off, the app uses built-in PLAN_FEATURES from code.
        </label>
        {config.useCustomFeatureComparison ? (
          <textarea
            rows={16}
            className="mt-3 w-full rounded-md border border-gray-300 p-3 font-mono text-xs"
            value={featureJson}
            onChange={(e) => setFeatureJson(e.target.value)}
          />
        ) : null}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save all"}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
