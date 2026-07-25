# Professional Redesign Plan

Goal: shed the "AI-generated" look (purple-blue glow, glassmorphism cards, generic dark theme) and move toward a credible cybersecurity product aesthetic — closer to tools like Cloudflare, Vercel Security, 1Password, or Linear.

## What changes

### 1. Visual identity
- **Palette**: Replace the saturated blue-on-navy with a restrained near-black background (`oklch(0.18 0.005 250)`), warm off-white text, and a single confident accent (deep electric green `oklch(0.78 0.18 155)` for SAFE-forward branding, since this is a defense tool). Status colors stay distinct (green/amber/red) but desaturated to feel editorial, not neon.
- **Remove**: glow shadows, gradient hero backgrounds, glassmorphism blur, oversized rounded corners (drop from `rounded-2xl` to `rounded-lg`).
- **Add**: thin 1px borders, subtle grid/dotted background texture, flat cards with hairline separators.

### 2. Typography
- **Headings**: `Geist` or `Inter Tight` — tight tracking, medium weight (not bold gradient text).
- **Body**: `Inter` at comfortable sizes.
- **Mono**: `JetBrains Mono` for URLs, scores, and code-like data.
- Establish a real type scale (12 / 14 / 16 / 20 / 28 / 40) and stick to it.

### 3. Landing page (`/`)
- Replace the hero gradient + giant glowing badge with a focused left-aligned headline, a one-line subhead, and a clean CTA pair.
- Add a real product screenshot panel (mock scanner result) instead of decorative icons.
- Trust strip (logos placeholder), then a tight 3-feature row with icons in monochrome, then a "How it works" 3-step section, then footer.

### 4. App shell
- Replace the floating navbar with a flat top bar (logo left, nav center, user menu right) and a thin border-bottom.
- Tighter content max-width (1200px), more generous vertical rhythm.

### 5. Scanner page
- Two-column layout stays, but: flat tabs (underline style, not pill), upload area as a plain dashed rectangle with helper text, ResultCard redesigned as a structured report (header row with status chip + score, then a definition-list of detected signals, then action row).

### 6. Dashboard
- Replace decorative KPI cards with a compact stat row (label + number + delta), Recharts restyled with muted colors, single accent line, no gradients, clear axis labels.

### 7. History
- Convert to a proper data table: sticky header, zebra-free, row hover, status as a small chip, monospace URLs, right-aligned actions.

## Technical notes

- All changes in `src/styles.css` (tokens), `src/components/layout/*`, `src/components/qr/*`, `src/routes/index.tsx`, and the three `_authenticated/app/*` route files.
- No backend, schema, or server-function changes.
- Add fonts via `<link>` in `src/routes/__root.tsx` head; register families in `@theme` per Tailwind v4 rules.
- Keep all existing functionality (auth, scanning, threat analysis, history, dashboard) intact.

## Out of scope

- Logo redesign (keep current mark; can revisit).
- New illustrations or 3D assets.
- Light mode (stays dark-only, but a refined dark — not "AI dark").