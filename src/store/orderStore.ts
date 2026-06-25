'use client';

import { useReducer } from 'react';
import type { Order, FilterKey, DetailTab } from '@/lib/types';
import { ORDERS_SEED } from '@/lib/data';
import {
  normalizeOrderFlow,
  isDeliveredHoldAction,
  DELIVERING_ETA_MS,
  COMPLETE_AUTO_MS,
  VERIFY_PAY_LOCK_MS,
  MAIN_ACTION_LOCK_MS,
  isExpiryFulfilledForReady,
} from '@/lib/utils';

function cloneOrders(): Order[] {
  const orders = JSON.parse(JSON.stringify(ORDERS_SEED)) as Order[];
  orders.forEach(normalizeOrderFlow);
  return orders;
}

export interface BarcodeState {
  activeOrderId: string | null;
  queue: number[];
  currentScanIdx: number | null;
  lastScannedIdx: number | null;
  total: number;
  done: number;
  isOpen: boolean;
}

export interface IncomingState {
  isVisible: boolean;
  isLeaving: boolean;
  orderId: string | null;
  pendingOrder: Order | null;
  remainingSec: number;
  hideAt: number | null;
  enabled: boolean;
}

export interface ToastState {
  message: string;
  icon: string;
  visible: boolean;
  leaving: boolean;
  key: number;
}

function makeToast(prev: ToastState, message: string, icon: string): ToastState {
  return { message, icon, visible: true, leaving: false, key: prev.key + 1 };
}

export interface RejectPopupState {
  isOpen: boolean;
  orderId: string | null;
  reason: string;
  mode: 'reject' | 'cancel';
}

export interface AppState {
  orders: Order[];
  activeId: string | null;
  filter: FilterKey;
  search: string;
  detailTab: DetailTab;
  verifyPayUnlockAt: number;
  barcode: BarcodeState;
  incoming: IncomingState;
  toast: ToastState;
  rejectPopup: RejectPopupState;
  prescriptionPopup: { isOpen: boolean; orderId: string | null };
  mainActionLockedUntil: number;
}

export type Action =
  | { type: 'SELECT_ORDER'; id: string }
  | { type: 'SET_FILTER'; filter: FilterKey }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_DETAIL_TAB'; tab: DetailTab }
  | { type: 'SEND_MSG'; orderId: string; text: string }
  | { type: 'HANDLE_MAIN_ACTION'; orderId: string }
  | { type: 'SHOW_TOAST'; message: string; icon: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'TOAST_LEAVING' }
  | { type: 'OPEN_REJECT_POPUP'; orderId: string; mode: 'reject' | 'cancel' }
  | { type: 'CLOSE_REJECT_POPUP' }
  | { type: 'SET_REJECT_REASON'; reason: string }
  | { type: 'CONFIRM_REJECT' }
  | { type: 'OPEN_PRESCRIPTION'; orderId: string }
  | { type: 'CLOSE_PRESCRIPTION' }
  | { type: 'TOGGLE_INCOMING_ENABLED' }
  | { type: 'SHOW_INCOMING_POPUP'; order: Order; hideAt: number }
  | { type: 'DISMISS_INCOMING_POPUP' }
  | { type: 'INCOMING_LEAVING_DONE' }
  | { type: 'FOCUS_INCOMING_ORDER' }
  | { type: 'START_BARCODE'; orderId: string }
  | { type: 'CLOSE_BARCODE'; force?: boolean }
  | { type: 'CONFIRM_BARCODE_PACKED' }
  | { type: 'START_BARCODE_SCAN' }
  | { type: 'COMPLETE_BARCODE_SCAN' }
  | { type: 'TICK_TIMERS' };


function initialState(): AppState {
  return {
    orders: cloneOrders(),
    activeId: null,
    filter: 'all',
    search: '',
    detailTab: 'fulfillment',
    verifyPayUnlockAt: Date.now() + VERIFY_PAY_LOCK_MS,
    barcode: { activeOrderId: null, queue: [], currentScanIdx: null, lastScannedIdx: null, total: 0, done: 0, isOpen: false },
    incoming: { isVisible: false, isLeaving: false, orderId: null, pendingOrder: null, remainingSec: 0, hideAt: null, enabled: true },
    toast: { message: '', icon: 'check', visible: false, leaving: false, key: 0 },
    rejectPopup: { isOpen: false, orderId: null, reason: '', mode: 'reject' },
    prescriptionPopup: { isOpen: false, orderId: null },
    mainActionLockedUntil: 0,
  };
}

