
import React, { useState, useMemo } from 'react';
import type { User, Vendor, MenuItem, CartItem, Order } from '../types';
import { VENDORS, MENU_ITEMS } from '../constants';
import { ArrowLeftIcon, LogoutIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '../components/Icons';
import { OrderStatus } from '../types';

type StudentView = 'DASHBOARD' | 'MENU' | 'CART' | 'TRACKING';

interface StudentAppProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<{ title: string; onLogout?: () => void; onBack?: () => void; showCart?: boolean; cartCount?: number; onCartClick?: () => void; user?: User; }> = ({ title, onLogout, onBack, showCart, cartCount, onCartClick, user }) => (
    <div className="sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        {onBack ? <button onClick={onBack}><ArrowLeftIcon className="w-6 h-6 text-gray-700"/></button> : <div className="w-6"></div>}
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
            {showCart && (
                <button onClick={onCartClick} className="relative">
                    <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                </button>
            )}
            {onLogout && <button onClick={onLogout}><LogoutIcon className="w-6 h-6 text-gray-700"/></button>}
            {!onBack && !onLogout && <div className="w-6"></div>}
        </div>
    </div>
);

const StudentApp: React.FC<StudentAppProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<StudentView>('DASHBOARD');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setView('MENU');
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.menuItem.id === item.id);
      if (existingItem) {
        return prevCart.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
          setCart(cart.filter(ci => ci.menuItem.id !== itemId));
      } else {
          setCart(cart.map(ci => ci.menuItem.id === itemId ? { ...ci, quantity: newQuantity } : ci));
      }
  };

  const placeOrder = () => {
      if (cart.length === 0) return;
      const newOrder: Order = {
          id: `o${Date.now()}`,
          studentId: user.id,
          vendorId: selectedVendor!.id,
          items: cart,
          total: cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0) + 300,
          status: OrderStatus.PENDING,
          createdAt: new Date(),
          deliveryAddress: 'Akindeko Hall, Room 201'
      };
      setActiveOrder(newOrder);
      setCart([]);
      setView('TRACKING');
  };

  const cartTotalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const renderDashboard = () => (
    <>
      <Header title="BellaChow" onLogout={onLogout} showCart cartCount={cartTotalItems} onCartClick={() => setView('CART')} user={user} />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello, {user.name}!</h2>
        <p className="text-gray-500 mb-6">What would you like to eat today?</p>
        <div className="space-y-4">
          {VENDORS.map(vendor => (
            <div key={vendor.id} onClick={() => vendor.isOpen && handleSelectVendor(vendor)} className={`rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 ${vendor.isOpen ? 'cursor-pointer' : 'opacity-50'}`}>
              <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-32 object-cover"/>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{vendor.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vendor.isOpen ? 'Open' : 'Closed'}
                    </span>
                </div>
                <p className="text-gray-600 text-sm">{vendor.cuisine}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{vendor.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderMenu = () => {
    const menu = MENU_ITEMS.filter(item => item.vendorId === selectedVendor?.id);
    return (
      <>
        <Header title={selectedVendor!.name} onBack={() => setView('DASHBOARD')} showCart cartCount={cartTotalItems} onCartClick={() => setView('CART')} />
        <div className="p-4 space-y-3">
          {menu.map(item => (
            <div key={item.id} className="flex items-center bg-white p-3 rounded-lg shadow">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover"/>
              <div className="flex-1 ml-4">
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-md font-semibold text-amber-600 mt-1">₦{item.price.toLocaleString()}</p>
              </div>
              <button onClick={() => addToCart(item)} className="bg-amber-100 text-amber-600 rounded-full p-2 hover:bg-amber-200">
                <PlusIcon className="w-5 h-5"/>
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  const renderCart = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const deliveryFee = 300;
    const total = subtotal + deliveryFee;

    return (
        <>
            <Header title="My Cart" onBack={() => cart.length > 0 && selectedVendor ? setView('MENU') : setView('DASHBOARD')} />
            {cart.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Your cart is empty.</div>
            ) : (
                <div className="p-4">
                    <div className="space-y-3 mb-6">
                        {cart.map(cartItem => (
                            <div key={cartItem.menuItem.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                <img src={cartItem.menuItem.imageUrl} alt={cartItem.menuItem.name} className="w-16 h-16 rounded-md object-cover"/>
                                <div className="flex-1 ml-4">
                                    <h4 className="font-semibold text-gray-800">{cartItem.menuItem.name}</h4>
                                    <p className="text-sm font-bold text-amber-600">₦{cartItem.menuItem.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)} className="bg-gray-200 rounded-full p-1"><MinusIcon className="w-4 h-4"/></button>
                                    <span className="font-bold w-6 text-center">{cartItem.quantity}</span>
                                    <button onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)} className="bg-gray-200 rounded-full p-1"><PlusIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                        <div className="flex justify-between text-gray-600"><p>Subtotal</p><p>₦{subtotal.toLocaleString()}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Delivery Fee</p><p>₦{deliveryFee.toLocaleString()}</p></div>
                        <div className="flex justify-between font-bold text-lg text-gray-800"><p>Total</p><p>₦{total.toLocaleString()}</p></div>
                    </div>
                    <button onClick={placeOrder} className="w-full mt-6 bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors">
                        Place Order
                    </button>
                </div>
            )}
        </>
    )
  };

  const renderTracking = () => {
    // In a real app, this would update based on backend events
    const statuses = [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED];
    const currentStatusIndex = activeOrder ? statuses.indexOf(activeOrder.status) : 0;
    
    return (
        <>
            <Header title="Order Tracking" onBack={() => {setActiveOrder(null); setView('DASHBOARD');}} />
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Your order is on its way!</h2>
                <p className="text-gray-500 mb-8">Order ID: #{activeOrder?.id.slice(-6)}</p>
                <div className="flex flex-col items-start space-y-6">
                    {statuses.map((status, index) => (
                        <div key={status} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                ✓
                            </div>
                            <p className={`ml-4 text-lg ${index <= currentStatusIndex ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{status}</p>
                        </div>
                    ))}
                </div>
                 <button onClick={() => { setActiveOrder(null); setView('DASHBOARD'); }} className="w-full mt-10 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors">
                    Back to Dashboard
                </button>
            </div>
        </>
    )
  };

  switch (view) {
    case 'MENU':
      return renderMenu();
    case 'CART':
      return renderCart();
    case 'TRACKING':
      return renderTracking();
    case 'DASHBOARD':
    default:
      return renderDashboard();
  }
};

export default StudentApp;
