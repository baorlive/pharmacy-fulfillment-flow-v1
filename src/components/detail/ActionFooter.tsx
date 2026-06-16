'use client';

import { forwardRef, useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import {
  isDeliveredHoldAction,
  getDeliveringProgressPct,
  getCompleteProgressPct,
  getDeliveringCountdownMs,
  getCompleteCountdownMs,
  formatCountdown,
} from '@/lib/utils';
import Icon from '@/components/ui/Icon';

interface ActionFooterProps {
  order: Order;
  verifyPayUnlockAt: number;
  isPackingPaused: boolean;
  onMainAction: () => void;
  onSubAction: (label: string) => void;
}

type ActionCfg = {
  label: string;
  cls: string;
  sub: string[];
  disabled?: boolean;
};

const ACTION_CONFIG: Partial<Record<Order['actionType'], ActionCfg>> = {
  accept:           { label: 'Accept Order',     cls: '',           sub: ['Call Buyer', 'Reject Order'] },
  review:           { label: 'Barcode scanning...',     cls: 'is-passive', sub: ['Call Buyer', 'Reject Order'], disabled: true },
  'verify-pay':     { label: 'Confirm Payment Received', cls: 'c-warning',  sub: ['Notify Customer', 'Cancel Order'] },
  ready:            { label: 'Continue Packing',         cls: '',           sub: [] },
  handoff:          { label: 'Order Sent',              cls: '',           sub: ['Print Receipt', 'Report Issue'] },
  deliver:          { label: 'Order Sent',              cls: '',           sub: ['Remind Shipper', 'Help'] },
  transit:          { label: 'Delivering',              cls: 'is-passive', sub: ['Print Receipt', 'Help'], disabled: true },
  'delivered-hold': { label: 'Delivered',               cls: 'is-passive', sub: ['Print Receipt', 'Report Issue'], disabled: true },
  complete:         { label: 'Delivered',               cls: 'is-passive', sub: ['Print Receipt', 'Report Issue'], disabled: true },
};

function SubBtnLabel({ label, actionType }: { label: string; actionType: Order['actionType'] }) {
  if ((actionType === 'accept' || actionType === 'review') && label === 'Call Buyer') {
    return <><Icon name="phone" /><span>Call Buyer</span></>;
  }
  if (actionType === 'deliver' && label === 'Remind Shipper') {
    return <><Icon name="notification" /><span>Remind Shipper</span></>;
  }
  if ((actionType === 'deliver' || actionType === 'transit') && label === 'Help') {
    return <><Icon name="lifebuoy" /><span>Help</span></>;
  }
  return <>{label}</>;
}

const ActionFooter = forwardRef<HTMLDivElement, ActionFooterProps>(function ActionFooter(
  { order, verifyPayUnlockAt, isPackingPaused, onMainAction, onSubAction },
  ref
) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (order.actionType === 'done') {
    const isCanceled = order.status === 'cancelled' || order.status === 'canceled';
    const isRejected = order.status === 'rejected' || order.rxStatus === 'rejected';
    const isCompleted = !isCanceled && !isRejected;
    const label = isCanceled ? 'Cancelled' : isRejected ? 'Rejected' : 'Order Completed';
    return (
      <div className="action-footer" ref={ref}>
        <button className={`main-action ${isCanceled || isRejected ? 'rejected' : 'done'}`} disabled>
          <span className="main-action-title">
            {isCompleted && (
              <span className="done-order-icon" aria-hidden="true">
                <Icon name="check" />
              </span>
            )}
            <span>{label}</span>
          </span>
          <span className="main-action-sub" />
        </button>
        {isCompleted && (
          <div className="sub-actions">
            <button
              className="sub-btn"
              type="button"
              onClick={() => onSubAction('Print Receipt')}
            >
              Print Receipt
            </button>
          </div>
        )}
      </div>
    );
  }

  const cfg = ACTION_CONFIG[order.actionType] ?? { label: 'Continue', cls: '', sub: [] };
  const isTransit = order.actionType === 'transit';
  const isDeliveredHold = isDeliveredHoldAction(order);
  const verifyPayRemaining = order.actionType === 'verify-pay' ? Math.max(0, verifyPayUnlockAt - now) : 0;
  const verifyPayLocked = order.actionType === 'verify-pay' && verifyPayRemaining > 0;

  let mainLabel = isPackingPaused ? 'Continue Packing' : cfg.label;
  let mainSub = '';
  if (verifyPayLocked) {
    mainLabel = 'Waiting payment update';
    mainSub = `Try again in ${formatCountdown(verifyPayRemaining)}`;
  } else if (isTransit) {
    mainLabel = 'Delivering';
    mainSub = `Est. time to delivered: ${formatCountdown(getDeliveringCountdownMs(order, now))}`;
  } else if (isDeliveredHold) {
    mainLabel = 'Delivered';
    mainSub = `Automatically set to Completed in ${formatCountdown(getCompleteCountdownMs(order, now))} if no feedback from buyer`;
  }

  const isDisabled = !isPackingPaused && Boolean(cfg.disabled || isTransit || isDeliveredHold || verifyPayLocked);
  const progressPct = isTransit
    ? getDeliveringProgressPct(order, now)
    : isDeliveredHold ? getCompleteProgressPct(order, now) : 0;
  const hasProgress = isTransit || isDeliveredHold;
  const renderMainActionContent = () => (
    <>
      <span className="main-action-title">{mainLabel}</span>
      <span className="main-action-sub">{mainSub}</span>
    </>
  );

  return (
    <div className="action-footer" ref={ref}>
      <button
        id="main-action-btn"
        data-action-type={order.actionType}
        data-order-status={order.status}
        className={`main-action ${isPackingPaused ? '' : cfg.cls} ${mainSub ? 'has-sub' : ''} ${hasProgress ? 'has-progress' : ''}`}
        style={hasProgress ? { ['--progress-pct' as string]: `${progressPct}%` } : undefined}
        onClick={isDisabled ? undefined : onMainAction}
        disabled={isDisabled}
      >
        <span className="main-action-content main-action-content-base">
          {renderMainActionContent()}
        </span>
        {hasProgress && (
          <span className="main-action-content main-action-content-fill" aria-hidden="true">
            {renderMainActionContent()}
          </span>
        )}
      </button>
      {cfg.sub.length > 0 && (
        <div className="sub-actions">
          {cfg.sub.map(label => (
            <button
              key={label}
              className="sub-btn"
              type="button"
              onClick={() => onSubAction(label)}
            >
              <SubBtnLabel label={label} actionType={order.actionType} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default ActionFooter;
