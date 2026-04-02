"use client";

import { useEffect } from "react";

export function DashboardRecaptchaVisibility() {
  useEffect(() => {
    document.body.classList.add("hide-recaptcha-badge");
    return () => {
      document.body.classList.remove("hide-recaptcha-badge");
    };
  }, []);

  return null;
}
