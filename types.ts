
export type UserRole = 'STUDENT' | 'VENDOR' | 'RIDER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance?: number;
}

export interface Vendor {
  id: string;
  name:string;
  cuisine: string;
  rating: number;
  isOpen: boolean;
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'Ready for Pickup',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  studentId: string;
  vendorId: string;
  riderId?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  deliveryAddress: string;
}
