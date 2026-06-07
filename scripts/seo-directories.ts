/**
 * Print SaaS directory submission checklist for backlink building.
 */
import { DIRECTORY_LISTINGS, PRESS_BOILERPLATE, PRESS_SHORT_TAGLINE } from "../src/lib/directory-listings";

console.log("\n=== LeadFormHub — Directory backlink checklist ===\n");
console.log("Tagline:", PRESS_SHORT_TAGLINE);
console.log("\nDescription (copy-paste):\n", PRESS_BOILERPLATE, "\n");

for (const d of DIRECTORY_LISTINGS) {
  const icon = d.status === "verified" ? "[done]" : "[ todo]";
  console.log(`${icon} ${d.name}`);
  console.log(`     ${d.profileUrl ?? d.submitUrl}`);
  if (d.notes) console.log(`     Note: ${d.notes}`);
  console.log();
}

console.log("Press kit: https://leadformhub.com/press");
console.log("After submitting, add profile URL to src/lib/directory-listings.ts sameAs.\n");
