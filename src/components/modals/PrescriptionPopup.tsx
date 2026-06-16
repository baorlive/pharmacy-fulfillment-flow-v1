'use client';

import type { Order } from '@/lib/types';

interface PrescriptionPopupProps {
  order: Order;
  onClose: () => void;
}

export default function PrescriptionPopup({ order, onClose }: PrescriptionPopupProps) {
  const rxLabel = order.rxStatus === 'approved'
    ? 'Verified'
    : order.rxStatus === 'rejected'
    ? 'Rejected'
    : 'Pending Review';

  return (
    <div className="prescription-popup" onClick={onClose}>
      <div className="prescription-popup-card" onClick={e => e.stopPropagation()}>
        <div className="prescription-popup-title">Prescription</div>
        <div className="prescription-image">
          <div className="prescription-image-header">
            <span>City Health Clinic</span>
            <span>{order.id}</span>
          </div>
          <div className="prescription-image-line" />
          <div className="prescription-image-line short" />
          <div className="prescription-image-line medium" />
          <div className="prescription-image-line short" />
          <div className="prescription-image-line" />
          <div className="prescription-image-line medium" />
          <div className="prescription-image-line short" />
        </div>
        <div className="prescription-note-card">
          <span className="prescription-note-label">Patient</span>
          <div className="prescription-note-text">{order.customer} · {order.phone}</div>
        </div>
        <div className="prescription-note-card">
          <span className="prescription-note-label">Items</span>
          {order.items.map((item, i) => (
            <div key={i} className="prescription-note-text">{item.name} — {item.dose}</div>
          ))}
        </div>
        <div className="prescription-note-card">
          <span className="prescription-note-label">Status</span>
          <div className="prescription-note-text">{rxLabel}</div>
        </div>
        <div className="prescription-popup-actions">
          <button className="incoming-btn ghost" type="button" onClick={onClose}>Close</button>
          <button className="incoming-btn primary" type="button" onClick={onClose}>Mark Verified</button>
        </div>
      </div>
    </div>
  );
}
