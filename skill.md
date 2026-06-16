---
name: rxflow-orders
description: Working guide for the RxFlow Orders pharmacy dashboard — covers the three-layer token pipeline, component conventions, state machine, and how to extend the codebase without breaking the design system invariants.
---

## Project at a Glance

**RxFlow Orders** is a Next.js 14 App Router pharmacy order management dashboard. A pharmacist uses it to receive, review, pack, and dispatch orders through a linear workflow.

Tech stack: Next.js 14 · TypeScript · React 18 · useReducer (no external state lib) · CSS custom properties (no Tailwind, no CSS-in-JS).

```
rxflow-orders/
  scripts/
    render-token-css.cjs      ← Node script: writes src/app/tokens/*.css from TS token maps
  src/
    app/
      globals.css             ← Component CSS rules — var(--s-*) and var(--c-*) only
      layout.tsx              ← Imports token CSS in order, then globals.css
      page.tsx                ← Mounts <Dashboard />
      tokens/                 ← Generated — do not edit by hand
        foundation.css        ← --f-* :root block
        semantic.css          ← --s-* :root block
        component.css         ← --c-* :root block
    lib/
      tokens/
        foundation.ts         ← Raw primitives: colors, fonts, spacing, sizing, shadows, motion
        semantic.ts           ← Meaning aliases: surface, text, action, status, spacing, sizing
        component.ts          ← Scoped values: controls, rows, panels, modals, z-index
      generateTokenCss.ts     ← CSS string generation from token maps
      types.ts                ← All shared TypeScript types (Order, AppState, etc.)
      data.ts                 ← ORDERS_SEED — 9 demo orders
      utils.ts                ← Business logic, countdown math, workflow helpers
    store/
      orderStore.ts           ← useReducer store, all actions, AppState shape
    components/
      Dashboard.tsx           ← Root orchestrator: timers, toast loop, popup loop
      layout/
        Topbar.tsx
      list/
        ListPanel.tsx         ← Scrollable order list with scroll-shadow overlay
        FilterBar.tsx         ← Status filter chips + stat counts + search
        OrderRow.tsx          ← Single order row: name, status badge, rx badge, meta
      detail/
        DetailPanel.tsx       ← Right-side panel shell
        BuyerCard.tsx         ← Buyer identity, contact, delivery info
        DetailTabs.tsx        ← Fulfillment / Messages tab switcher
        FulfillmentPane.tsx   ← User note, item list, summary, completed-by badge
        MessagesPane.tsx      ← Chat thread + send form
        ActionFooter.tsx      ← Main CTA, sub-actions, countdown, progress bar
      modals/
        IncomingPopup.tsx     ← New order drawer (bottom-right)
        RejectPopup.tsx       ← Reject reason modal
        PrescriptionPopup.tsx ← Prescription image viewer
        BarcodePopup.tsx      ← Barcode scan flow per item
      ui/
        Icon.tsx              ← All SVG icons as typed React FCs; use <Icon name="..." />
        Toast.tsx             ← Toast notification (animated, timed dismiss)
```

---

## The Token Pipeline — Core Invariant

Three layers, one rule: **each layer may only reference the layer above it**.

```
tokens.ts  →  globals.css :root  →  CSS component rules
Foundation       Foundation vars       must use var(--*)
  ↓                  ↓
Semantic         Semantic vars         must use var(--f-*)
  ↓                  ↓
Component        Component vars        must use var(--f-*) or var(--s-*)
```

**Foundation** (`--f-*`): raw primitives — hex colors, rgba, fonts, spacing, shadow strings, motion values. The only place raw values are allowed.

**Semantic** (`--s-*`): UI meaning — `--s-action-primary`, `--s-error`, `--s-text-muted`. Must point to `var(--f-*)` only.

**Component** (`--c-*`): local decisions — `--c-row-bg`, `--c-tab-height`. Must point to `var(--f-*)` or `var(--s-*)` only.

**CSS rules**: every color/shadow/radius property must use `var(--*)`. Zero bare hex or rgba allowed outside `:root`.

The only known exception: SVG `data:` URI fills (`fill='%23...'`) — CSS custom properties cannot be embedded inside data URIs.

### Adding a new color

1. Add the raw value to `foundation.color.*` in `tokens.ts`
2. Add a `--f-*` CSS var in the `/* Foundation */` block in `globals.css :root`
3. If it has a semantic meaning, add a `--s-*` var pointing to `var(--f-*)`
4. If it's component-scoped, add a `--c-*` var pointing to `var(--f-*)` or `var(--s-*)`
5. Use `var(--c-*)` or `var(--s-*)` in the CSS rule — never the foundation var directly unless no semantic/component layer applies

---

## Order Workflow State Machine

Each order has `actionType` which drives the UI. The linear path:

```
verify-pay → accept → review → ready → handoff/deliver → transit/delivered-hold → complete → done
```

| actionType       | Main button          | Disabled? | Auto-advances?                      |
|------------------|----------------------|-----------|-------------------------------------|
| `verify-pay`     | Confirm Payment      | 10s lock  | No                                  |
| `accept`         | Accept & Start Pack  | No        | Opens barcode popup → `review`      |
| `review`         | Reviewing Order      | Yes       | Barcode completes → `ready`         |
| `ready`          | Ready for Pickup     | Until expiry filled | Courier → `deliver`, walk-in → `handoff` |
| `deliver`        | Order Sent           | No        | → `transit`                         |
| `transit`        | Delivering           | Yes       | Timer (2 min) → `delivered-hold`   |
| `delivered-hold` | Delivered            | Yes       | Timer (30 min) → `done`            |
| `handoff`        | Confirm Pickup       | No        | → `done`                            |
| `complete`       | Delivered            | Yes       | Manual → `done`                     |
| `done`           | Final state          | Yes       | —                                   |

