# Barcode Scanning UX Pattern

This note preserves the previous barcode scanning interaction pattern so it can be referenced or restored later.

## Previous Active Scan Pattern

The active scanning item was communicated with a full-row blue fill state.

- The active row received the `scanning` class.
- The row used a `::before` pseudo-element as the blue background fill.
- The fill animated in with `clip-path` from bottom to top.
- When switching to the next item, the previous row received `is-scan-leaving`.
- The leaving row animated the blue fill out with `barcode-scan-fill-out`.
- Text, metadata, icon, and status inside the active/leaving row turned white or white-tinted while the row was blue.

## Timing

The last tuned animation timing was:

- Fill in/out duration: `520ms`
- Easing: `var(--f-motion-ease-inout)`
- Switch delay: removed, so the next active row starts immediately.

Earlier, a `100ms` switch delay was tried, but it was removed because it made the handoff feel less responsive.

## Previous CSS Shape

The previous pattern used rules similar to:

```css
.barcode-scan-row::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--s-action-primary);
  clip-path: inset(100% 0 0 0);
  transition: clip-path 520ms var(--f-motion-ease-inout);
  pointer-events: none;
}

.barcode-scan-row.scanning::before {
  clip-path: inset(0 0 0 0);
}

.barcode-scan-row.is-scan-leaving::before {
  animation: barcode-scan-fill-out 520ms var(--f-motion-ease-inout) forwards;
}

.barcode-scan-row.scanning .barcode-item-icon,
.barcode-scan-row.is-scan-leaving .barcode-item-icon {
  border-color: var(--s-alpha-white-36);
  background: var(--s-alpha-white-16);
  color: var(--s-text-inverse);
}

.barcode-scan-row.scanning .barcode-item-name,
.barcode-scan-row.is-scan-leaving .barcode-item-name {
  color: var(--s-text-inverse);
}

.barcode-scan-row.scanning .barcode-item-qty,
.barcode-scan-row.scanning .barcode-item-exp,
.barcode-scan-row.is-scan-leaving .barcode-item-qty,
.barcode-scan-row.is-scan-leaving .barcode-item-exp {
  color: var(--s-alpha-white-84);
}

@keyframes barcode-scan-fill-out {
  from { clip-path: inset(0 0 0 0); }
  to { clip-path: inset(100% 0 0 0); }
}
```

## Current Direction

The current implementation no longer uses the full-row blue fill. The scanning state is now communicated through the status badge:

- `SCANNING...` uses a blue filled badge.
- `ADDED` uses a stronger green filled badge.
- `QUEUED` stays quieter.

This is cleaner for random scan order because the badge points to the row without making the whole list feel like it is flashing.

## Auto-Scroll Behavior

The active scan row follows the item that was actually scanned, not the next item in list order.

- The store records `lastScannedIdx`.
- The modal highlights and scrolls to `lastScannedIdx`.
- The demo scanner picks a random remaining item to simulate real-world random scanning.
- Auto-scroll only triggers when the active row gets close to the bottom or top edge of the visible item list.
- When it scrolls, it moves in a larger chunk so it does not scroll on every scan change.
- Scroll behavior is smooth so the user can perceive the movement.

