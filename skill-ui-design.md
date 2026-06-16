---
name: rxflow-ui-design
description: Use when building, reviewing, or modifying any RxFlow UI: components, CSS, token changes, feature screens, accessibility states, or the design-system catalog. Also use when investigating visual drift between catalog and app, adding tokens, touching globals.css, or changing dense pharmacy-order workflows.
---

# RxFlow UI Design System

RxFlow is a dense pharmacy-order workbench. Design for speed, legibility, and error prevention before decoration. The interface should feel controlled, square, clinical, and operational: high information density, clear state, few accents, no ornamental chrome.

## Hard Gates

Violating any of these is a bug. Fix before finishing.

- Square surfaces only. Do not add visible radius to buttons, cards, modals, rows, chips, tabs, inputs, badges, dropdowns, scrollbars, or toasts. The logo dot is the only circular exception. Prefer no `border-radius`; use `var(--s-radius-none)` only when neutralizing inherited/browser radius.
- Two fonts only. Use Plus Jakarta Sans (`var(--s-font-sans)`) for UI text and Source Code Pro (`var(--s-font-numeric)`) for order numbers, prices, counts, timestamps, and scan codes.
- Token pipeline is mandatory: `foundation.ts` -> `semantic.ts` -> `component.ts` -> generated CSS. `npm run tokens:css` must generate `foundation.css`, `semantic.css`, and `component.css`. Never skip a layer.
- CSS rules consume only `--s-*` or `--c-*` custom properties. Never consume `--f-*` in component CSS.
- No raw colors, shadows, font stacks, spacing, sizing, motion, opacity, or z-index in component rules. Allowed raw exceptions: `1px` borders, `2px` active indicators when matching existing selectors, viewport units, percentages, and SVG `data:` URI internals.
- Spacing in `gap`, `padding`, and `margin` must use `var(--s-space-*)` or an existing component token. Do not write `gap: 8px`, `padding: 32px`, or `margin-bottom: 12px`.
- Catalog mirrors the app. Token or component changes must land in both the app and `../dashboard-design-system.html` in the same change unless the user explicitly asks for only one surface.
- Preserve React behavior. Never replace an app component with copied catalog HTML; preserve props, handlers, ARIA, conditional rendering, state classes, and data flow.

## Industry Calibration

Use these case-study lessons as operating principles, not visual imports.

- Google Material: treat a design system as reusable design decisions expressed through guidance, components, patterns, and primitives. RxFlow implication: start from semantic intent and existing primitives before adding CSS.
  Source: https://developer.android.com/design/ui/mobile/guides/components/material-overview
- Apple HIG: hierarchy, consistency, adaptability, and accessibility are platform-level constraints, not polish. RxFlow implication: status, action priority, focus, target size, and contrast must survive every dense layout.
  Source: https://developer.apple.com/design/human-interface-guidelines/
- Amazon Cloudscape: enterprise systems earn trust through accessible, responsive, tested React components, strong foundation docs, demos, and density guidance. RxFlow implication: dense views are acceptable only when readability, focus, and state clarity remain intact.
  Sources: https://cloudscape.design/ and https://cloudscape.design/foundation/visual-foundation/content-density/
- Meta/Facebook engineering: large component ecosystems need feature flags, parity tracking, dogfooding, tests, metrics, and incremental rollout. RxFlow implication: UI changes need scoped diffs, build verification, browser checks for layout-sensitive work, and no broad CSS rewrites.
  Source: https://engineering.fb.com/2017/09/26/web/react-16-a-look-inside-an-api-compatible-rewrite-of-our-frontend-ui-library/
- Netflix Hawkins: solve the system problem, not the ticket wording. Prefer semantic component properties over appearance switches, validate against real platform/localization constraints, and deprecate deliberately.
  Source: https://www.jaguarstudio.co/portfolio/hawkins-netflix
- WCAG 2.2: normal text needs 4.5:1 contrast, large text needs 3:1, and pointer targets should meet at least the 24x24 CSS px AA floor or satisfy spacing exceptions. RxFlow controls usually exceed that through 34/42/54px tokens; do not shrink them casually.
  Sources: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## First Pass Workflow

Before changing UI:

1. Read the component and its selectors in `src/app/globals.css`.
2. Read tokens in this order:
   - `src/lib/tokens/foundation.ts`
   - `src/lib/tokens/semantic.ts`
   - `src/lib/tokens/component.ts`
   - generated CSS in `src/app/tokens/foundation.css`, `semantic.css`, `component.css`
