# RxFlow Catalog-to-App Sync Pipeline

Use this when promoting a catalog visual tweak into the Next.js app, or when keeping
`dashboard-design-system.html` in sync after an app change.

**Source paths:**
- Catalog: `/Users/bao/Documents/pharmacy-sideexperience/dashboard-design-system.html`
- App CSS: `rxflow-orders/src/app/globals.css`
- App components: `rxflow-orders/src/components/**`

**Default source of truth:**
- Next.js app is canonical for behavior, structure, React state, timers, event handlers.
- Catalog is canonical only for an explicitly approved visual tweak made there.

---

## Step 1 — Name the Exact Scope

State the class or component being synced (e.g. `.incoming-popup-summary`). Never bulk-copy the full catalog stylesheet.

```bash
rg -n "\.incoming-popup-summary|incoming-popup-summary" \
  dashboard-design-system.html \
  rxflow-orders/src/app/globals.css \
  rxflow-orders/src/components
```

## Step 2 — Audit the Full Selector Family

Catalog drift always comes from partial syncs that copy one line but miss adjacent rules. Before patching, grep both files for every rule in the selector family:

```bash
rg -n "\.row-item-chip" rxflow-orders/src/app/globals.css dashboard-design-system.html
```

Compare side-by-side. Every rule in the app must exist in the catalog with identical declarations. Missing catalog rules are bugs — add them in the same change.

Root causes of past mismatches:
- Syncing only the touched line, not the full selector family
- Skipping the side-by-side grep after patching
- Skipping the diff check below

## Step 3 — Patch Selector Blocks Only

Use Edit / `apply_patch` for manual edits. Target the smallest complete CSS rule or JSX block.

**Safe:**
```css
.incoming-popup-actions {
  margin: 0;
  padding-top: 32px;
}
```

**Never** run broad replacements on common declarations (`padding: 0`, `margin: 0`, `border: none`, `text-align`, `display`, token names like `--s-*` or `--c-*`). If a mechanical replacement is unavoidable, constrain it to one selector block and verify the diff immediately.

## Step 4 — Preserve App Context

Before changing JSX, read the live component. Keep:
- `className` state modifiers: `.is-visible`, `.is-leaving`, `.active`, `.scroll-shadow`
- Runtime values from props/store: order counts, timers, totals, status labels
- `aria-*`, `role`, IDs, refs, event handlers
- Conditional branches: prescription visibility, empty states

Translate static catalog examples into the existing React structure — never replace a component with catalog HTML.

## Step 5 — Background Breakouts

When a card's background must extend beyond its padding, use `::before` so text stays on the content grid:

```css
.incoming-popup-summary {
  position: relative;
}
.incoming-popup-summary::before {
  content: "";
  position: absolute;
  top: -32px; left: -32px; right: -32px; bottom: 0;
  background: var(--s-action-primary);
  z-index: 0;
}
.incoming-popup-summary > * {
  position: relative;
  z-index: 1;
}
```

Do not use negative margins when text content must remain aligned to the card content grid.

## Step 6 — Diff After Every Patch

```bash
git diff -- rxflow-orders/src/app/globals.css rxflow-orders/src/components dashboard-design-system.html
```

Watch for global reset damage:
```bash
rg -n "padding: 0 0 32px|margin: -32px|border-radius" \
  rxflow-orders/src/app/globals.css dashboard-design-system.html
```

Only expected matches should remain. `.incoming-popup-summary { padding: 0 0 32px; }` may be valid when explicitly requested; `*, *::before, *::after { padding: 0 0 32px; }` is always broken.

## Step 7 — Verify the App

```bash
cd /Users/bao/Documents/pharmacy-sideexperience/rxflow-orders
npm run build
# For layout-sensitive changes, also:
npm run dev
```

If the sandbox cannot connect to localhost, re-run with escalation — do not assume the app failed.

## Step 8 — Mirror Back to Catalog

After the app is correct, sync the final selector shape into `dashboard-design-system.html` so the catalog remains a reference, not a fork.

**Sync order:**
1. App component JSX/TSX
2. App CSS (`src/app/globals.css`)
3. Catalog CSS and static sample markup
4. Build or browser verification
5. Final diff review

---

## Catalog Rules

- Mirror the Next.js dashboard exactly — it is not a playground or test bed.
- Use the same class names and token variables as `src/app/globals.css`.
- Typography section must show: token, size, weight, leading, tracking, family, compact format string.
- No preview-only components, shadows, radii, badge styles, colors, or states.
- When a token or component is removed from the app, remove it from the catalog.
- When the catalog introduces a token or component sample, add the same thing to the app first.

**Catalog checks before finishing:**
- No horizontal overflow in any section.
- No broken SVG `<use>` references.
- No unsupported class families (`.status-pill`, `.sp-*`, `.mb-*`) unless the app also uses them.
- No visible shadow previews unless the actual dashboard component requires them.
- Token values match app token files and `:root` variables.

**Preview the catalog locally:**
```bash
cd /Users/bao/Documents/pharmacy-sideexperience
python3 -m http.server 8000
# open http://localhost:8000/dashboard-design-system.html
```
