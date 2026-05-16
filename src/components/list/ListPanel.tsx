'use client';

import { useEffect, useRef, useState } from 'react';
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

const FILTER_STAGE_KEYS: FilterKey[] = ['all', 'new_waiting_payment', 'packing', 'ready_to_ship', 'delivering', 'delivered', 'completed'];
const MIN_FLOATING_THUMB_PX = 28;

export default function ListPanel({ orders, activeId, filter, search, onSelectOrder, onSetFilter, onSetSearch }: ListPanelProps) {
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const [floatingScrollbar, setFloatingScrollbar] = useState({
    enabled: false,
    thumbHeight: MIN_FLOATING_THUMB_PX,
    thumbOffset: 0,
  });

  useEffect(() => {
    const el = listScrollRef.current;
    if (!el) return;

    const syncFloatingScrollbar = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const scrollable = scrollHeight > clientHeight + 1;

      if (!scrollable) {
        setFloatingScrollbar(prev => {
          if (!prev.enabled) return prev;
          return { ...prev, enabled: false, thumbOffset: 0 };
        });
        return;
      }

      const thumbHeight = Math.max(MIN_FLOATING_THUMB_PX, (clientHeight / scrollHeight) * clientHeight);
      const maxThumbOffset = Math.max(0, clientHeight - thumbHeight);
      const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
      const thumbOffset = (scrollTop / maxScrollTop) * maxThumbOffset;

      setFloatingScrollbar({
        enabled: true,
        thumbHeight,
        thumbOffset,
      });
    };

    syncFloatingScrollbar();
    el.addEventListener('scroll', syncFloatingScrollbar, { passive: true });
    window.addEventListener('resize', syncFloatingScrollbar);

    const observer = new ResizeObserver(syncFloatingScrollbar);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', syncFloatingScrollbar);
      window.removeEventListener('resize', syncFloatingScrollbar);
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
      <div className="list-scroll-shell">
        <div className="list-scroll" ref={listScrollRef}>
          {visible.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--s-text-disabled)', fontSize: '14px' }}>
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
        <div className={`list-scrollbar-float${floatingScrollbar.enabled ? ' is-visible' : ''}`} aria-hidden="true">
          <div
            className="list-scrollbar-float-thumb"
            style={{
              height: `${floatingScrollbar.thumbHeight}px`,
              transform: `translateY(${floatingScrollbar.thumbOffset}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
