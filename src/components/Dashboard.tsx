'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/orderStore';
import Topbar from './layout/Topbar';
import ListPanel from './list/ListPanel';
import DetailPanel from './detail/DetailPanel';
import IncomingPopup from './modals/IncomingPopup';
import RejectPopup from './modals/RejectPopup';
import PrescriptionPopup from './modals/PrescriptionPopup';
import BarcodePopup from './modals/BarcodePopup';
import Toast from './ui/Toast';
import type { Order } from '@/lib/types';
import { ORDERS_SEED } from '@/lib/data';
import { normalizeOrderFlow } from '@/lib/utils';

const INCOMING_POPUP_INITIAL_DELAY_MS = 3000;
const INCOMING_POPUP_LOOP_MS = 10000;
const INCOMING_POPUP_VISIBLE_MS = 5000;
const INCOMING_POPUP_ANIM_OUT_MS = 400;
const BARCODE_SCAN_STEP_MS = 1100;
const BARCODE_BETWEEN_MS = 700;
const TOAST_VISIBLE_MS = 2200;
const TOAST_ANIM_OUT_MS = 400;
const DEMO_SOURCE_IDS = ['RX-001', 'RX-002', 'RX-008'];

function buildIncomingOrder(template: Order, existingIds: string[]): Order {
  const maxId = existingIds.reduce((max, id) => {
    const m = id.match(/\d+/);
    return m ? Math.max(max, Number(m[0])) : max;
  }, 0);
  const draft: Order = JSON.parse(JSON.stringify(template));
  const now = Date.now();
  draft.id = `RX-${String(maxId + 1).padStart(3, '0')}`;
  draft.time = new Date(now).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  draft.timeAgo = 'just now';
  draft.status = 'new';
  draft.phase = 0;
  draft.actionType = draft.payStatus === 'unpaid' ? 'verify-pay' : 'accept';
  draft.seenByPharmacist = false;
  draft.receivedAt = now;
  draft.msgs = draft.msgs.map(m => ({ ...m, unread: m.from === 'buyer' }));
  draft.items = draft.items.map(i => ({ ...i, packed: false }));
  normalizeOrderFlow(draft);
  return draft;
}