3. Decide whether the change is a component variant, semantic state, layout adjustment, or product-flow problem. Do not add appearance-only variants when a semantic state or existing component pattern covers the need.
4. Use existing tokens first: `--c-*` if available, then `--s-*`.
5. If no token exists, add it through the full pipeline before writing the CSS rule.
6. Patch the app selector first, then mirror the exact component state in `../dashboard-design-system.html`.
7. Review `git diff` for broad selector damage, raw values, lost ARIA/handlers, and catalog drift.
8. Run `npm run build`. For layout-sensitive work, also run the dev server and verify visually.

For catalog-to-app sync details, read `catalog-sync.md`.

## Token Architecture

```
src/lib/tokens/foundation.ts   -> raw values + foundationCssVars
             ↓
src/lib/tokens/semantic.ts     -> semantic object + semanticCssVars, refs --f-*
             ↓
src/lib/tokens/component.ts    -> componentCssVars, refs --s-*
             ↓
src/lib/generateTokenCss.ts    -> CSS string generation
scripts/render-token-css.cjs   -> writes src/app/tokens/*.css
src/app/tokens/foundation.css  -> generated --f-* :root block
src/app/tokens/semantic.css    -> generated --s-* :root block
src/app/tokens/component.css   -> generated --c-* :root block
src/app/layout.tsx             -> imports token CSS in order, then globals.css
src/app/globals.css            -> component rules, --s-* and --c-* only
../dashboard-design-system.html -> standalone catalog reference
```

Layer rules:

| Layer | File | Role |
|---|---|---|
| Foundation | `src/lib/tokens/foundation.ts` | Raw primitives: colors, fonts, spacing, sizing, shadows, motion, z-index |
| Semantic | `src/lib/tokens/semantic.ts` | Meaning aliases: surface, text, action, status, spacing, typography, sizing |
| Component | `src/lib/tokens/component.ts` | Scoped dimensions and layout values for controls, rows, panels, modals, z-index |
| Generated | `src/app/tokens/*.css` | Generated `:root` vars. Do not edit by hand |
| CSS | `src/app/globals.css` | Actual component selectors. Use `var(--s-*)` or `var(--c-*)` only |
| Catalog | `../dashboard-design-system.html` | App mirror and visual reference; keep component specimens aligned |

Adding a token:

1. Add raw value to `foundation.ts`.
2. Add the matching `--f-*` entry to `foundationCssVars`.
3. Add the matching `--s-*` semantic alias in `semanticCssVars`.
4. Add a `--c-*` alias in `componentCssVars` only when the value is component-scoped.
5. Run `npm run tokens:css`.
6. Use `var(--c-*)` or `var(--s-*)` in the CSS rule.
7. Mirror app and catalog.

## Active Token API

### Typography

Only these size tokens exist:

| Token | Value | Use |
|---|---:|---|
| `--s-size-sm` | 12px | Micro labels, compact metadata |
| `--s-size-md` | 14px | Default body, badges, controls |
| `--s-size-xl` | 16px | Titles, secondary emphasis |
| `--s-size-2xl` | 18px | Totals, compact headings |
| `--s-size-3xl` | 28px | Buyer names, order-row primary identity |

Only these leading tokens exist: `--s-leading-none` (1.0), `--s-leading-normal` (1.2), `--s-leading-body` (1.5).

All tracking uses `var(--s-tracking-normal)` (= `0rem`) in app CSS. The catalog may contain legacy `--cat-*` variables in catalog-shell examples; do not introduce them into app selectors or new component specimens.

Only these weight tokens exist:

| Token | Value | Use |
|---|---:|---|
| `--s-weight-thin` | 100 | Light secondary identity text only |
| `--s-weight-regular` | 400 | Body text |
| `--s-weight-medium` | 500 | Micro labels, secondary controls |
| `--s-weight-semibold` | 600 | Controls, tabs, badges, buyer names |
| `--s-weight-strong` | 620 | Primary display and title emphasis |
| `--s-weight-upper` | 650 | Compact uppercase identity emphasis |
| `--s-weight-bold` | 700 | Totals, headings, strong badges |
| `--s-weight-extrabold` | 800 | Modal and popup titles |

Type roles from `semantic.type.*`:

