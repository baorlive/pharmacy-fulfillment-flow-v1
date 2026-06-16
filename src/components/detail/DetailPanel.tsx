'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { Order, DetailTab } from '@/lib/types';
import DetailTabs from './DetailTabs';
import BuyerCard from './BuyerCard';
import MessagesPane from './MessagesPane';
import FulfillmentPane from './FulfillmentPane';
import ActionFooter from './ActionFooter';
import type { BarcodeState } from '@/store/orderStore';

interface DetailPanelProps {
  orders: Order[];
  activeId: string | null;
  detailTab: DetailTab;
  barcode: BarcodeState;
  verifyPayUnlockAt: number;
  onSetDetailTab: (t: DetailTab) => void;
  onMainAction: (id: string) => void;
  onSubAction: (label: string, id: string) => void;
  onSendMsg: (id: string, text: string) => void;
  onOpenPrescription: (id: string) => void;
  onOrderHistory: (id: string) => void;
}

export default function DetailPanel({
  orders, activeId, detailTab, barcode, verifyPayUnlockAt,
  onSetDetailTab, onMainAction, onSubAction, onSendMsg, onOpenPrescription, onOrderHistory,
}: DetailPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const order = activeId ? orders.find(x => x.id === activeId) ?? null : null;

  const updateScrollShadows = useCallback(() => {
    const scroll = scrollRef.current;
    const tabs = tabsRef.current;
    const footer = footerRef.current;
    if (!scroll) return;
    const atTop = scroll.scrollTop <= 1;
    const atBottom = scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 1;
    tabs?.classList.toggle('scroll-shadow', !atTop);
    footer?.classList.toggle('scroll-shadow', !atBottom);
  }, []);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    updateScrollShadows();
    scroll.addEventListener('scroll', updateScrollShadows, { passive: true });
    return () => scroll.removeEventListener('scroll', updateScrollShadows);
  }, [updateScrollShadows, order, detailTab]);

  if (!order) {
    return (
      <div className="detail-panel">
        <div className="detail-empty-state">
          <div className="detail-empty-copy">Select an item to see detail</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <BuyerCard order={order} onOrderHistory={() => onOrderHistory(order.id)} />
      <DetailTabs
        ref={tabsRef}
        order={order}
        activeTab={detailTab}
        onSetTab={onSetDetailTab}
      />
      <div className="detail-scroll" ref={scrollRef}>
        <div className={`tab-pane ${detailTab === 'messages' ? 'active' : ''}`}>
          <MessagesPane order={order} onSendMsg={text => onSendMsg(order.id, text)} />
        </div>
        <div className={`tab-pane ${detailTab === 'fulfillment' ? 'active' : ''}`}>
          <FulfillmentPane order={order} onOpenPrescription={() => onOpenPrescription(order.id)} />
        </div>
      </div>
      <ActionFooter
        ref={footerRef}
        order={order}
        verifyPayUnlockAt={verifyPayUnlockAt}
        isPackingPaused={barcode.activeOrderId === order.id && !barcode.isOpen && barcode.done < barcode.total}
        onMainAction={() => onMainAction(order.id)}
        onSubAction={label => onSubAction(label, order.id)}
      />
    </div>
  );
}
