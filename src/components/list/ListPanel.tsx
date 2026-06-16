'use client';

import { useEffect, useRef } from 'react';
import type { Order, FilterKey } from '@/lib/types';
import { getOrderStageKey, sortOrders } from '@/lib/utils';
import FilterBar from './FilterBar';
import OrderRow from './OrderRow';

interface ListPanelProps {
  orders: Order[];
  activeId: string | null;
  filter: FilterKey;
  search: string;
  onSelectOrder: (id: string) => void;
  onSetFilter: (f: FilterKey) => void;
  onSetSearch: (s: string) => void;
}

const FILTER_STAGE_KEYS: FilterKey[] = ['all', 'new_waiting_payment', 'packing', 'ready_to_ship', 'delivering', 'delivered', 'completed', 'cancelled', 'rejected'];

export default function ListPanel({ orders, activeId, filter, search, onSelectOrder, onSetFilter, onSetSearch }: ListPanelProps) {
  const listScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listScrollRef.current;
    if (!el) return;

    const syncScrollbarWidth = () => {
      const scrollbarWidth = Math.max(0, el.offsetWidth - el.clientWidth);
      el.style.setProperty('--list-scrollbar-width', `${scrollbarWidth}px`);
    };

    syncScrollbarWidth();
    window.addEventListener('resize', syncScrollbarWidth);

    const observer = new ResizeObserver(syncScrollbarWidth);
    observer.observe(el);

    return () => {
      window.removeEventListener('resize', syncScrollbarWidth);
      observer.disconnect();
    };
  }, [orders, filter, search]);

  const stageCounts = FILTER_STAGE_KEYS.reduce<Record<string, number>>((acc, key) => {
    acc[key] = key === 'all' ? orders.length : orders.filter(o => getOrderStageKey(o) === key).length;
    return acc;
  }, {});

  let visible = filter === 'all' ? orders : orders.filter(o => getOrderStageKey(o) === filter);
  if (search) {
    const q = search.toLowerCase();
    visible = visible.filter(o => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }
  visible = sortOrders(visible);

  return (
    <div className="list-panel">
      <FilterBar
        filter={filter}
        search={search}
        stageCounts={stageCounts}
        onSetFilter={onSetFilter}
        onSetSearch={onSetSearch}
      />
      <div className="list-scroll" ref={listScrollRef}>
        {visible.length === 0 ? (
          <div className="list-empty-state">
            No orders found
          </div>
        ) : (
          visible.map(order => (
            <OrderRow
              key={order.id}
              order={order}
              isActive={order.id === activeId}
              onClick={() => onSelectOrder(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
