# Login Page — Design Specification

Premium enterprise-grade login UI inspired by Resend.com, aligned with LeadFormHub’s design system. Minimal, calm, and production-ready.

---

## 1. Layout Structure

- **Viewport**: Full height (`min-h-dvh` / `min-h-screen`), no horizontal scroll.
- **Background**: Soft neutral gradient (neutral-50 → background-alt → neutral-100) with optional subtle noise texture.
- **Header**: Absolute, full-width; logo (LeadFormHub) left, “Home” link right; z-index above background.
- **Main**: Flex column, center children vertically and horizontally; padding for small screens, larger on sm+.
- **Form container**: Single column, max-width 400px (420px on sm); card centered in main.

```
┌─────────────────────────────────────────────────────────┐
│  LeadFormHub                              Home           │  ← header
│                                                          │
│                    ┌─────────────────────┐               │
│                    │  Log in to          │               │
│                    │  LeadFormHub        │               │
│                    │  Don't have an      │               │
│                    │  account? Sign up   │               │
│                    │  ─────────────────  │               │
│                    │  [Google] [GitHub]  │               │
│                    │  ───── or ─────     │               │
│                    │  Email              │               │
│                    │  [________________]  │               │
│                    │  Password  Forgot?  │               │
│                    │  [________________]  │               │
│                    │  [    Log In    ]   │               │
│                    │  By signing in...   │               │
│                    └─────────────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. CSS Class Suggestions (Tailwind)

Uses design tokens from `globals.css` via arbitrary values where needed.

| Element | Suggested classes |
|--------|---------------------|
| Page wrapper | `min-h-dvh min-h-screen w-full overflow-x-hidden` + gradient inline style |
| Card | `rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-6 py-8 shadow-[var(--shadow-lg)] sm:px-10 sm:py-10` |
| Title | `font-heading text-2xl font-semibold tracking-tight text-[var(--foreground-heading)] sm:text-3xl` |
| Subtext / links | `text-[var(--text-sm)] text-[var(--foreground-muted)]`, link: `font-medium text-[var(--color-accent)] underline-offset-4 hover:underline` |
| Social button | `inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] px-4 py-3 text-sm font-medium ... hover:border-[var(--border-strong)] hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]` |
| Divider text | `text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]` on “or” |
| Input | `form-input-base h-11 rounded-xl px-4 py-2.5` (form-input-base from globals) |
| Primary CTA | `btn-base h-12 w-full rounded-xl bg-[var(--color-accent)] ... hover:bg-[var(--color-accent-hover)] ... disabled:opacity-50` |
| Footnote | `text-center text-xs leading-relaxed text-[var(--foreground-muted)]` |

---

## 3. Component Design Tokens

From `globals.css` (single source of truth):

| Token | Value | Use |
|-------|--------|-----|
| `--color-accent` | #2563eb | Primary CTA, links |
| `--color-accent-hover` | #1d4ed8 | Button hover |
| `--background-elevated` | #ffffff | Card background |
| `--background-alt` / `--neutral-50` | #f8fafc, #f8fafc | Page background gradient |
| `--border-subtle` / `--border-default` | #e5e7eb | Card border, input border |
| `--border-strong` | #cbd5e1 | Input/social button hover |
| `--foreground-heading` | #0f172a | Title |
| `--foreground` | #374151 | Body, labels |
| `--foreground-muted` | #6b7280 | Subtext, footnote, placeholder |
| `--shadow-xs` | 0 1px 2px rgba(0,0,0,0.04) | Social buttons |
| `--shadow-lg` | 0 12px 24px …, 0 4px 12px … | Card |
| `--radius-md` | 8px | Inputs (or use rounded-xl 12px for card feel) |
| `--transition-fast` / `--transition-base` | 150ms / 200ms ease-in-out | Focus, hover |

---

## 4. Responsive Breakpoints

- **Default (mobile)**: Single column; social buttons stack (grid gap-3); card padding `px-6 py-8`; title left-aligned on small, center optional.
- **sm (640px+)**: Card `sm:px-10 sm:py-10`; social buttons `sm:grid-cols-2`; title `sm:text-3xl`; main `sm:py-24`.
- **md (768px+)**: Header `md:px-8` if needed.
- **Max width**: Form container `max-w-[400px] sm:max-w-[420px]` to keep form readable and not too wide.

No horizontal scroll at any breakpoint; touch targets ≥ 44px (min-h-[44px] on buttons).

---

## 5. Micro-interaction Styles

- **Links**: `transition-colors duration-200`, hover underline, `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]`.
- **Social buttons**: `transition-[border-color,background-color,box-shadow] duration-200`, hover border and background change.
- **Inputs**: Handled by `.form-input-base` — focus ring 2px + 4px accent, border color change.
- **Primary button**: `transition-[background-color,box-shadow,transform] duration-200`, hover darker accent; disabled opacity 0.5.
- **No motion for reduce-motion**: Rely on color/opacity changes; avoid large transforms if adding animations later.

---

## 6. UI Mockup Sketch Description

- **Background**: Light gray gradient (top-left lighter, bottom-right slightly darker) with a very subtle noise or grain so it doesn’t feel flat.
- **Card**: White, rounded corners (16–24px), soft shadow so it floats; thin light gray border.
- **Header of card**: “Log in to LeadFormHub” in dark, semibold, large type; below it one line of muted text with “Sign up” in brand blue.
- **Social row**: Two equal-width buttons side by side (on desktop) or stacked (mobile): “Google” and “GitHub” with official icons, white background, light border, hover slightly gray.
- **Divider**: Thin horizontal line, “or” in small uppercase muted text in the middle.
- **Form**: Label “Email”, then input; label “Password” with “Forgot password?” right-aligned; then full-width “Log In” button in solid blue, white text.
- **Footer of card**: One line of small gray text: “By signing in, you agree to our Terms & Privacy Policy” with Terms and Privacy as links.

---

## 7. Color Palette Rationale

- **Light neutrals**: Reduce eye strain, work in bright and dim environments, and feel professional (similar to Linear, Vercel, Resend).
- **Single accent (#2563eb)**: One clear action color for “Log In”, “Sign up”, “Forgot password?” and focus rings — improves scannability and accessibility.
- **Muted text (#6b7280)**: Secondary copy and footnotes stay readable but visually secondary (WCAG AA on white).
- **White card**: Clear separation from background and strong contrast for form content.

---

## 8. Typography Rationale

- **Plus Jakarta Sans (headings)**: Used for “Log in to LeadFormHub” — clean, modern, not heavy.
- **Geist Sans (body)**: Labels, buttons, and body text — matches the rest of the app and remains highly readable.
- **Scale**: Title 24–30px, body 14–16px, footnote 12px so hierarchy is clear and consistent with the design system.

---

## 9. Spacing Rationale

- **Card padding**: 24px (mobile), 40px (sm+) so the form doesn’t feel cramped and aligns to an 8px grid.
- **Section spacing**: 32px (mt-8) between header block and social/form; 24px (space-y-6) between social, divider, and form; 20px (space-y-5) between form fields.
- **Touch targets**: Buttons and links use min-height 44px or padding so they meet accessibility guidelines.

---

## 10. Accessibility

- **Contrast**: Foreground on white and muted on white meet WCAG AA; accent on white for buttons and links is sufficient.
- **Focus**: All interactive elements use `focus-visible:outline` with accent color and offset so keyboard users see a clear focus ring.
- **Labels**: Email and password have visible `<label>` and `htmlFor`; primary button has `aria-busy` when loading and `aria-live="polite"` for status.
- **Errors/success**: Messages use `role="alert"` or `role="status"` and semantic color (danger/success) so they work with assistive tech.

---

## 11. Implementation Notes

- **Auth layout** (`(auth)/layout.tsx`): Provides the gradient background, texture overlay, header with logo + Home, and centered main. No change to auth behavior.
- **Login page** (`(auth)/login/page.tsx`): Same API calls (`/api/auth/login`, `/api/auth/google`), same search params (verified, error, email_changed, message), same redirect after success. Only the UI and design tokens were updated.
- **GitHub**: `/api/auth/github` is a stub that redirects to `/login?error=github_not_configured`. Replace with real OAuth when configured.
