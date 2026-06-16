'use client';

import { forwardRef } from 'react';
import type { Order, DetailTab } from '@/lib/types';

interface DetailTabsProps {
  order: Order;
  activeTab: DetailTab;
  onSetTab: (t: DetailTab) => void;
}

const DetailTabs = forwardRef<HTMLDivElement, DetailTabsProps>(function DetailTabs({ order, activeTab, onSetTab }, ref) {
  const unreadCount = order.msgs.filter(m => m.unread).length;

  return (
    <div className="detail-tabs" ref={ref}>
      <button
        className={`detail-tab ${activeTab === 'fulfillment' ? 'active' : ''}`}
        type="button"
        onClick={() => onSetTab('fulfillment')}
      >
        Items
        <span className="detail-tab-badge">{order.items.length}</span>
      </button>
      <button
        className={`detail-tab ${activeTab === 'messages' ? 'active' : ''}`}
        type="button"
        onClick={() => onSetTab('messages')}
      >
        Messages
        <span className={`detail-tab-badge ${unreadCount > 0 ? 'is-alert' : ''}`}>{order.msgs.length}</span>
      </button>
    </div>
  );
});

export default DetailTabs;
