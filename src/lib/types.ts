export type PayStatus = 'paid' | 'unpaid' | 'cod';
export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'canceled';

export type ActionType =
  | 'accept'
  | 'review'
  | 'verify-pay'
  | 'ready'
  | 'handoff'
  | 'deliver'
  | 'transit'
  | 'delivered-hold'
  | 'complete'
  | 'done';

export type RxStatus = 'pending' | 'approved' | 'rejected' | null;
export type DeliveryType = 'courier' | 'pickup';

export interface OrderItem {
  name: string;
  dose: string;
  price: number;
  qty: number;
  packed: boolean;
  expiry: string;
  icon: string;
  storageStatus?: 'in-stock' | 'out-of-stock' | 'need-check';
}

export interface Message {
  from: 'buyer' | 'pharmacy';
  text: string;
  time: string;
  unread: boolean;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  deliveryType: DeliveryType;
  courier: string | null;
  status: OrderStatus;
  payStatus: PayStatus;
  payMethod: string;
  hasRx: boolean;
  rxStatus: RxStatus;
  total: number;
  deliveryFee: number;
  time: string;
  timeAgo: string;
  phase: number;
  msgs: Message[];
  items: OrderItem[];
  note: string | null;
  actionType: ActionType;
  seenByPharmacist?: boolean;
  receivedAt?: number;
  deliveredAt?: number;
  deliveringStartedAt?: number;
  packingStartedAt?: number;
  readyForPickupAt?: number;
  stageChangedAt?: number;
  shipperEtaStartedAt?: number;
  rejectReason?: string;
}

export type FilterKey =
  | 'all'
  | 'new_waiting_payment'
  | 'packing'
  | 'ready_to_ship'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type DetailTab = 'fulfillment' | 'messages';
