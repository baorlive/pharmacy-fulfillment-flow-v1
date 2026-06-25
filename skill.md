---
name: rxflow-orders
description: Working guide for the Pharmacist Fulfillment repository and the RxFlow Orders dashboard. Use when reading, extending, or debugging the codebase, reducer flow, token pipeline, modal behavior, and design-system guardrails.
---

## Project At A Glance

This repository is named **Pharmacist Fulfillment**. The product shown in the UI is **RxFlow Orders**: a Next.js 14 App Router dashboard for pharmacists to review, pack, dispatch, and complete medication orders.

Tech stack:

- Next.js 14
- React 18
- TypeScript
- Local `useReducer` store
- CSS custom properties generated from TypeScript token maps

Key repo paths:

```text
.
├── dashboard-design-system.html
├── catalog-sync.md
├── docs/barcode-scanning-ux-pattern.md
├── public/getnow.svg
├── scripts/render-token-css.cjs
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── tokens/
├── src/components/
│   ├── Dashboard.tsx
│   ├── detail/
│   ├── layout/
│   ├── list/
│   ├── modals/
│   └── ui/
├── src/lib/
│   ├── data.ts
│   ├── generateTokenCss.ts
│   ├── types.ts
│   ├── utils.ts
│   └── tokens/
└── src/store/orderStore.ts
```

## Runtime Architecture

The app entry is [`src/app/page.tsx`](src/app/page.tsx), which renders [`src/components/Dashboard.tsx`](src/components/Dashboard.tsx).

`Dashboard.tsx` is the runtime orchestrator. It owns:

- a global 1-second timer that dispatches `TICK_TIMERS`
- the incoming-order demo loop
- the barcode scanning demo loop
- toast visibility timing
- modal mounting and reducer dispatch wiring

All application state lives inside [`src/store/orderStore.ts`](src/store/orderStore.ts) through `useAppStore()`.

## Store Model

`AppState` includes:

- `orders`
- `activeId`
- `filter`
- `search`
- `detailTab`
- `verifyPayUnlockAt`
- `barcode`
- `incoming`
- `toast`
- `rejectPopup`
- `prescriptionPopup`
- `mainActionLockedUntil`

Important reducer actions:

- `SELECT_ORDER`
- `SET_FILTER`
- `SET_SEARCH`
- `SET_DETAIL_TAB`
- `HANDLE_MAIN_ACTION`
- `SEND_MSG`
- `OPEN_REJECT_POPUP`
- `CONFIRM_REJECT`
- `OPEN_PRESCRIPTION`
- `TOGGLE_INCOMING_ENABLED`
- `SHOW_INCOMING_POPUP`
- `DISMISS_INCOMING_POPUP`
- `INCOMING_LEAVING_DONE`
- `FOCUS_INCOMING_ORDER`
- `START_BARCODE`
- `CLOSE_BARCODE`
- `CONFIRM_BARCODE_PACKED`
- `START_BARCODE_SCAN`
- `COMPLETE_BARCODE_SCAN`
- `TICK_TIMERS`

## Seed Data And Demo Loops

[`src/lib/data.ts`](src/lib/data.ts) seeds 9 demo orders.

The incoming-order popup is not backed by an API. `Dashboard.tsx` creates new demo orders by cloning seed templates from `RX-001`, `RX-002`, and `RX-008`, assigning a fresh ID, resetting timestamps, and reinserting the cloned order through reducer actions.

The barcode modal is also simulated:

- the store builds a queue of unpacked item indexes
- `START_BARCODE_SCAN` picks a random remaining index
- `COMPLETE_BARCODE_SCAN` marks that item as packed
- once the queue is empty, the modal can be confirmed and the order advances

## Order Workflow

The order lifecycle is controlled by `status`, `phase`, `actionType`, and a few timestamps. The reducer and utility layer treat them together as a workflow state machine.

High-level flow:

```text
verify-pay -> accept -> review -> preparing -> ready -> deliver/handoff
deliver -> transit -> delivered-hold -> done
handoff -> delivered-hold -> done
```

Behavior notes that matter when editing the code:

- `verify-pay` is the unpaid-entry state and is locked for 10 seconds using `verifyPayUnlockAt`.
- `accept` does not immediately mark the order ready. It opens barcode packing and flips the order into the passive `review` action.
- `review` is effectively a modal-driven state. The main CTA stays disabled while barcode scanning runs.
- `ready` in the reducer/type layer means "continue packing" for a `preparing` order. In the live UI, clicking the main CTA while `actionType === 'ready'` reopens the barcode modal instead of calling `applyAdvance`.
- Confirming a fully scanned barcode session sets the order to `status: 'ready'` and changes the main action to `deliver` for courier orders or `handoff` for pickup orders.
- `deliver` moves the order to `delivering`, which immediately canonicalizes to the passive `transit` action.
- Pickup handoff currently marks the order as delivered and puts it into the same `delivered-hold` timer path used by courier orders.
- `complete` exists in the action union and footer config, but the current reducer does not surface it as an active manual step. Delivered orders auto-complete after the hold timer.

Core helpers in [`src/lib/utils.ts`](src/lib/utils.ts):

