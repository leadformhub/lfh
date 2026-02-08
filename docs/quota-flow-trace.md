# Quota Logic Flow Trace

## Core function: `canCreateForm` (lib/plans.ts)
```
canCreateForm(plan, currentCount) → currentCount < maxForms
```
- `maxForms` from `getPlanLimits(plan)`: free=3, pro=∞, business=∞
- For free: canCreate=false when count ≥ 3

---

## Data sources

| Source | formsCount | plan | Used by |
|--------|------------|------|---------|
| **Forms page** | `prisma.form.count({ userId })` | `user.plan` from DB | canCreate |
| **Dashboard** | `prisma.form.count({ userId })` | `user.plan` from DB | canCreate |
| **Layout (sidebar)** | `prisma.form.count({ userId })` | `session.plan` | display only |
| **API create** | `prisma.form.count({ userId })` | `user.plan` from DB | block/create |
| **forms.service** | `prisma.form.count({ userId })` | `user.plan` from DB | block/create |

---

## Mismatch risk

**Layout uses `session.plan`**, others use **`user.plan` from DB**.

- Session plan: set at login, comes from JWT (user.plan at login time)
- After payment/upgrade: `user.plan` in DB updates, but **session may stay stale** until re-login
- If session.plan ≠ user.plan:
  - Sidebar could show different limit than what canCreate uses
  - Unlikely to cause canCreate=true when at quota (Forms/Dashboard use DB plan)

**Forms/Dashboard both use `user.plan` from DB** for canCreate → correct source.

---

## Flow summary

1. **formsCount**: Always `prisma.form.count({ where: { userId: session.userId } })` ✓
2. **plan**: Forms page + Dashboard fetch `user` from DB, use `user?.plan ?? "free"` ✓
3. **canCreate**: `canCreateForm(plan, formsCount)` → `formsCount < maxForms` ✓

---

## If canCreate is true when it should be false

Possible causes:
1. **user.plan is not "free"** in DB (e.g. "pro") → maxForms=∞ → always canCreate
2. **formsCount is wrong** (wrong userId, or count query bug)
3. **Page cache** → stale canCreate from previous render

**Verify in DB:**
```sql
SELECT id, plan FROM users WHERE id = 'your-user-id';
SELECT COUNT(*) FROM forms WHERE user_id = 'your-user-id';
```
