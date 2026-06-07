/**
 * Notify search engines of the sitemap after SEO updates.
 * Google Search Console: submit manually (no API credentials in repo).
 * Bing: ping endpoint (best-effort).
 */
const SITEMAP_URL = "https://leadformhub.com/sitemap.xml";
const GSC_SITEMAP_SUBMIT =
  "https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aleadformhub.com";

async function pingBing(): Promise<void> {
  const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
  const res = await fetch(pingUrl);
  console.log(`Bing ping: ${res.status} ${res.statusText}`);
}

async function verifySitemap(): Promise<void> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urlCount = (xml.match(/<loc>/g) ?? []).length;
  console.log(`Sitemap OK (${urlCount} URLs): ${SITEMAP_URL}`);
}

async function main(): Promise<void> {
  await verifySitemap();
  await pingBing();
  console.log("\nGoogle Search Console — submit sitemap manually:");
  console.log(GSC_SITEMAP_SUBMIT);
  console.log(`Enter: ${SITEMAP_URL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
