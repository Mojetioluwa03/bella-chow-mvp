
import React, { useState } from 'react';
import type { UserRole } from '../types';
import { UserIcon, StoreIcon, BikeIcon } from '../components/Icons';

interface LoginScreenProps {
  onLogin: (email: string, role: UserRole) => void;
}

const RoleButton: React.FC<{
  role: UserRole;
  label: string;
  icon: React.ReactNode;
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}> = ({ role, label, icon, selectedRole, onSelect }) => (
  <button
    onClick={() => onSelect(role)}
    className={`w-full p-6 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 ${
      selectedRole === role
        ? 'bg-amber-500 border-amber-500 text-white shadow-lg'
        : 'bg-white border-gray-200 text-gray-700 hover:border-amber-400'
    }`}
  >
    {icon}
    <span className="mt-2 font-semibold">{label}</span>
  </button>
);

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(email, selectedRole);
    }
  };

  const getPlaceholderEmail = () => {
      if (!selectedRole) return 'Select a role above';
      return `${selectedRole.toLowerCase()}@bellachow.com`;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-500">BellaChow</h1>
            <p className="text-gray-500 mt-1">Your Campus Food Companion</p>
        </div>

        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Who are you?</h2>
            <div className="grid grid-cols-3 gap-3">
                <RoleButton role="STUDENT" label="Student" icon={<UserIcon className="w-8 h-8"/>} selectedRole={selectedRole} onSelect={setSelectedRole} />
                <RoleButton role="VENDOR" label="Vendor" icon={<StoreIcon className="w-8 h-8"/>} selectedRole={selectedRole} onSelect={setSelectedRole} />
                <RoleButton role="RIDER" label="Rider" icon={<BikeIcon className="w-8 h-8"/>} selectedRole={selectedRole} onSelect={setSelectedRole} />
            </div>
        </div>

        {selectedRole && (
          <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
              Login as a {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
            </h3>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getPlaceholderEmail()}
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Login
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Use placeholder email and any password to log in.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