| Role | Size | Weight | Leading | Tracking | Family | Use |
|---|---:|---|---|---|---|---|
| Display | `--s-size-3xl` | `--s-weight-strong` | `--s-leading-none` | `--s-tracking-normal` | `--s-font-sans` | Order IDs, major labels |
| Buyer name | `--s-size-3xl` | `--s-weight-semibold` | `--s-leading-none` | `--s-tracking-normal` | `--s-font-sans` | Detail buyer identity |
| Heading | `--s-size-2xl` | `--s-weight-bold` | `--s-leading-normal` | contextual | `--s-font-sans` | Section headings |
| Title large | `--s-size-2xl` | `--s-weight-bold` | contextual | contextual | `--s-font-sans` | Large compact headers |
| Title | `--s-size-xl` | `--s-weight-strong` | `--s-leading-normal` | `--s-tracking-normal` | `--s-font-sans` | Card/detail headers |
| Body | `--s-size-md` | `--s-weight-regular` | `--s-leading-body` | contextual | `--s-font-sans` | Descriptions, notes |
| Label | `--s-size-md` | `--s-weight-semibold` | contextual | `--s-tracking-normal` | `--s-font-sans` | Controls, filters, tabs |
| Label small | `--s-size-md` | `--s-weight-semibold` | contextual | `--s-tracking-normal` | `--s-font-sans` | Compact labels with normal text size |
| Meta | `--s-size-md` | contextual | `--s-leading-normal` | contextual | `--s-font-sans` | Supporting metadata |
| Micro | `--s-size-sm` | `--s-weight-medium` | contextual | contextual | `--s-font-sans` | Small labels |
| Mono | `--s-size-md` | contextual | contextual | `--s-tracking-normal` | `--s-font-numeric` | Prices, order numbers, counts, timestamps, scan codes |
| Mono large | `--s-size-2xl` | `--s-weight-bold` | contextual | `--s-tracking-normal` | `--s-font-numeric` | Totals |

Uppercase labels:

```css
text-transform: uppercase;
letter-spacing: var(--s-tracking-normal);
```

### Color

| Role | Token |
|---|---|
| Page | `--s-page` |
| Surface | `--s-surface`, `--s-surface-raised`, `--s-surface-disabled` |
| Text | `--s-text-primary`, `--s-text-secondary`, `--s-text-muted`, `--s-text-tertiary`, `--s-text-disabled`, `--s-text-inverse`, `--s-text-display` |
| Border | `--s-border-default`, `--s-border-subtle`, `--s-border-strong` |
| Action | `--s-action-primary`, `--s-action-hover`, `--s-action-pressed`, `--s-action-subtle` |
| Status | `--s-success*`, `--s-warning*`, `--s-error*`, `--s-info*` |
| Pharmacy states | `--s-status-review-bg/text`, `--s-status-packing-bg/text`, `--s-rx-badge-bg/text` |
| Overlays/chrome | `--s-overlay`, `--s-scroll-shadow`, `--s-scrollbar-thumb`, `--s-hatch-bg`, `--s-hatch-stripe` |
| Prescription | `--s-prescription-grid`, `--s-prescription-bg`, `--s-prescription-line` |

Color rules:

- Use color to reinforce action or status, never as the only cue. Pair status color with text and, when useful, an icon.
- Primary blue is for primary actions, active states, links, and scan/progress affordances. Do not use it as decoration.
- Status colors are for pharmacy/order state and error recovery. Do not reuse red/green/yellow for unrelated visual flavor.
- New colors require contrast checks in the actual foreground/background pairing before merging.

### Spacing, Motion, Shape

Spacing scale:

| Token | Value |
|---|---:|
| `--s-space-0` | 0px |
| `--s-space-1` | 4px |
| `--s-space-2` | 8px |
| `--s-space-3` | 12px |
| `--s-space-4` | 16px |
| `--s-space-5` | 20px |
| `--s-space-6` | 24px |
| `--s-space-8` | 32px |
| `--s-space-10` | 40px |

Do not mix `--s-space-4` and `--s-space-8` at the same hierarchy level unless the layout intentionally separates two different groups.

Motion tokens:

| Token | Use |
|---|---|
| `--s-motion-fast` | Hover, active, toggle, micro-state |
| `--s-motion-normal` | Search expand, panel transitions |
| `--s-motion-ease-out` | Entry, popup, toast reveal |
| `--s-motion-ease-inout` | Crossfades, bidirectional transitions |
| `--s-motion-ease-in` | Closing/collapse |
| `--s-motion-linear` | Progress fill only |

Motion must clarify state, not decorate. Avoid slow transitions in pharmacy workflow surfaces.

### Sizing Systems

