import type { Order } from '@/lib/types';
import { workflowStatusMeta, toOrderCode, fmt, payLbl, itemSummaryPreview } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface OrderRowProps {
  order: Order;
  isActive: boolean;
  onClick: () => void;
}

export default function OrderRow({ order, isActive, onClick }: OrderRowProps) {
  const stage = workflowStatusMeta(order);
  const { items: previewItems, hiddenCount } = itemSummaryPreview(order);

  return (
    <div
      className={`order-row ${isActive ? 'active' : ''} ${order.timeAgo === 'just now' ? 'is-newly-inserted' : ''}`}
      data-order-id={order.id}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-selected={isActive}
    >
      <div className="row-body">
        <div className="row-left">
          <div className="row-name-line">
            <span className="row-name">{order.customer}</span>
            {order.hasRx && (
              <span className="row-rx-badge">
                <Icon name="document" />
                <span>Prescription</span>
              </span>
            )}
          </div>
          <div className="row-note">&quot;{order.note || 'No note from buyer'}&quot;</div>
          <div className="row-item-summary">
            <span className="row-item-count-badge" aria-label={`${order.items.length} items`}>
              {order.items.length}
            </span>
            <span className="row-item-summary-text">
              {previewItems.map((item, idx) => (
                <span key={idx} className="row-item-chip">
                  {idx > 0 && <span className="row-item-sep">·</span>}
                  <span className="row-item-chip-name">{item.name}</span>
                  <span className="row-item-chip-qty">×{item.qty ?? 1}</span>
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="row-item-chip row-item-chip-more">
                  <span className="row-item-chip-name">+{hiddenCount} more</span>
                </span>
              )}
              {previewItems.length === 0 && (
                <span className="row-item-chip-name">No items listed</span>
              )}
            </span>
          </div>
          <div className="row-price-line">
            <div className="row-total">{fmt(order.total + order.deliveryFee)}</div>
            <div>
              <span className={`pay-badge ${order.payStatus}`}>{payLbl(order.payStatus)}</span>
            </div>
          </div>
        </div>

        <div className="row-right">
          <div className="row-kicker row-kicker-right">
            <span className="row-code">#{toOrderCode(order.id)}</span>
            <span className="row-created">{order.time}</span>
          </div>
          <div className="row-stage-meta">
            <span className={`row-status-badge ${stage.cls}`}>{stage.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