- `canonicalPhase(order)`
- `canonicalActionType(order)`
- `normalizeOrderFlow(order)`
- `isDeliveredHoldAction(order)`
- `isExpiryFulfilledForReady(order)`
- `getOrderStageKey(order)`
- `workflowStatusMeta(order)`
- `shippingMeta(order)`
- `sortOrders(orders)`

## Timing Constants

These are the current live values from [`src/lib/utils.ts`](src/lib/utils.ts):

| Constant | Value | Purpose |
|---|---:|---|
| `DELIVERING_ETA_MS` | 30s | `delivering` -> `delivered-hold` |
| `SHIPPER_ARRIVAL_MS` | 2m | Shipper-arrival display countdown |
| `PACKING_ETA_MS` | 2m | Packing display countdown |
| `COMPLETE_AUTO_MS` | 30m | `delivered-hold` -> `done` |
| `VERIFY_PAY_LOCK_MS` | 10s | Unpaid-order lockout before confirm |
| `MAIN_ACTION_LOCK_MS` | 1.5s | Short guard against rapid repeated main actions |

If you change any of these, update documentation that describes them.

## Token Pipeline

The design system is a strict three-layer pipeline:

```text
src/lib/tokens/foundation.ts
  -> foundationCssVars
src/lib/tokens/semantic.ts
  -> semanticCssVars
src/lib/tokens/component.ts
  -> componentCssVars
src/lib/generateTokenCss.ts
scripts/render-token-css.cjs
src/app/tokens/foundation.css
src/app/tokens/semantic.css
src/app/tokens/component.css
src/app/layout.tsx
src/app/globals.css
```

Rules:

- Raw colors, fonts, spacing, shadows, motion, and sizing values belong in `foundation.ts`.
- `semanticCssVars` should reference `--f-*` only.
- `componentCssVars` should reference `--s-*` or `--f-*`.
- Component CSS in [`src/app/globals.css`](src/app/globals.css) should consume `--s-*` and `--c-*`.
- Do not hand-edit generated files in `src/app/tokens/`.

## Component Map

Main UI modules:

- [`src/components/layout/Topbar.tsx`](src/components/layout/Topbar.tsx): branding, incoming-order toggle, session chrome
- [`src/components/list/ListPanel.tsx`](src/components/list/ListPanel.tsx): left rail, filter/search bar, order list
- [`src/components/list/FilterBar.tsx`](src/components/list/FilterBar.tsx): filter chips, "Others" dropdown, expanding search
- [`src/components/list/OrderRow.tsx`](src/components/list/OrderRow.tsx): order card row
- [`src/components/detail/DetailPanel.tsx`](src/components/detail/DetailPanel.tsx): detail shell, tabs, footer
- [`src/components/detail/BuyerCard.tsx`](src/components/detail/BuyerCard.tsx): buyer identity and state summary
- [`src/components/detail/FulfillmentPane.tsx`](src/components/detail/FulfillmentPane.tsx): notes, items, summary
- [`src/components/detail/MessagesPane.tsx`](src/components/detail/MessagesPane.tsx): buyer/pharmacy chat thread
- [`src/components/detail/ActionFooter.tsx`](src/components/detail/ActionFooter.tsx): main workflow CTA and secondary actions
- [`src/components/modals/IncomingPopup.tsx`](src/components/modals/IncomingPopup.tsx): incoming-order preview
- [`src/components/modals/RejectPopup.tsx`](src/components/modals/RejectPopup.tsx): reject/cancel confirmation
- [`src/components/modals/PrescriptionPopup.tsx`](src/components/modals/PrescriptionPopup.tsx): prescription preview mockup
- [`src/components/modals/BarcodePopup.tsx`](src/components/modals/BarcodePopup.tsx): scan simulation
- [`src/components/ui/Icon.tsx`](src/components/ui/Icon.tsx): typed icon registry
- [`src/components/ui/Toast.tsx`](src/components/ui/Toast.tsx): transient feedback

## Before You Change Behavior

Read these files in this order:

1. [`src/lib/types.ts`](src/lib/types.ts)
2. [`src/lib/utils.ts`](src/lib/utils.ts)
3. [`src/store/orderStore.ts`](src/store/orderStore.ts)
4. The component you are changing
5. [`src/app/globals.css`](src/app/globals.css)
6. [`skill-ui-design.md`](skill-ui-design.md) for UI work

If the change affects catalog parity, also read:

- [`dashboard-design-system.html`](dashboard-design-system.html)
- [`catalog-sync.md`](catalog-sync.md)

## Safe Extension Checklist

1. Add or update shared types in [`src/lib/types.ts`](src/lib/types.ts).
2. Update reducer actions and behavior in [`src/store/orderStore.ts`](src/store/orderStore.ts).
3. Call `normalizeOrderFlow()` after manual order mutations where workflow status can drift.
4. Route new visual values through the token pipeline instead of adding raw CSS.
5. Keep React behavior intact; do not replace live components with catalog-only markup.
6. Regenerate tokens with `npm run tokens:css` when token sources change.
7. Finish with `npm run build`.

## Local Development

Run from the repository root:

```bash
npm install
npm run dev
npm run build
```

There is no automated test suite at the moment, so the production build is the main verification gate.