Key utilities in `utils.ts`:
- `canonicalActionType(order)` — derives actionType from status+phase
- `normalizeOrderFlow(order)` — call after mutating an order to keep actionType consistent
- `isDeliveredHoldAction(order)` — checks the 30-min hold state
- `isExpiryFulfilledForReady(order)` — blocks "ready" until expiry is set

---

## State — useReducer Store

`src/store/orderStore.ts` exports `useAppStore()` which returns `{ state, dispatch }`.

Key action types (discriminated union `Action`):
- `SELECT_ORDER` · `SET_FILTER` · `SET_SEARCH` · `SET_DETAIL_TAB`
- `HANDLE_MAIN_ACTION` — central action dispatcher per order workflow step
- `SEND_MSG` · `OPEN_PRESCRIPTION` · `CLOSE_PRESCRIPTION`
- `OPEN_REJECT_POPUP` · `SET_REJECT_REASON` · `CONFIRM_REJECT` · `CLOSE_REJECT_POPUP`
- `SHOW_INCOMING_POPUP` · `DISMISS_INCOMING_POPUP` · `FOCUS_INCOMING_ORDER`
- `START_BARCODE` · `START_BARCODE_SCAN` · `COMPLETE_BARCODE_SCAN` · `TICK_BARCODE_AUTOCLOSE` · `CLOSE_BARCODE`
- `TICK_TIMERS` — fired every second, advances delivering/delivered-hold timers
- `SHOW_TOAST` · `TOAST_LEAVING` · `HIDE_TOAST`

`AppState` shape:
```ts
{ orders, activeId, filter, search, detailTab, verifyPayUnlockAt,
  barcode: BarcodeState, incoming: IncomingState,
  toast: ToastState, rejectPopup: RejectPopupState, prescriptionPopup }
// ToastState includes a `key: number` that increments on every new toast —
// Dashboard useEffect depends on it (not message) to reset the dismiss timer.
```

---

## Component Conventions

### New interactive components
```tsx
'use client'; // required for hooks, event handlers

// forwardRef when parent needs a DOM ref (scroll shadows, measurements)
const MyComponent = forwardRef<HTMLDivElement, Props>(function MyComponent(props, ref) {
  return <div ref={ref} className="my-component">...</div>;
});
```

### No inline styles — use CSS custom properties for dynamic values
```tsx
// Allowed: passing a runtime value as a CSS custom property
<div style={{ ['--progress-pct' as string]: `${pct}%` }} />
// CSS: .element::after { width: var(--progress-pct, 0%); }
```

### Icons
All icons live in `src/components/ui/Icon.tsx`. Each is a named React FC that returns SVG `<path>` elements as JSX — no raw SVG string injection. Add new icons by extending the `ICONS` record with a named FC.

```tsx
// Usage
<Icon name="medication" />   // renders as <svg><path .../></svg>

// Adding a new icon in Icon.tsx:
const NewIcon: FC = () => <path d="..." />;
// Add to ICONS map: newIcon: NewIcon
// Add to the Icon name union type
```

### CSS class naming
- Layout: `.app-root`, `.main`, `.list-panel`, `.detail-panel`
- List: `.order-row`, `.row-body`, `.row-left`, `.row-right`, `.row-name`, `.row-status.status-*`
- Detail: `.buyer-card`, `.detail-tabs`, `.detail-tab`, `.action-footer`, `.main-action`
- Badges: `.pay-badge.paid|unpaid|cod`, `.mbadge.mb-new|prep|ready|done|rx|unpaid`
- Modals: `.incoming-popup`, `.reject-popup`, `.prescription-popup`, `.barcode-popup`
- State modifiers: `.is-on`, `.is-off`, `.is-passive`, `.has-progress`, `.is-visible`, `.is-leaving`, `.active`, `.scroll-shadow`

---

## Timing Constants (from utils.ts)

| Constant             | Value    | Purpose                                  |
|----------------------|----------|------------------------------------------|
| `DELIVERING_ETA_MS`  | 2 min    | transit → delivered-hold auto-transition |
| `COMPLETE_AUTO_MS`   | 30 min   | delivered-hold → done auto-transition    |
| `VERIFY_PAY_LOCK_MS` | 10 s     | lock window after payment confirm        |
| `SHIPPER_ARRIVAL_MS` | 2 min    | shipper arrival countdown                |
| `PACKING_ETA_MS`     | 2 min    | packing progress estimate                |

---

## Adding a New Feature — Checklist

1. **Type first**: add any new fields to `Order`, `AppState`, or sub-interfaces in `types.ts`
2. **Action**: add the action type to the `Action` union in `orderStore.ts`
3. **Reducer**: handle the action in `reducer()` — call `normalizeOrderFlow()` after mutating an order
4. **Token**: if new colors are needed, follow the token pipeline (foundation → semantic → component → CSS rule)
5. **Component**: create the file in the appropriate folder, use `'use client'` if interactive, use only `var(--*)` for design values
6. **Wire up**: dispatch from `Dashboard.tsx` or the appropriate parent
7. **Build check**: `npm run build` must pass with zero errors

---

## Running Locally

```bash
cd rxflow-orders
npm install
npm run dev    # http://localhost:3000
npm run build  # production build check
```
