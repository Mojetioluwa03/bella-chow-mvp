
import React, { useState, useCallback } from 'react';
import type { User, UserRole } from './types';
import { MOCK_USERS } from './constants';
import LoginScreen from './screens/LoginScreen';
import StudentApp from './screens/StudentApp';
import VendorApp from './screens/VendorApp';
import RiderApp from './screens/RiderApp';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((email: string, role: UserRole) => {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (user) {
      setCurrentUser(user);
    } else {
      // In a real app, you'd show an error message.
      // For this MVP, we'll just log it.
      console.error("Login failed: User not found or role mismatch.");
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderAppForRole = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (currentUser.role) {
      case 'STUDENT':
        return <StudentApp user={currentUser} onLogout={handleLogout} />;
      case 'VENDOR':
        return <VendorApp user={currentUser} onLogout={handleLogout} />;
      case 'RIDER':
        return <RiderApp user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {renderAppForRole()}
      </main>
    </div>
  );
};

export default App;