| System | Tokens | Rule |
|---|---|---|
| Controls | `--c-control-height` 54px, `--c-control-height-compact` 42px, `--c-control-height-sm` 34px, `--c-control-height-xs` 32px | Buttons, inputs, selects. Fixed height |
| Squares | `--c-square-filter-control-size` 54px, `--c-square-control-size` 42px, `--c-square-item-icon-size` 30px, `--c-square-barcode-item-icon-size` 24px, `--c-square-status-icon-size` 20px | Width equals height |
| Badges | `--c-label-height` 24px, `--c-badge-padding-x`, `--c-badge-gap` | Static metadata. Non-interactive |
| Pills/chips | `--c-pill-interactive-height` 36px plus chip width tokens | Interactive filters and dropdown choices |
| Inputs | `--c-input-padding-x`; height comes from control tokens | Keep scan/search fields compact |
| Icons | `--c-icon-xs/sm/inline/md/lg` | Glyph size only, not hit target |
| Cards | `--s-sizing-card-padding-*`, `--s-sizing-card-gap-*` | Padding/gap only. No fixed card heights |
| Layout | `--c-panel-*`, `--c-modal-*`, `--c-row-*`, `--c-search-*` | Widths, rows, modals, drawers |

Sizing invariant: badge < pill < compact control < primary control. Never use a control-height token for a badge.

No tag-height tokens currently exist. If a tag component is required, add it through the full token pipeline before documenting or using it.

## Layout Rules

- Use `grid` for two-dimensional layout: list/detail shells, meta matrices, repeated component structures.
- Use `flex` for one-dimensional alignment: icon+label, stack, row actions, topbar.
- Use `gap` between children, `padding` inside components, and `margin` only when external spacing cannot be owned by a parent layout.
- Dense does not mean cramped. Preserve scannable groups, stable columns, and enough white space to avoid medication/order mixups.
- Avoid page-level marketing composition. This is an operational app, not a landing page.
- Do not add cards inside cards. Panels, rows, and modals can be framed; page sections should be layout, not decoration.
- Text must not overlap or push critical controls off-screen. Long buyer names, medication names, phones, addresses, and localized strings need truncation, wrapping, or stable min-width rules.

## Pharmacy Safety UX

- Keep order identity visible: buyer, phone, order ID, status, total, item count, and timestamp should remain easy to scan in primary workflows.
- Destructive or irreversible actions need explicit labels, clear disabled states, and confirmation where the existing flow requires it.
- Error states need both message and recovery path. Do not show a red surface without actionable copy.
- Barcode scanning states must be unmistakable: scanning, matched, mismatch, completed, and close/exit must have distinct visual and text states.
- Do not hide critical pharmacy context behind hover-only UI. Hover may enhance, but essential information must remain available by keyboard and touch.

## Component Patterns

Buttons:

| Type | Token | Traits |
|---|---|---|
| Main CTA | `--c-control-height` | Full width where workflow-primary, blue, uppercase, strong focus/disabled states |
| Sub action | `--c-control-height-compact` | Border or ghost surface, quieter than CTA |
| Small control | `--c-control-height-sm/xs` | Secondary dense controls only |
| Icon button | `--c-square-control-size` | Square hit area, clear accessible label |

Main CTA hover uses `--s-action-hover`, a restrained `translateY(-1px)`, and existing elevation only where the pattern already uses it. Active resets transform. Warning CTA uses `--s-warning-action` and `--s-warning-action-hover`.

Active row:

```css
.order-row.active {
  background: var(--s-surface);
  box-shadow: inset calc(var(--c-row-active-indicator-width) * -1) 0 0 var(--s-action-primary);
}
```

Active tab or chip:

```css
border-bottom: var(--c-active-indicator-size) solid var(--s-action-hover);
box-shadow: inset 0 calc(var(--c-active-indicator-size) * -1) 0 var(--s-action-hover);
```

Scroll shadow:

```css
background: radial-gradient(ellipse 60% 100% at 50% 0%, var(--s-scroll-shadow) 0%, transparent 100%);
```

Modal/popup:

- Overlay: `var(--s-overlay)`.
- Border: `1px solid var(--s-border-default)`.
- Square edges.
- Elevation: `var(--s-shadow-layer)` only where the existing pattern uses floating layers.
- Incoming drawer width: `--c-drawer-incoming-width`.

Icons:

- Use `<Icon name="..." />` from `src/components/ui/Icon.tsx`.
- ViewBox is `0 0 32 32`; renders at `1em x 1em`; override via `size` prop.
- Available names include `search check close time document medication pills bottleA bottleB box send image user chat notification phone lifebuoy hourglass error dot printer`.
- Add icons by extending the typed `ICONS` map. Do not inject raw SVG strings into components.

## Accessibility And Interaction

