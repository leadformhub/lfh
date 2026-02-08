export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const env = process.env.NODE_ENV ?? "development";
    console.log(`[LeadFormHub] Server starting (NODE_ENV=${env})`);
  }
}
