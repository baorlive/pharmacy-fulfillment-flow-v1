import type { Order, OrderStatus, ActionType, FilterKey, PayStatus } from './types';

export const DELIVERING_ETA_MS   = 30 * 1000;
export const SHIPPER_ARRIVAL_MS  = 2 * 60 * 1000;
export const PACKING_ETA_MS      = 2 * 60 * 1000;
export const COMPLETE_AUTO_MS    = 30 * 60 * 1000;
export const VERIFY_PAY_LOCK_MS  = 10 * 1000;

export const SCANNED_EXPIRY_VISIBLE_STATUSES = new Set<OrderStatus>([
  'preparing', 'ready', 'delivering', 'delivered', 'completed',
]);

export const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

export const payLbl = (s: PayStatus) =>
  ({ paid: 'Paid', cod: 'Paid', unpaid: 'Unpaid' }[s] ?? s);

export const statusLbl = (s: OrderStatus) =>
  ({
    new: 'New', preparing: 'Packing', ready: 'Waiting for shipper',
    delivering: 'Delivering', delivered: 'Delivered', completed: 'Completed',
    rejected: 'Rejected', cancelled: 'Cancelled', canceled: 'Cancelled',
  }[s] ?? s);

export function toOrderCode(id: string): string {
  const match = id.match(/\d+/);
  if (!match) return id;
  const n = 1023 + Number(match[0]);
  return `ORD-${String(n).padStart(4, '0')}`;
}

