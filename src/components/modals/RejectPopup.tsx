'use client';

interface RejectPopupProps {
  mode: 'reject' | 'cancel';
  reason: string;
  onSetReason: (r: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const REJECT_REASONS = [
  'Out of stock',
  'Item discontinued',
  'Prescription invalid',
  'Customer unresponsive',
  'Unable to verify payment',
  'Other',
];

const CANCEL_REASONS = [
  'Customer requested',
  'Duplicate order',
  'Payment issue',
  'Unable to fulfill',
  'Other',
];

export default function RejectPopup({ mode, reason, onSetReason, onClose, onConfirm }: RejectPopupProps) {
  const reasons = mode === 'cancel' ? CANCEL_REASONS : REJECT_REASONS;
  const title = mode === 'cancel' ? 'Cancel Order' : 'Reject Order';
  const sub = mode === 'cancel'
    ? 'This order will be cancelled. Please select a reason.'
    : 'This order will be rejected. Please select a reason.';
  const confirmLabel = mode === 'cancel' ? 'Confirm Cancel' : 'Confirm Reject';

  return (
    <div className="reject-popup" onClick={onClose}>
      <div className="reject-popup-card" onClick={e => e.stopPropagation()}>
        <div className="reject-popup-title">{title}</div>
        <div className="reject-popup-sub">{sub}</div>
        <div className="reject-reason-list">
          {reasons.map(r => (
            <button
              key={r}
              className={`reject-reason-btn ${reason === r ? 'active' : ''}`}
              type="button"
              onClick={() => onSetReason(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="reject-popup-actions">
          <button className="incoming-btn ghost" type="button" onClick={onClose}>
            Keep Order
          </button>
          <button
            className="reject-confirm-btn incoming-btn primary"
            type="button"
            disabled={!reason}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
