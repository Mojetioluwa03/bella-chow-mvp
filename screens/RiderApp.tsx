
import React, { useState, useEffect } from 'react';
import type { User, Order } from '../types';
import { OrderStatus } from '../types';
import { ORDERS, VENDORS, MOCK_USERS } from '../constants';
import { LogoutIcon, BikeIcon } from '../components/Icons';

interface RiderAppProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<{ title: string; onLogout: () => void; }> = ({ title, onLogout }) => (
    <div className="sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <button onClick={onLogout}><LogoutIcon className="w-6 h-6 text-gray-700"/></button>
    </div>
);

type Tab = 'AVAILABLE' | 'DELIVERING';

const DeliveryCard: React.FC<{ order: Order; onUpdateStatus: (orderId: string, newStatus: OrderStatus, riderId?: string) => void; isDelivering?: boolean; }> = ({ order, onUpdateStatus, isDelivering }) => {
    const vendor = VENDORS.find(v => v.id === order.vendorId);
    const student = MOCK_USERS.find(u => u.id === order.studentId);
    const deliveryFee = 300; // Mock fee

    const handleAccept = () => {
        onUpdateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY, MOCK_USERS.find(u => u.role === 'RIDER')?.id);
    }
    
    const handleDeliver = () => {
        onUpdateStatus(order.id, OrderStatus.DELIVERED);
    }
    
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start border-b pb-2 mb-2">
                <div>
                    <h4 className="font-bold">Delivery for {vendor?.name}</h4>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(-4)}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-green-600">₦{deliveryFee}</p>
                    <p className="text-xs text-gray-400">Earning</p>
                </div>
            </div>
            <div className="text-sm space-y-2 my-3">
                <p><span className="font-semibold">FROM:</span> {vendor?.name}</p>
                <p><span className="font-semibold">TO:</span> {order.deliveryAddress}</p>
                <p><span className="font-semibold">CUSTOMER:</span> {student?.name}</p>
            </div>
            {isDelivering ? (
                <button onClick={handleDeliver} className="w-full bg-green-500 text-white font-bold py-2 rounded-lg mt-2">Mark as Delivered</button>
            ) : (
                <button onClick={handleAccept} className="w-full bg-amber-500 text-white font-bold py-2 rounded-lg mt-2">Accept Delivery</button>
            )}
        </div>
    );
};

const RiderApp: React.FC<RiderAppProps> = ({ user, onLogout }) => {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [activeTab, setActiveTab] = useState<Tab>('AVAILABLE');
  
  useEffect(() => {
    // Simulate real-time order updates
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, riderId?: string) => {
    setOrders(prevOrders => prevOrders.map(o => {
        if (o.id === orderId) {
            return { ...o, status: newStatus, riderId: riderId || o.riderId };
        }
        return o;
    }));
  };
  
  const availableDeliveries = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP);
  const myDeliveries = orders.filter(o => o.riderId === user.id && o.status === OrderStatus.OUT_FOR_DELIVERY);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'AVAILABLE', label: 'Available' },
    { id: 'DELIVERING', label: 'My Deliveries' },
  ];

  const renderContent = () => {
      const list = activeTab === 'AVAILABLE' ? availableDeliveries : myDeliveries;
      if (list.length === 0) {
          return (
              <div className="text-center text-gray-500 pt-16">
                  <BikeIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                  <p>No deliveries here right now.</p>
              </div>
          );
      }
      return list.map(order => (
          <DeliveryCard 
            key={order.id} 
            order={order} 
            onUpdateStatus={updateOrderStatus}
            isDelivering={activeTab === 'DELIVERING'}
          />
      ));
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Rider Dashboard" onLogout={onLogout} />
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-around" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.id === 'AVAILABLE' ? availableDeliveries.length : myDeliveries.length})
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default RiderApp;
