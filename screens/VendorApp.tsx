
import React, { useState, useEffect } from 'react';
import type { User, Order } from '../types';
import { OrderStatus } from '../types';
import { ORDERS, VENDORS, MOCK_USERS } from '../constants';
import { LogoutIcon, ClockIcon } from '../components/Icons';

interface VendorAppProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<{ title: string; onLogout: () => void; isOpen: boolean; onToggleOpen: () => void; }> = ({ title, onLogout, isOpen, onToggleOpen }) => (
    <div className="sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
            <label htmlFor="status-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="status-toggle" className="sr-only" checked={isOpen} onChange={onToggleOpen} />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isOpen ? 'transform translate-x-full bg-green-400' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">{isOpen ? 'Open' : 'Closed'}</div>
            </label>
            <button onClick={onLogout}><LogoutIcon className="w-6 h-6 text-gray-700"/></button>
        </div>
    </div>
);

type Tab = OrderStatus.PENDING | OrderStatus.PREPARING | OrderStatus.READY_FOR_PICKUP;

const OrderCard: React.FC<{ order: Order; onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void; }> = ({ order, onUpdateStatus }) => {
    const student = MOCK_USERS.find(u => u.id === order.studentId);
    
    const renderAction = () => {
        switch (order.status) {
            case OrderStatus.PENDING:
                return <button onClick={() => onUpdateStatus(order.id, OrderStatus.PREPARING)} className="w-full bg-green-500 text-white font-bold py-2 rounded-lg mt-2">Accept Order</button>;
            case OrderStatus.PREPARING:
                return <button onClick={() => onUpdateStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg mt-2">Mark as Ready</button>;
            default:
                return null;
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h4 className="font-bold">Order #{order.id.slice(-4)}</h4>
                <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1"/>
                    <span>{order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">For: <span className="font-semibold">{student?.name || 'Customer'}</span></p>
            <ul className="text-sm space-y-1">
                {order.items.map(item => (
                    <li key={item.menuItem.id} className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>₦{(item.menuItem.price * item.quantity).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
            <p className="text-right font-bold mt-2 border-t pt-2">Total: ₦{order.total.toLocaleString()}</p>
            {renderAction()}
        </div>
    );
}

const VendorApp: React.FC<VendorAppProps> = ({ user, onLogout }) => {
  const vendorInfo = VENDORS.find(v => v.id === user.id);
  const [isOpen, setIsOpen] = useState(vendorInfo?.isOpen || false);
  const [orders, setOrders] = useState<Order[]>(ORDERS.filter(o => o.vendorId === user.id));
  const [activeTab, setActiveTab] = useState<Tab>(OrderStatus.PENDING);
  
  useEffect(() => {
    // Simulate real-time order updates
    const interval = setInterval(() => {
        // This is a mock; in reality, you'd use WebSockets or polling
    }, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };
  
  const filteredOrders = orders.filter(o => o.status === activeTab);

  const tabs: { status: Tab; label: string }[] = [
    { status: OrderStatus.PENDING, label: 'New' },
    { status: OrderStatus.PREPARING, label: 'Preparing' },
    { status: OrderStatus.READY_FOR_PICKUP, label: 'Ready' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header title={vendorInfo?.name || 'Vendor Dashboard'} onLogout={onLogout} isOpen={isOpen} onToggleOpen={() => setIsOpen(!isOpen)} />
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-around" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.status
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({orders.filter(o => o.status === tab.status).length})
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
            ))
        ) : (
            <div className="text-center text-gray-500 pt-16">
                <p>No orders in this category.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VendorApp;