export default function Dashboard() {
  const { state, dispatch } = useAppStore();
  const stateRef = useRef(state);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const incomingLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomingHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomingLeaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barcodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDemoIdRef = useRef<string | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 1-second global tick for countdowns
  useEffect(() => {
    tickRef.current = setInterval(() => {
      dispatch({ type: 'TICK_TIMERS' });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [dispatch]);

  // Barcode scan animation loop
  const runBarcodeStep = useCallback(() => {
    dispatch({ type: 'START_BARCODE_SCAN' });
    barcodeTimerRef.current = setTimeout(() => {
      dispatch({ type: 'COMPLETE_BARCODE_SCAN' });
      barcodeTimerRef.current = setTimeout(runBarcodeStep, BARCODE_BETWEEN_MS);
    }, BARCODE_SCAN_STEP_MS);
  }, [dispatch]);

  useEffect(() => {
    if (state.barcode.isOpen && state.barcode.queue.length > 0 && state.barcode.currentScanIdx === null && !barcodeTimerRef.current) {
      barcodeTimerRef.current = setTimeout(runBarcodeStep, BARCODE_BETWEEN_MS);
    }
    if (!state.barcode.isOpen || (state.barcode.queue.length === 0 && state.barcode.currentScanIdx === null)) {
      if (barcodeTimerRef.current) { clearTimeout(barcodeTimerRef.current); barcodeTimerRef.current = null; }
    }
  }, [state.barcode.currentScanIdx, state.barcode.isOpen, state.barcode.queue.length, runBarcodeStep]);

  useEffect(() => {
    const activeOrder = state.activeId ? state.orders.find(o => o.id === state.activeId) : null;
    if (
      activeOrder?.actionType === 'review' &&
      (!state.barcode.isOpen || state.barcode.activeOrderId !== activeOrder.id)
    ) {
      dispatch({ type: 'START_BARCODE', orderId: activeOrder.id });
    }
  }, [dispatch, state.activeId, state.barcode.activeOrderId, state.barcode.isOpen, state.orders]);

  useEffect(() => {
    if (!state.toast.visible) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      dispatch({ type: 'TOAST_LEAVING' });
      toastTimerRef.current = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
        toastTimerRef.current = null;
      }, TOAST_ANIM_OUT_MS);
    }, TOAST_VISIBLE_MS);
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, [dispatch, state.toast.key, state.toast.visible]);

  // Incoming order popup demo loop
  const scheduleIncoming = useCallback((delayMs = INCOMING_POPUP_INITIAL_DELAY_MS) => {
    if (incomingLoopRef.current) clearTimeout(incomingLoopRef.current);
    incomingLoopRef.current = setTimeout(() => {
      const { incoming, orders } = stateRef.current;
      if (!incoming.enabled) return;
      const candidates = DEMO_SOURCE_IDS.map(id => ORDERS_SEED.find(o => o.id === id)).filter(Boolean) as Order[];
      const pool = candidates.filter(o => o.id !== lastDemoIdRef.current);
      const source = pool.length ? pool : candidates;
      if (!source.length) return;
      const template = source[Math.floor(Math.random() * source.length)];
      lastDemoIdRef.current = template.id;
      const newOrder = buildIncomingOrder(template, orders.map(o => o.id));
      dispatch({ type: 'SHOW_INCOMING_POPUP', order: newOrder, hideAt: Date.now() + INCOMING_POPUP_VISIBLE_MS });
      if (incomingHideRef.current) clearTimeout(incomingHideRef.current);
      incomingHideRef.current = setTimeout(() => {
        dispatch({ type: 'DISMISS_INCOMING_POPUP' });
        if (incomingLeaveRef.current) clearTimeout(incomingLeaveRef.current);
        incomingLeaveRef.current = setTimeout(() => {
          dispatch({ type: 'INCOMING_LEAVING_DONE' });
          scheduleIncoming(INCOMING_POPUP_LOOP_MS);
        }, INCOMING_POPUP_ANIM_OUT_MS);
      }, INCOMING_POPUP_VISIBLE_MS);
    }, delayMs);
  }, [dispatch]);

  useEffect(() => {
    if (state.incoming.enabled) scheduleIncoming();
    else if (incomingLoopRef.current) clearTimeout(incomingLoopRef.current);
    return () => {
      if (incomingLoopRef.current) clearTimeout(incomingLoopRef.current);
      if (incomingHideRef.current) clearTimeout(incomingHideRef.current);
      if (incomingLeaveRef.current) clearTimeout(incomingLeaveRef.current);
    };
  }, [scheduleIncoming, state.incoming.enabled]);

  const dismissIncoming = useCallback(() => {
    if (incomingHideRef.current) clearTimeout(incomingHideRef.current);
    dispatch({ type: 'DISMISS_INCOMING_POPUP' });
    if (incomingLeaveRef.current) clearTimeout(incomingLeaveRef.current);
    incomingLeaveRef.current = setTimeout(() => {
      dispatch({ type: 'INCOMING_LEAVING_DONE' });
      scheduleIncoming(INCOMING_POPUP_LOOP_MS);
    }, INCOMING_POPUP_ANIM_OUT_MS);
  }, [dispatch, scheduleIncoming]);

  const focusIncoming = useCallback(() => {
    if (incomingHideRef.current) clearTimeout(incomingHideRef.current);
    if (incomingLeaveRef.current) clearTimeout(incomingLeaveRef.current);
    dispatch({ type: 'FOCUS_INCOMING_ORDER' });
    scheduleIncoming(INCOMING_POPUP_LOOP_MS);
  }, [dispatch, scheduleIncoming]);

  const handleMainAction = useCallback((id: string) => {
    const barcodeState = stateRef.current.barcode;
    if (barcodeState.activeOrderId === id && !barcodeState.isOpen && barcodeState.done < barcodeState.total) {
      dispatch({ type: 'START_BARCODE', orderId: id });
      return;
    }
    const order = stateRef.current.orders.find(o => o.id === id);
    const shouldStartBarcode = order?.actionType === 'accept' || order?.actionType === 'ready';
    if (order?.actionType === 'ready') {
      dispatch({ type: 'START_BARCODE', orderId: id });
      return;
    }
    dispatch({ type: 'HANDLE_MAIN_ACTION', orderId: id });
    if (shouldStartBarcode && order?.actionType !== 'accept') {
      setTimeout(() => {
        dispatch({ type: 'START_BARCODE', orderId: id });
      }, 0);
    }
  }, [dispatch]);

  const { orders, activeId, filter, search, detailTab, barcode, incoming, toast, rejectPopup, prescriptionPopup, verifyPayUnlockAt } = state;

  return (
    <div className="app-root">
      <Topbar incomingEnabled={incoming.enabled} onToggleIncoming={() => dispatch({ type: 'TOGGLE_INCOMING_ENABLED' })} />
      <div className="main">
        <ListPanel
          orders={orders}
          activeId={activeId}
          filter={filter}
          search={search}
          onSelectOrder={id => dispatch({ type: 'SELECT_ORDER', id })}
          onSetFilter={f => dispatch({ type: 'SET_FILTER', filter: f })}
          onSetSearch={s => dispatch({ type: 'SET_SEARCH', search: s })}
        />
        <DetailPanel
          orders={orders}
          activeId={activeId}
          detailTab={detailTab}
          barcode={barcode}
          verifyPayUnlockAt={verifyPayUnlockAt}
          onSetDetailTab={tab => dispatch({ type: 'SET_DETAIL_TAB', tab })}
          onMainAction={handleMainAction}
          onSubAction={(label, id) => {
            if (label === 'Reject Order') dispatch({ type: 'OPEN_REJECT_POPUP', orderId: id, mode: 'reject' });
            else if (label === 'Cancel Order') dispatch({ type: 'OPEN_REJECT_POPUP', orderId: id, mode: 'cancel' });
            else dispatch({ type: 'SHOW_TOAST', message: label, icon: 'send' });
          }}
          onSendMsg={(id, text) => dispatch({ type: 'SEND_MSG', orderId: id, text })}
          onOpenPrescription={id => dispatch({ type: 'OPEN_PRESCRIPTION', orderId: id })}
          onOrderHistory={id => dispatch({ type: 'SHOW_TOAST', message: `Order history for ${id}`, icon: 'time' })}
        />
      </div>

      <IncomingPopup
        incoming={incoming}
        orders={orders}
        onDismiss={dismissIncoming}
        onFocus={focusIncoming}
      />

      {rejectPopup.isOpen && (
        <RejectPopup
          mode={rejectPopup.mode}
          reason={rejectPopup.reason}
          onSetReason={r => dispatch({ type: 'SET_REJECT_REASON', reason: r })}
          onClose={() => dispatch({ type: 'CLOSE_REJECT_POPUP' })}
          onConfirm={() => dispatch({ type: 'CONFIRM_REJECT' })}
        />
      )}

      {prescriptionPopup.isOpen && prescriptionPopup.orderId && (() => {
        const o = orders.find(x => x.id === prescriptionPopup.orderId);
        return o ? (
          <PrescriptionPopup
            order={o}
            onClose={() => dispatch({ type: 'CLOSE_PRESCRIPTION' })}
          />
        ) : null;
      })()}

      {barcode.isOpen && barcode.activeOrderId && (() => {
        const o = orders.find(x => x.id === barcode.activeOrderId);
        return o ? (
          <BarcodePopup
            order={o}
            barcode={barcode}
            onClose={() => dispatch({ type: 'CONFIRM_BARCODE_PACKED' })}
            onCancel={() => dispatch({ type: 'CLOSE_BARCODE', force: true })}
          />
        ) : null;
      })()}

      <Toast toast={toast} />
    </div>
  );
}
