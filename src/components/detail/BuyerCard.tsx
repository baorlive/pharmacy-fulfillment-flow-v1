import type { Order } from '@/lib/types';
import { workflowStatusMeta, shippingMeta } from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface BuyerCardProps {
  order: Order;
  onOrderHistory: () => void;
}

export default function BuyerCard({ order, onOrderHistory }: BuyerCardProps) {
  const stage = workflowStatusMeta(order);
  const shipping = shippingMeta(order);

  return (
    <div className="buyer-card">
      <div className="buyer-identity-group">
        <div className="buyer-primary-block">
          <div className="buyer-row">
            <div className="buyer-id">{order.id} · {order.time}</div>
          </div>
          <div className="buyer-name-phone">
            <span className="buyer-name">{order.customer}</span>
            <span className="buyer-name-dot">·</span>
            <span className="buyer-phone-inline">{order.phone}</span>
          </div>
          <div className="buyer-history-actions">
            <button className="rx-view-btn" type="button" onClick={onOrderHistory}>
              <span className="rx-icon"><Icon name="time" /></span>
              <span>Order History</span>
            </button>
          </div>
        </div>
        <div className="buyer-meta-grid">
          <div className="binfo body order-state">
            <span className="binfo-label">State</span>
            <span className="binfo-val">
              <span className={`row-status-badge ${stage.cls}`}>{stage.label}</span>
            </span>
          </div>
          <div className="binfo body shipping-by">
            <span className="binfo-label">{shipping.label}</span>
            <span className="binfo-val">{shipping.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
