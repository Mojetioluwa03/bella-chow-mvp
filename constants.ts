
import type { User, Vendor, MenuItem, Order } from './types';
import { OrderStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Tunde', email: 'student@bellachow.com', role: 'STUDENT', walletBalance: 5000 },
  { id: 'v1', name: 'BukaTeria', email: 'vendor@bellachow.com', role: 'VENDOR' },
  { id: 'r1', name: 'David', email: 'rider@bellachow.com', role: 'RIDER' },
];

export const VENDORS: Vendor[] = [
  { id: 'v1', name: 'BukaTeria', cuisine: 'Nigerian', rating: 4.5, isOpen: true, imageUrl: 'https://picsum.photos/400/200?random=1' },
  { id: 'v2', name: 'Chops & Grills', cuisine: 'Fast Food', rating: 4.2, isOpen: true, imageUrl: 'https://picsum.photos/400/200?random=2' },
  { id: 'v3', name: 'Mama\'s Kitchen', cuisine: 'Local Delicacies', rating: 4.8, isOpen: false, imageUrl: 'https://picsum.photos/400/200?random=3' },
  { id: 'v4', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.0, isOpen: true, imageUrl: 'https://picsum.photos/400/200?random=4' },
];

export const MENU_ITEMS: MenuItem[] = [
  // BukaTeria (v1)
  { id: 'm1', vendorId: 'v1', name: 'Jollof Rice & Chicken', description: 'Classic Nigerian party jollof with grilled chicken.', price: 1500, imageUrl: 'https://picsum.photos/200/200?random=11' },
  { id: 'm2', vendorId: 'v1', name: 'Efo Riro & Semo', description: 'Rich vegetable soup with assorted meat.', price: 1800, imageUrl: 'https://picsum.photos/200/200?random=12' },
  { id: 'm3', vendorId: 'v1', name: 'Amala & Gbegiri', description: 'Abeokuta\'s finest with ewedu and goat meat.', price: 2000, imageUrl: 'https://picsum.photos/200/200?random=13' },
  
  // Chops & Grills (v2)
  { id: 'm4', vendorId: 'v2', name: 'Beef Burger', description: 'Juicy beef patty with cheese, lettuce, and tomatoes.', price: 2500, imageUrl: 'https://picsum.photos/200/200?random=21' },
  { id: 'm5', vendorId: 'v2', name: 'Shawarma Wrap', description: 'Spicy chicken shawarma with fresh veggies.', price: 1800, imageUrl: 'https://picsum.photos/200/200?random=22' },
  { id: 'm6', vendorId: 'v2', name: 'Loaded Fries', description: 'Fries topped with minced meat and cheese sauce.', price: 2200, imageUrl: 'https://picsum.photos/200/200?random=23' },

  // Pizza Palace (v4)
  { id: 'm7', vendorId: 'v4', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese.', price: 4500, imageUrl: 'https://picsum.photos/200/200?random=41' },
  { id: 'm8', vendorId: 'v4', name: 'Chicken BBQ Pizza', description: 'Grilled chicken, onions, and BBQ sauce.', price: 5000, imageUrl: 'https://picsum.photos/200/200?random=42' },
];

export const ORDERS: Order[] = [
    {
        id: 'o1', studentId: 'u1', vendorId: 'v1', riderId: 'r1',
        items: [{ menuItem: MENU_ITEMS[0], quantity: 1 }, { menuItem: MENU_ITEMS[1], quantity: 1 }],
        total: 3300, status: OrderStatus.PREPARING, createdAt: new Date(Date.now() - 10 * 60 * 1000),
        deliveryAddress: 'Akindeko Hall, Room 201'
    },
    {
        id: 'o2', studentId: 'u1', vendorId: 'v2',
        items: [{ menuItem: MENU_ITEMS[4], quantity: 2 }],
        total: 3600, status: OrderStatus.PENDING, createdAt: new Date(Date.now() - 2 * 60 * 1000),
        deliveryAddress: 'Fajuyi Hall, Block 4'
    },
    {
        id: 'o3', studentId: 'u1', vendorId: 'v1',
        items: [{ menuItem: MENU_ITEMS[2], quantity: 1 }],
        total: 2000, status: OrderStatus.READY_FOR_PICKUP, createdAt: new Date(Date.now() - 20 * 60 * 1000),
        deliveryAddress: 'Moremi Hall, Room G-05'
    },
    {
        id: 'o4', studentId: 'u1', vendorId: 'v2', riderId: 'r1',
        items: [{ menuItem: MENU_ITEMS[3], quantity: 1 }],
        total: 2500, status: OrderStatus.OUT_FOR_DELIVERY, createdAt: new Date(Date.now() - 5 * 60 * 1000),
        deliveryAddress: 'Awolowo Hall, Room 112'
    }
];
