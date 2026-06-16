'use client';

import { useEffect, useState } from 'react';
import type { IncomingState } from '@/store/orderStore';
import type { Order } from '@/lib/types';
import { fmt, payLbl } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface IncomingPopupProps {
  incoming: IncomingState;
  orders: Order[];
  onDismiss: () => void;
  onFocus: () => void;
}

export default function IncomingPopup({ incoming, onDismiss, onFocus }: IncomingPopupProps) {
  const { isVisible, isLeaving, pendingOrder, remainingSec } = incoming;
  const [hasEntered, setHasEntered] = useState(false);
  const MAX_ITEMS = 4;

  useEffect(() => {
    if (!isVisible) {
      setHasEntered(false);
      return;
    }

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setHasEntered(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isVisible, pendingOrder?.id]);

  if (!isVisible && !isLeaving) return null;

  const order = pendingOrder;
  if (!order) return null;
  const visibleItems = order.items.slice(0, MAX_ITEMS);
  const hiddenCount = Math.max(0, order.items.length - MAX_ITEMS);
  const payVariant = order.payStatus === 'paid' || order.payStatus === 'cod' ? order.payStatus : 'unpaid';

  return (
    <div className={`incoming-popup ${hasEntered ? 'is-visible' : ''} ${isLeaving ? 'is-leaving' : ''}`}>
      <div className="incoming-popup-card" role="dialog" aria-modal="true" aria-labelledby="incoming-order-meta">
        <div className="incoming-popup-summary">
          <div className="incoming-popup-order-meta" id="incoming-order-meta">
            New Order {order.id} · {order.time}
          </div>
          <div className="incoming-popup-order-top">
            <div className="incoming-popup-order-name">{order.customer}</div>
            <div className="incoming-popup-order-phone">{order.phone}</div>
          </div>
        </div>
        <div className="incoming-popup-section">
          <div className="incoming-popup-section-title">User Note</div>
          {order.hasRx && (
            <div className="incoming-popup-rx-row">
              <span className="row-rx-badge">
                <Icon name="document" />
                <span>Prescription</span>
              </span>
            </div>
          )}
          <div className="incoming-popup-note">{order.note || 'No note from buyer'}</div>
        </div>
        <div className="incoming-popup-section">
          <div className="incoming-popup-section-title incoming-popup-items-title">
            <span>Items</span>
            <span className="row-item-count-badge" aria-label={`${order.items.length} items`}>
              {order.items.length}
            </span>
          </div>
          <div className="incoming-popup-order-items">
            {visibleItems.length === 0 ? (
              <div className="row-item-summary">
                <span className="row-item-summary-text">
                  <span className="row-item-chip-name">No items listed</span>
                </span>
              </div>
            ) : (
              visibleItems.map((item, idx) => (
                <div key={idx} className="row-item-summary">
                  <span className="row-item-summary-text">
                    <span className="row-item-chip">
                      <span className="row-item-chip-name">{item.name}</span>
                      <span className="row-item-chip-qty">×{item.qty ?? 1}</span>
                    </span>
                  </span>
                </div>
              ))
            )}
            {hiddenCount > 0 && (
              <div className="incoming-popup-more-row">+{hiddenCount} more item{hiddenCount > 1 ? 's' : ''}</div>
            )}
          </div>
          <div className="incoming-popup-items-total">
            <span className="incoming-popup-order-total">{fmt(order.total + order.deliveryFee)}</span>
            <span className={`pay-badge ${payVariant}`}>{payLbl(payVariant)}</span>
          </div>
        </div>
        <div className="incoming-popup-actions">
          <button className="incoming-btn ghost" type="button" onClick={onDismiss}>
            Dismiss ({Math.max(0, remainingSec)})
          </button>
          <button className="incoming-btn primary" type="button" onClick={onFocus}>
            View order
          </button>
        </div>
      </div>
    </div>
  );
}
