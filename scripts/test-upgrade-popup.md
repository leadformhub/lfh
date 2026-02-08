# Test: Upgrade Popup When Form Quota Reached

## Prerequisites
- Dev server running (`npm run dev`)
- User account on free plan with **3 or more forms** (quota = 3)

## Manual Test Steps

1. **Log in** to the app at http://localhost:3000

2. **Ensure you're at form quota**
   - Check sidebar: "Forms 3 / 3" or "Forms 4 / 3"
   - If under quota, create forms until you reach 3

3. **Open Forms page**
   - Click "Forms" in sidebar or go to `/{username}/forms`

4. **Click "+ Create Form"**
   - Expected: Upgrade popup (native dialog) opens with "Form limit reached"
   - Should show "Upgrade to Pro or Business to create more forms"
   - Should have upgrade options and close button

5. **Check button debug attributes** (if popup doesn't open)
   - Right-click "+ Create Form" → Inspect
   - Look at: `data-debug-can-create`, `data-debug-forms-count`, `data-debug-forms-limit`
   - If `data-debug-can-create="true"` → server thinks you're under limit (bug in quota check)

## Also test from Dashboard
- Go to Dashboard
- Click the "+ Create Form" button in the top section
- Same expected behavior