function applyAdvance(orders: Order[], orderId: string): { orders: Order[]; msg: string; icon: string } {
  const o = orders.find(x => x.id === orderId);
  if (!o) return { orders, msg: '', icon: 'check' };

  type FlowStep = { status: Order['status']; phase: number; next: Order['actionType']; msg: string };
  const flow: Partial<Record<Order['actionType'], FlowStep>> = {
    accept:       { status: 'preparing', phase: 2, next: 'ready',         msg: 'Order accepted — now packing' },
    review:       { status: 'preparing', phase: 2, next: 'ready',         msg: 'Review complete — now packing' },
    'verify-pay': { status: 'new',       phase: 1, next: 'accept',        msg: 'Payment Verified' },
    ready:        { status: 'ready',     phase: 3, next: 'handoff',       msg: 'Order is waiting for shipper pickup' },
    handoff:      { status: 'delivered', phase: 5, next: 'delivered-hold',msg: 'Order delivered' },
    deliver:      { status: 'delivering',phase: 4, next: 'transit',       msg: 'Order picked up by shipper — now delivering' },
    complete:     { status: 'completed', phase: 6, next: 'done',          msg: 'Order completed' },
  };
  const step = flow[o.actionType];
  if (!step) return { orders, msg: '', icon: 'check' };

  if (o.actionType === 'verify-pay') { o.payStatus = 'paid'; o.seenByPharmacist = true; }
  if (o.actionType === 'ready') {
    if (o.deliveryType === 'courier') { step.phase = 4; step.next = 'deliver'; step.msg = 'Order is waiting for shipper pickup'; }
    else { step.msg = 'Order is ready for customer pickup'; }
  }
  if (o.actionType === 'handoff' && o.deliveryType !== 'courier') step.msg = 'Order picked up by customer';

  const now = Date.now();
  o.status = step.status;
  o.phase = step.phase;
  o.actionType = step.next;
  o.stageChangedAt = now;
  if (step.status === 'delivering') o.deliveringStartedAt = now;
  if (step.status === 'ready') o.readyForPickupAt = now;
  if (step.status === 'delivering') delete o.readyForPickupAt;
  if (step.status === 'delivered') { o.deliveredAt = now; delete o.deliveringStartedAt; delete o.readyForPickupAt; }
  if (step.status === 'completed') { delete o.deliveredAt; delete o.deliveringStartedAt; delete o.readyForPickupAt; }
  if (['handoff', 'deliver', 'transit', 'delivered-hold', 'complete', 'done'].includes(step.next)) {
    o.items.forEach(i => { i.packed = true; });
  }
  normalizeOrderFlow(o);
  return { orders, msg: step.msg, icon: 'check' };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_ORDER': {
      if (!action.id) return state;
      const orders = [...state.orders];
      const o = orders.find(x => x.id === action.id);
      if (!o) return state;
      if (o && o.status === 'new' && o.payStatus !== 'unpaid') o.seenByPharmacist = true;
      return { ...state, orders, activeId: action.id, detailTab: 'fulfillment' };
    }
    case 'SET_FILTER': return { ...state, filter: action.filter };
    case 'SET_SEARCH': return { ...state, search: action.search };
    case 'SET_DETAIL_TAB': {
      if (action.tab === 'messages') {
        const orders = [...state.orders];
        const o = orders.find(x => x.id === state.activeId);
        if (o) o.msgs.forEach(m => { m.unread = false; });
        return { ...state, orders, detailTab: action.tab };
      }
      return { ...state, detailTab: action.tab };
    }
    case 'SEND_MSG': {
      const orders = [...state.orders];
      const o = orders.find(x => x.id === action.orderId);
      if (!o) return state;
      o.msgs.push({
        from: 'pharmacy',
        text: action.text.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        unread: false,
      });
      return { ...state, orders, toast: makeToast(state.toast, 'Message sent', 'chat') };
    }
    case 'HANDLE_MAIN_ACTION': {
      const now = Date.now();
      if (state.mainActionLockedUntil > now) return state;
      const o = state.orders.find(x => x.id === action.orderId);
      if (!o) return state;
      if (o.actionType === 'verify-pay' && state.verifyPayUnlockAt > Date.now()) return state;
      if (o.actionType === 'ready' && !isExpiryFulfilledForReady(o)) {
        return { ...state, toast: makeToast(state.toast, 'Complete expiry for all items before ready for pickup', 'error') };
      }
      if (['accept', 'handoff', 'deliver'].includes(o.actionType) && o.stageChangedAt && now - o.stageChangedAt < MAIN_ACTION_LOCK_MS) return state;
      if ((o.actionType === 'handoff' || o.actionType === 'deliver') && o.readyForPickupAt && now - o.readyForPickupAt < MAIN_ACTION_LOCK_MS) return state;
      if (o.actionType === 'review') return state;
      if (o.actionType === 'transit' || isDeliveredHoldAction(o) || o.actionType === 'done') return state;
      if (o.actionType === 'accept') {
        if (state.barcode.isOpen && state.barcode.activeOrderId && state.barcode.activeOrderId !== action.orderId) {
          return { ...state, toast: makeToast(state.toast, 'Packing automation is already running', 'hourglass') };
        }
        const orders = [...state.orders];
        const ord = orders.find(x => x.id === action.orderId)!;
        ord.actionType = 'review';
        if (ord.hasRx && ord.rxStatus === 'pending') ord.rxStatus = 'approved';
        normalizeOrderFlow(ord);
        const unpacked = ord.items.map((_, idx) => idx).filter(idx => !ord.items[idx].packed);
        const total = unpacked.length || ord.items.length;
        return {
          ...state,
          orders,
          barcode: {
            activeOrderId: action.orderId,
            queue: unpacked,
            currentScanIdx: null,
            lastScannedIdx: null,
            total,
            done: unpacked.length ? 0 : total,
            isOpen: true,
          },
          mainActionLockedUntil: now + MAIN_ACTION_LOCK_MS,
          toast: makeToast(state.toast, 'Reviewing order', 'search'),
        };
      }
      const orders = [...state.orders];
      const { msg, icon } = applyAdvance(orders, action.orderId);
      return { ...state, orders, mainActionLockedUntil: now + MAIN_ACTION_LOCK_MS, toast: makeToast(state.toast, msg, icon) };
    }
    case 'SHOW_TOAST': return { ...state, toast: makeToast(state.toast, action.message, action.icon) };
    case 'TOAST_LEAVING': return { ...state, toast: { ...state.toast, leaving: true } };
    case 'HIDE_TOAST': return { ...state, toast: { ...state.toast, visible: false, leaving: false } };

    case 'OPEN_REJECT_POPUP': return { ...state, rejectPopup: { isOpen: true, orderId: action.orderId, reason: '', mode: action.mode } };
    case 'CLOSE_REJECT_POPUP': return { ...state, rejectPopup: { isOpen: false, orderId: null, reason: '', mode: 'reject' } };
    case 'SET_REJECT_REASON': return { ...state, rejectPopup: { ...state.rejectPopup, reason: action.reason } };
    case 'CONFIRM_REJECT': {
      const { orderId, reason, mode } = state.rejectPopup;
      if (!orderId || !reason) return state;
      const statusVal: Order['status'] = mode === 'cancel' ? 'cancelled' : 'rejected';
      const msg = mode === 'cancel' ? 'Order cancelled' : 'Order rejected';
      const toastIcon = mode === 'cancel' ? 'check' : 'error';
      const prefix = mode === 'cancel' ? 'Cancelled reason' : 'Rejected reason';
      const orders = [...state.orders];
      const idx = orders.findIndex(x => x.id === orderId);
      if (idx < 0) return state;
      const o = { ...orders[idx] };
      const now = Date.now();
      o.status = statusVal; o.phase = 6; o.actionType = 'done';
      o.rejectReason = reason; o.note = `${prefix}: ${reason}`;
      o.receivedAt = now;
      o.time = new Date(now).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      normalizeOrderFlow(o);
      orders.splice(idx, 1);
      orders.push(o);
      return { ...state, orders, rejectPopup: { isOpen: false, orderId: null, reason: '', mode: 'reject' }, toast: makeToast(state.toast, msg, toastIcon) };
    }

    case 'OPEN_PRESCRIPTION': return { ...state, prescriptionPopup: { isOpen: true, orderId: action.orderId } };
    case 'CLOSE_PRESCRIPTION': return { ...state, prescriptionPopup: { isOpen: false, orderId: null } };

    case 'TOGGLE_INCOMING_ENABLED': return { ...state, incoming: { ...state.incoming, enabled: !state.incoming.enabled }, toast: makeToast(state.toast, state.incoming.enabled ? 'New order receiving paused' : 'New order receiving enabled', 'notification') };
    case 'SHOW_INCOMING_POPUP': {
      const remainingSec = Math.max(0, Math.ceil((action.hideAt - Date.now()) / 1000));
      return {
        ...state,
        incoming: {
          ...state.incoming,
          pendingOrder: action.order,
          orderId: action.order.id,
          isVisible: true,
          isLeaving: false,
          hideAt: action.hideAt,
          remainingSec,
        },
      };
    }
    case 'DISMISS_INCOMING_POPUP': return { ...state, incoming: { ...state.incoming, isVisible: false, isLeaving: true, hideAt: null, remainingSec: 0 } };
    case 'INCOMING_LEAVING_DONE': {
      const pending = state.incoming.pendingOrder;
      if (!pending) return { ...state, incoming: { ...state.incoming, isLeaving: false, hideAt: null } };
      const exists = state.orders.some(order => order.id === pending.id);
      const orders = exists ? state.orders : [pending, ...state.orders];
      return {
        ...state,
        orders,
        incoming: { ...state.incoming, isLeaving: false, pendingOrder: null, orderId: pending.id, hideAt: null },
      };
    }
    case 'FOCUS_INCOMING_ORDER': {
      const targetId = state.incoming.pendingOrder?.id ?? state.incoming.orderId;
      if (!targetId) return { ...state, incoming: { ...state.incoming, isVisible: false, isLeaving: false, pendingOrder: null, hideAt: null, remainingSec: 0 } };
      const pending = state.incoming.pendingOrder;
      const orders = pending && !state.orders.some(order => order.id === pending.id)
        ? [pending, ...state.orders]
        : [...state.orders];
      const o = orders.find(x => x.id === targetId);
      if (o && o.status === 'new' && o.payStatus !== 'unpaid') o.seenByPharmacist = true;
      return { ...state, orders, filter: 'all', activeId: targetId, detailTab: 'fulfillment', incoming: { ...state.incoming, isVisible: false, isLeaving: false, pendingOrder: null, orderId: targetId, hideAt: null, remainingSec: 0 }, toast: makeToast(state.toast, 'Opened incoming order', 'notification') };
    }

    case 'START_BARCODE': {
      const order = state.orders.find(x => x.id === action.orderId);
      if (!order) return state;
      if (state.barcode.activeOrderId === action.orderId) {
        return { ...state, barcode: { ...state.barcode, isOpen: true } };
      }
      if (state.barcode.isOpen && state.barcode.activeOrderId && state.barcode.activeOrderId !== action.orderId) {
        return { ...state, toast: makeToast(state.toast, 'Packing automation is already running', 'hourglass') };
      }
      const unpacked = order.items.map((_, idx) => idx).filter(idx => !order.items[idx].packed);
      if (!unpacked.length) {
        const total = order.items.length;
        if (!total || order.status !== 'preparing') {
          return { ...state, toast: makeToast(state.toast, 'All items already packed', 'check') };
        }
        return {
          ...state,
          barcode: { activeOrderId: action.orderId, queue: [], currentScanIdx: null, lastScannedIdx: null, total, done: total, isOpen: true },
        };
      }
      const orders = [...state.orders];
      const o = orders.find(x => x.id === action.orderId)!;
      if (o.hasRx && o.rxStatus === 'pending') o.rxStatus = 'approved';
      return { ...state, orders, barcode: { activeOrderId: action.orderId, queue: unpacked, currentScanIdx: null, lastScannedIdx: null, total: unpacked.length, done: 0, isOpen: true } };
    }
    case 'CLOSE_BARCODE': {
      if (!action.force && state.barcode.done < state.barcode.total) return state;
      if (action.force && state.barcode.done < state.barcode.total) {
        const orders = [...state.orders];
        const order = state.barcode.activeOrderId
          ? orders.find(x => x.id === state.barcode.activeOrderId)
          : null;
        const restartQueue = order?.items.map((_, idx) => idx) ?? [];
        if (order) {
          order.status = 'preparing';
          order.phase = 2;
          order.actionType = 'ready';
          order.seenByPharmacist = true;
          order.stageChangedAt = Date.now();
          order.items.forEach(item => { item.packed = false; });
          normalizeOrderFlow(order);
        }
        return {
          ...state,
          orders,
          barcode: {
            ...state.barcode,
            queue: restartQueue,
            currentScanIdx: null,
            lastScannedIdx: null,
            total: restartQueue.length,
            done: 0,
            isOpen: false,
          },
        };
      }
      return { ...state, barcode: { activeOrderId: null, queue: [], currentScanIdx: null, lastScannedIdx: null, total: 0, done: 0, isOpen: false } };
    }
    case 'CONFIRM_BARCODE_PACKED': {
      if (!state.barcode.activeOrderId || state.barcode.done < state.barcode.total) return state;
      const orders = [...state.orders];
      const o = orders.find(x => x.id === state.barcode.activeOrderId);
      if (!o) return state;
      const now = Date.now();
      o.items.forEach(item => { item.packed = true; });
      o.status = 'ready';
      o.phase = o.deliveryType === 'courier' ? 4 : 3;
      o.actionType = o.deliveryType === 'courier' ? 'deliver' : 'handoff';
      o.stageChangedAt = now;
      o.readyForPickupAt = now;
      delete o.deliveringStartedAt;
      normalizeOrderFlow(o);
      return {
        ...state,
        orders,
        barcode: { activeOrderId: null, queue: [], currentScanIdx: null, lastScannedIdx: null, total: 0, done: 0, isOpen: false },
        toast: makeToast(state.toast, o.deliveryType === 'courier' ? 'Order is waiting for shipper pickup' : 'Order is ready for customer pickup', 'check'),
      };
    }
    case 'START_BARCODE_SCAN': {
      if (!state.barcode.activeOrderId || state.barcode.currentScanIdx !== null || !state.barcode.queue.length) return state;
      const scanPosition = Math.floor(Math.random() * state.barcode.queue.length);
      const nextIdx = state.barcode.queue[scanPosition];
      const remainingQueue = state.barcode.queue.filter((_, idx) => idx !== scanPosition);
      return {
        ...state,
        barcode: {
          ...state.barcode,
          queue: remainingQueue,
          currentScanIdx: nextIdx,
        },
      };
    }
    case 'COMPLETE_BARCODE_SCAN': {
      if (!state.barcode.activeOrderId || state.barcode.currentScanIdx === null) return state;
      const nextIdx = state.barcode.currentScanIdx;
      const orders = [...state.orders];
      const o = orders.find(x => x.id === state.barcode.activeOrderId);
      if (!o) return state;
      if (o.items[nextIdx]) o.items[nextIdx].packed = true;
      const done = state.barcode.done + 1;
      let toastUpdate = {};
      if (state.barcode.queue.length === 0) {
        if (o.status === 'new') {
          o.status = 'preparing';
          o.phase = Math.max(o.phase, 2);
          if (o.actionType === 'accept' || o.actionType === 'review') o.actionType = 'ready';
          normalizeOrderFlow(o);
        }
        toastUpdate = { toast: makeToast(state.toast, 'Barcode packing completed', 'box') };
      }
      return {
        ...state,
        orders,
        barcode: {
          ...state.barcode,
          currentScanIdx: null,
          lastScannedIdx: nextIdx,
          done,
        },
        ...toastUpdate,
      };
    }
    case 'TICK_TIMERS': {
      const now = Date.now();
      let changed = false;
      const orders = [...state.orders];
      for (const order of orders) {
        if (order.status === 'delivering') {
          if (!order.deliveringStartedAt) { order.deliveringStartedAt = now; changed = true; }
          if (now - (order.deliveringStartedAt ?? now) >= DELIVERING_ETA_MS) {
            order.status = 'delivered'; order.phase = 5; order.actionType = 'delivered-hold';
            order.deliveredAt = now; delete order.deliveringStartedAt;
            normalizeOrderFlow(order); changed = true;
          }
        }
        if (isDeliveredHoldAction(order)) {
          if (!order.deliveredAt) { order.deliveredAt = now; changed = true; }
          if (now - (order.deliveredAt ?? now) >= COMPLETE_AUTO_MS) {
            order.status = 'completed'; order.phase = 6; order.actionType = 'done';
            delete order.deliveredAt; normalizeOrderFlow(order); changed = true;
          }
        }
      }
      let incoming = state.incoming;
      if (state.incoming.isVisible && state.incoming.hideAt !== null) {
        const remainingSec = Math.max(0, Math.ceil((state.incoming.hideAt - now) / 1000));
        if (remainingSec !== state.incoming.remainingSec) {
          incoming = { ...state.incoming, remainingSec };
        }
      }
      return changed || incoming !== state.incoming ? { ...state, orders, incoming } : state;
    }
    default: return state;
  }
}

export function useAppStore() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return { state, dispatch };
}
