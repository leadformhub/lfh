# LeadFormHub — Global design system

Single source of truth: **`src/app/globals.css`**. Use these tokens everywhere; no arbitrary colors or font sizes.

---

## 1. Color palette

### Primary & secondary
| Token | Value | Use |
|-------|--------|-----|
| `--color-accent` | #2563eb | Primary CTAs, key links, focus ring |
| `--color-accent-hover` | #1d4ed8 | CTA hover |
| `--color-accent-active` | #1e40af | CTA active |
| `--color-accent-subtle` | #eff6ff | Subtle accent backgrounds |
| `--color-secondary` | #475569 | Supporting text, labels |
| `--color-primary` | #0f172a | Dark surfaces (footer, nav), not button primary |

### Neutral grays
| Token | Use |
|-------|-----|
| `--neutral-50` … `--neutral-950` | Borders, disabled states, UI chrome (50 = lightest, 950 = darkest) |
| `--border-default` | Default border (#e5e7eb) |
| `--border-strong` | Emphasized border (#cbd5e1) |
| `--foreground` | Body text |
| `--foreground-muted` | Secondary text |
| `--foreground-subtle` | Placeholders, hints |
| `--foreground-heading` | Heading text |

### Backgrounds
| Token | Use |
|-------|-----|
| `--background` | Page background |
| `--background-alt` | Section alt background |
| `--background-elevated` | Cards, modals, inputs |

### Semantic (status)
| Token | Use |
|-------|-----|
| `--color-success` | Success states |
| `--color-success-hover` | Success button hover |
| `--color-warning` | Warnings |
| `--color-warning-hover` | Warning button hover |
| `--color-danger` | Errors, destructive actions |
| `--color-danger-hover` | Danger button hover |

---

## 2. Typography scale

### Fonts
- **Headings:** Plus Jakarta Sans — use class `font-heading`.
- **Body:** Geist Sans — default on `body`.

### Semantic headings (H1–H6)
Use classes `.h1`–`.h6` or elements `h1`–`h6` (styled in globals.css):

| Class | Size token | Use |
|-------|------------|-----|
| `.h1` / `h1` | --text-3xl | Page title |
| `.h2` / `h2` | --text-2xl | Section title |
| `.h3` / `h3` | --text-xl | Subsection |
| `.h4` / `h4` | --text-lg | Card title |
| `.h5` / `h5` | --text-base | Small heading |
| `.h6` / `h6` | --text-sm | Label-style heading |

### Body & small text
| Class | Use |
|-------|-----|
| `.text-body-lg` | Lead paragraph |
| `.text-body` | Default body |
| `.text-body-sm` | Secondary body |
| `.text-caption` | Captions, labels (small muted) |
| `.text-display` | Hero/display size |
| `.text-heading-1` … `.text-heading-3` | Alternate heading utilities |

### Scale (rem)
`--text-xs` (0.75rem) through `--text-7xl` (4.5rem). Line height: `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed`.

---

## 3. Button styles

Use the `<Button>` component with these variants (all use design tokens):

| Variant | Use |
|---------|-----|
| `primary` | Main CTAs (accent background, shadow) |
| `secondary` | Secondary actions (border, hover fill) |
| `danger` | Destructive actions |
| `ghost` | Tertiary (text + hover bg) |
| `accent` | Same as primary |

Sizes: `sm`, `md`, `lg`, `xl`. Shared base: `.btn-base` in globals (transition, radius, focus ring).

---

## 4. Form input styles

Use the `.form-input-base` class (or `<Input>` / `<Select>` components) for consistent:

- **Default:** `--border-default`, `--background-elevated`, `--radius-md`
- **Focus:** Border and ring `--color-accent`, ring offset `--background`
- **Error:** Add `.form-input-error` or `aria-invalid="true"` — border/ring `--color-danger`
- **Disabled:** `--neutral-100` background, reduced opacity, not-allowed cursor

Label: `text-[var(--foreground-heading)]`. Hint/error text: `--foreground-muted` / `--color-danger`.

---

## 5. Spacing, radius, shadows

- **Spacing:** `--space-1` (4px) through `--space-16` (64px). Prefer Tailwind spacing scale (1 = 4px, 2 = 8px, …).
- **Radius:** `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl`, `--radius-2xl`, `--radius-full`.
- **Shadows:** `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-cta` (accent glow).
- **Transitions:** `--transition-fast`, `--transition-base`, `--transition-slow`.

---

## 6. Usage in code

- **Colors:** `bg-[var(--color-accent)]`, `text-[var(--foreground-muted)]`, etc.
- **Typography:** Use `h1`–`h6` or `.text-heading-*` / `.text-body-*` / `.text-caption`.
- **Buttons:** Use `<Button variant="primary">` etc.; avoid inline hex.
- **Forms:** Use `<Input>`, `<Select>`, or class `form-input-base` + `form-input-error` when needed.
- **Spacing/radius/shadows:** Prefer `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`.