export function timeToMinutes(timeText: string): number {
  const m = String(timeText || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return -1;
  let hour = Number(m[1]) % 12;
  const minute = Number(m[2]);
  if (m[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + minute;
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function canonicalPhase(o: Order): number {
  if (o.status === 'rejected' || o.status === 'cancelled' || o.status === 'canceled') return 6;
  if (o.status === 'completed') return 6;
  if (o.status === 'delivered') return 5;
  if (o.status === 'delivering') return 4;
  if (o.status === 'ready') return 3;
  if (o.status === 'preparing') return 2;
  if (o.payStatus === 'unpaid') return 0;
  return 1;
}

export function canonicalActionType(o: Order): ActionType {
  if (o.status === 'completed' || o.status === 'rejected' || o.status === 'cancelled' || o.status === 'canceled' || o.rxStatus === 'rejected') return 'done';
  if (o.status === 'delivered') return 'delivered-hold';
  if (o.status === 'delivering') return 'transit';
  if (o.status === 'ready') return o.deliveryType === 'courier' ? 'deliver' : 'handoff';
  if (o.status === 'preparing') return 'ready';
  if (o.payStatus === 'unpaid') return 'verify-pay';
  if (o.status === 'new' && o.actionType === 'review') return 'review';
  return 'accept';
}

export function normalizeOrderFlow(o: Order): void {
  if (!o) return;

  if (o.payStatus === 'cod') {
    o.payStatus = 'paid';
    if (o.payMethod === 'Cash on Delivery') o.payMethod = 'VNPay';
  }

  if (o.rxStatus === 'rejected') {
    o.status = 'completed';
    o.phase = 6;
    o.actionType = 'done';
    delete o.deliveredAt;
    return;
  }

  if (o.payStatus === 'unpaid' && !['delivered', 'delivering', 'completed', 'rejected', 'cancelled', 'canceled'].includes(o.status)) {
    o.status = 'new';
  }

  o.phase = canonicalPhase(o);
  o.actionType = canonicalActionType(o);

  const now = Date.now();
  if (o.status === 'delivered') {
    if (!o.deliveredAt) o.deliveredAt = now;
    delete o.deliveringStartedAt;
    delete o.packingStartedAt;
  } else if (o.status === 'delivering') {
    if (!o.deliveringStartedAt) o.deliveringStartedAt = now;
    delete o.deliveredAt;
    delete o.packingStartedAt;
  } else if (o.status === 'preparing') {
    if (!o.packingStartedAt) o.packingStartedAt = now;
    delete o.deliveredAt;
    delete o.deliveringStartedAt;
  } else {
    delete o.deliveredAt;
    delete o.deliveringStartedAt;
    delete o.packingStartedAt;
  }

  if (isCourierAwaitingPickup(o)) {
    if (!o.shipperEtaStartedAt) o.shipperEtaStartedAt = now;
  } else {
    delete o.shipperEtaStartedAt;
  }
}

export function isCourierAwaitingPickup(order: Order): boolean {
  if (!order || order.deliveryType !== 'courier') return false;
  if (order.payStatus === 'unpaid') return false;
  if (['delivering', 'delivered', 'completed'].includes(order.status)) return false;
  return ['new', 'preparing', 'ready'].includes(order.status);
}

export function isCourierPicked(order: Order): boolean {
  if (!order || order.deliveryType !== 'courier') return false;
  return ['delivering', 'delivered', 'completed'].includes(order.status);
}

export function isDeliveredHoldAction(order: Order): boolean {
  if (!order) return false;
  return order.status === 'delivered' && (order.actionType === 'delivered-hold' || order.actionType === 'complete');
}

export function getOrderStageKey(o: Order): FilterKey {
  if (o.status === 'new') {
    if (o.payStatus === 'unpaid') return 'new_waiting_payment';
    const seen = Boolean(o.seenByPharmacist || o.actionType === 'review');
    return seen ? 'packing' : 'new_waiting_payment';
  }
  if (o.status === 'rejected') return 'rejected';
  if (o.status === 'cancelled' || o.status === 'canceled') return 'cancelled';
  if (o.status === 'completed') return 'completed';
  if (o.status === 'delivered') return 'delivered';
  if (o.status === 'delivering') return 'delivering';
  if (o.status === 'ready') return 'ready_to_ship';
  if (o.status === 'preparing') return 'packing';
  return 'new_waiting_payment';
}

export interface WorkflowStatusMeta {
  label: string;
  cls: string;
}

export function workflowStatusMeta(o: Order): WorkflowStatusMeta {
  if (o.status === 'rejected') return { label: 'Rejected', cls: 'status-cancelled' };
  if (o.status === 'cancelled' || o.status === 'canceled') return { label: 'Cancelled', cls: 'status-canceled' };
  if (o.rxStatus === 'rejected') return { label: 'Rejected', cls: 'status-cancelled' };
  if (o.status === 'completed') return { label: 'Completed', cls: 'status-completed' };
  if (o.status === 'delivered') return { label: 'Delivered', cls: 'status-delivered' };
  if (o.status === 'delivering') return { label: 'Delivering', cls: 'status-delivering' };
  if (o.payStatus === 'unpaid') return { label: 'Waiting for Payment', cls: 'status-waiting-payment' };
  if (o.status === 'new') {
    const seen = Boolean(o.seenByPharmacist || o.actionType === 'review');
    return { label: seen ? 'Order Review' : 'New', cls: seen ? 'status-order-review' : 'status-new' };
  }
  if (o.status === 'preparing') return { label: 'Packing', cls: 'status-packing' };
  if (o.status === 'ready') return { label: 'Waiting for Pickup', cls: 'status-ready-to-ship' };
  return { label: 'New', cls: 'status-new' };
}

export function shippingByLabel(o: Order): string {
  if (o.deliveryType !== 'courier') return 'Customer pickup';
  const rawCourier = String(o.courier || '').trim();
  const normalizedCourier = rawCourier.toLowerCase();
  if (normalizedCourier === 'grabexpress' || normalizedCourier === 'grab') return 'AhaMove';
  return rawCourier || 'Courier';
}

export interface ShippingMeta {
  label: string;
  value: string;
}

export function shippingMeta(order: Order, now = Date.now()): ShippingMeta {
  if (!order) return { label: 'Shipping by', value: '—' };
  if (order.deliveryType !== 'courier') {
    return { label: 'Pickup method', value: 'Pickup at Store' };
  }
  if (order.payStatus === 'unpaid') {
    return { label: 'Deliver / Pickup ETA', value: 'Not assigned yet' };
  }
  if (order.status === 'delivering') {
    const eta = formatCountdown(getDeliveringCountdownMs(order, now));
    return { label: 'Delivering / EST Complete Time', value: `${shippingByLabel(order)} · ${eta}` };
  }
  if (isCourierPicked(order)) {
    return { label: 'Delivered by', value: shippingByLabel(order) };
  }
  if (isCourierAwaitingPickup(order)) {
    return { label: 'Deliver by', value: 'AhaMove - T.Nam 033465758' };
  }
  return { label: 'Deliver / Pickup ETA', value: shippingByLabel(order) };
}

export function getDeliveringCountdownMs(order: Order, now = Date.now()): number {
  if (!order || order.status !== 'delivering') return 0;
  if (!order.deliveringStartedAt) return DELIVERING_ETA_MS;
  return Math.max(0, DELIVERING_ETA_MS - (now - order.deliveringStartedAt));
}

export function getDeliveringProgressPct(order: Order, now = Date.now()): number {
  if (!order || order.status !== 'delivering') return 0;
  if (!order.deliveringStartedAt) return 0;
  return Math.min(100, Math.max(0, ((now - order.deliveringStartedAt) / DELIVERING_ETA_MS) * 100));
}

export function getPackingCountdownMs(order: Order, now = Date.now()): number {
  if (!order || order.status !== 'preparing') return 0;
  if (!order.packingStartedAt) return PACKING_ETA_MS;
  return Math.max(0, PACKING_ETA_MS - (now - order.packingStartedAt));
}

export function getCompleteCountdownMs(order: Order, now = Date.now()): number {
  if (!isDeliveredHoldAction(order)) return 0;
  if (!order.deliveredAt) return COMPLETE_AUTO_MS;
  return Math.max(0, COMPLETE_AUTO_MS - (now - order.deliveredAt));
}

export function getCompleteProgressPct(order: Order, now = Date.now()): number {
  if (!isDeliveredHoldAction(order) || !order.deliveredAt) return 0;
  return Math.min(100, Math.max(0, ((now - order.deliveredAt) / COMPLETE_AUTO_MS) * 100));
}

export function getShipperArrivalCountdownMs(order: Order, now = Date.now()): number {
  if (!isCourierAwaitingPickup(order)) return 0;
  if (!order.shipperEtaStartedAt) return SHIPPER_ARRIVAL_MS;
  return Math.max(0, SHIPPER_ARRIVAL_MS - (now - order.shipperEtaStartedAt));
}

export function resolveStorageStatus(order: Order, item: { name: string; qty?: number }, index: number): 'in-stock' | 'out-of-stock' | 'need-check' {
  const seedText = `${order.id}|${item.name}|${index}|${item.qty ?? ''}`;
  let score = 0;
  for (let i = 0; i < seedText.length; i++) score += seedText.charCodeAt(i);
  const pick = score % 10;
  if (pick <= 5) return 'in-stock';
  if (pick <= 7) return 'need-check';
  return 'out-of-stock';
}

export function stockStatusLabel(status: string): string {
  if (status === 'in-stock') return 'In Stock';
  if (status === 'out-of-stock') return 'Out of Stock';
  return 'Need Check';
}

export function isExpiryFulfilledForReady(order: Order): boolean {
  if (!order?.items?.length) return true;
  return order.items.every(item => Boolean(item?.expiry));
}

export function shouldShowItemExpiry(order: Order): boolean {
  return SCANNED_EXPIRY_VISIBLE_STATUSES.has(order.status);
}

export function itemSummaryPreview(order: Order): { items: typeof order.items; hiddenCount: number } {
  if (!order.items.length) return { items: [], hiddenCount: 0 };
  const maxChars = 120;
  const previewItems: typeof order.items = [];
  let usedChars = 0;
  for (const item of order.items) {
    const qty = item.qty ?? 1;
    const token = `${item.name}×${qty}`;
    if (previewItems.length === 0 || usedChars + token.length <= maxChars) {
      previewItems.push(item);
      usedChars += token.length + 3;
    } else break;
  }
  return { items: previewItems, hiddenCount: Math.max(0, order.items.length - previewItems.length) };
}

export function renderMessageText(text: string): string {
  return text
    .replace(/📷/g, '[image]')
    .replace(/🙏/g, '[user]');
}

export function sortOrders(orders: Order[]): Order[] {
  const isDone = (o: Order) => o.status === 'cancelled' || o.status === 'canceled' || o.status === 'rejected';
  return [...orders].sort((a, b) => {
    const da = isDone(a) ? 1 : 0;
    const db = isDone(b) ? 1 : 0;
    if (da !== db) return da - db;
    const ra = Number(a.receivedAt || 0);
    const rb = Number(b.receivedAt || 0);
    if (rb !== ra) return rb - ra;
    const ta = timeToMinutes(a.time);
    const tb = timeToMinutes(b.time);
    if (tb !== ta) return tb - ta;
    return (b.id || '').localeCompare(a.id || '');
  });
}