- Every interactive element needs hover, active, disabled, and `:focus-visible` states unless the element is intentionally static.
- Icon-only controls need accessible names.
- Keyboard users must be able to reach dialogs, dropdowns, tabs, scan controls, and close buttons without traps.
- Focus indicators use `--c-focus-size`, `--c-focus-gap`, and `--s-focus-ring`.
- Do not rely on color alone for state; pair with text, iconography, or position.
- Preserve semantic HTML and ARIA already in React components.
- Respect reduced-motion expectations for any new nonessential animation.
- Badge-sized metadata is not a click target. If it becomes interactive, promote it to a pill/chip/control token.

## Scrollbars And Z-Index

Scrollbar pattern:

```css
scrollbar-width: thin;
scrollbar-color: var(--s-scrollbar-thumb) transparent;
*::-webkit-scrollbar { width: var(--c-scrollbar-w); height: var(--c-scrollbar-w); }
*::-webkit-scrollbar-thumb { background: var(--s-scrollbar-thumb); border-radius: 0; }
```

Use component z-index tokens:

| Token | Value | Layer |
|---|---:|---|
| `--c-z-row-active` | 30 | Active row |
| `--c-z-dropdown` | 40 | Dropdown |
| `--c-z-filters` | 60 | Filter bar |
| `--c-z-toast` | 500 | Toast |
| `--c-z-incoming-popup` | 700 | Incoming popup |
| `--c-z-reject-popup` | 708 | Reject modal |
| `--c-z-prescription-popup` | 709 | Prescription modal |
| `--c-z-barcode-popup` | 710 | Barcode modal |

New stacking layers must start in `foundation.zIndex`, flow through generated tokens, and use the nearest existing layer unless a separate layer is necessary.

## Audit Commands

Use these before finishing UI work:

```bash
npm run tokens:css
test -f src/app/tokens/foundation.css
test -f src/app/tokens/semantic.css
test -f src/app/tokens/component.css
rg -n "generateFoundationCss|foundationCssVars" src/lib scripts
rg -n "var\(--f-" src/app/globals.css ../dashboard-design-system.html
rg -n "#[0-9A-Fa-f]{3,8}|rgba?\(" src/app/globals.css ../dashboard-design-system.html
rg -n "gap: [0-9]|padding: [0-9]|margin: [0-9]" src/app/globals.css ../dashboard-design-system.html
rg -n "border-radius" src/app/globals.css ../dashboard-design-system.html
rg -n "--cat-" src/app/globals.css
```

Expected pipeline audit results: `npm run tokens:css` prints `foundation.css`, `semantic.css`, and `component.css`; all three files exist; `generateFoundationCss` and `foundationCssVars` are present; app/catalog CSS has no direct `var(--f-*)` consumption. When a command finds an intentional exception, verify it is one of the documented exceptions. Otherwise patch the selector.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Adding radius because the UI feels harsh | Improve spacing, hierarchy, or border contrast; keep square |
| Raw `#333`, `rgba(...)`, or shadow in `globals.css` | Add/use semantic or component token |
| `var(--f-*)` in app CSS | Route through `--s-*` or `--c-*` |
| New status color without text/icon | Add text and semantic state; color cannot be the only cue |
| `font-family: monospace` for numbers | Use `var(--s-font-numeric)` |
| Documenting a token before it exists | Add it through the pipeline or remove the doc claim |
| Using control height for badge | Use badge tokens; promote to pill/control only if interactive |
| Broad catalog search/replace | Patch one selector block and inspect diff |
| Catalog-only style promoted to app | Rebuild with real tokens and component structure |
| React component rewritten as static markup | Preserve behavior, state, ARIA, and data flow |
| Compact layout that hides risk | Prioritize order safety, legibility, focus, and recovery |

## Verification Checklist

Before finishing:

- [ ] CSS uses `var(--)` for colors, shadows, spacing, sizing, motion, opacity, z-index, fonts, and focus states.
- [ ] No `var(--f-*)` in CSS rules.
- [ ] No raw spacing in `gap`, `padding`, or `margin`.
- [ ] No new visible `border-radius` except the logo dot.
- [ ] Typography uses existing size, weight, leading, tracking, and font tokens.
- [ ] Numeric/order data uses Source Code Pro.
- [ ] Token additions completed through TS maps, generated CSS, consuming CSS, and catalog.
- [ ] `npm run tokens:css` generated `foundation.css`, `semantic.css`, and `component.css`.
- [ ] App and catalog specimens match for the changed component/state.
- [ ] Interactive states include hover, active, disabled, and focus-visible.
- [ ] Status and error states do not rely on color alone.
- [ ] Long pharmacy content has a stable overflow strategy.
- [ ] `git diff` reviewed for accidental broad CSS changes.
- [ ] `npm run build` passes.
- [ ] Layout-sensitive work was visually verified in a browser.
