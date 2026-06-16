import type { Order } from '@/lib/types';
import { workflowStatusMeta, resolveStorageStatus, stockStatusLabel, shouldShowItemExpiry, fmt } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface FulfillmentPaneProps {
  order: Order;
  onOpenPrescription: () => void;
}

export default function FulfillmentPane({ order, onOpenPrescription }: FulfillmentPaneProps) {
  const stage = workflowStatusMeta(order);
  const showStorageCheck = stage.label === 'Order Review';
  const showExpiry = shouldShowItemExpiry(order);
  const showPendingTag = order.status === 'preparing';

  return (
    <>
      <div className="user-note-card">
        <div className="user-note-title">User Note</div>
        <div className="user-note-text">{order.note || 'No note from user.'}</div>
        {order.hasRx && (
          <div className="user-note-actions">
            <button className="rx-view-btn" type="button" onClick={onOpenPrescription}>
              <span className="rx-icon"><Icon name="document" /></span>
              <span>View Prescription</span>
            </button>
          </div>
        )}
      </div>

      <div className="items-section">
        {order.items.map((item, idx) => {
          const storageStatus = showStorageCheck ? resolveStorageStatus(order, item, idx) : '';
          const showItemExpiry = showExpiry && item.packed;
          return (
            <div key={idx} className={`item-row ${item.packed ? 'is-packed' : 'is-pending-pack'}`}>
              <div className="item-info">
                <span className="item-qty">×<span className="item-qty-number">{item.qty}</span></span>
                <div className="item-name-exp">
                  <div className="item-name">{item.name}</div>
                  {showItemExpiry && item.expiry && (
                    <span className="item-exp">exp {item.expiry}</span>
                  )}
                  {showStorageCheck && storageStatus && (
                    <div className={`item-stock-badge ${storageStatus}`}>{stockStatusLabel(storageStatus)}</div>
                  )}
                </div>
                {item.packed && showExpiry && (
                  <span className="item-pack-badge is-packed">Packed</span>
                )}
                {!item.packed && showPendingTag && (
                  <span className="item-pack-badge is-pending-pack">Pending</span>
                )}
              </div>
              <div className="item-price">{fmt(item.price)}</div>
            </div>
          );
        })}
      </div>

      <div className="summary-section">
        <div className="sum-row">
          <span className="sum-label">Subtotal</span>
          <span className="sum-val">{fmt(order.total)}</span>
        </div>
        <div className="sum-row">
          <span className="sum-label">Delivery</span>
          <span className="sum-val">{order.deliveryFee === 0 ? 'Free (pickup)' : fmt(order.deliveryFee)}</span>
        </div>
        <div className="sum-divider" />
        <div className="sum-row sum-total">
          <span className="sum-label">Total</span>
          <span className="sum-val">{fmt(order.total + order.deliveryFee)}</span>
        </div>
        {order.status === 'completed' && (
          <div className="completed-by-badge" aria-label="Processed by pharmacist">
            <Icon name="check" />
            <span>Processed by Mrs Hong</span>
          </div>
        )}
      </div>
    </>
  );
}
