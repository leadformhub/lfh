type GrecaptchaClient = {
  ready: (cb: () => void) => void;
  execute: (key: string, opts: { action: string }) => Promise<string>;
};

function getGrecaptcha(): GrecaptchaClient | null {
  if (typeof window === "undefined") return null;
  const grecaptcha = (window as unknown as { grecaptcha?: GrecaptchaClient }).grecaptcha;
  if (!grecaptcha?.ready || !grecaptcha?.execute) return null;
  return grecaptcha;
}

export async function getRecaptchaToken(siteKey: string, action: string): Promise<string> {
  const grecaptcha = getGrecaptcha();
  if (!grecaptcha) {
    throw new Error("RECAPTCHA_NOT_READY");
  }
  const token = await new Promise<string>((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
    });
  });
  if (!token.trim()) {
    throw new Error("RECAPTCHA_EMPTY_TOKEN");
  }
  return token;
}
