'use client';

import { useState } from 'react';
import BlogAdmin from '../../components/BlogAdmin';
import LoginForm from '../../components/LoginForm';
import Navigation from '../../components/Navigation';
import { AuthProvider, useAuth } from '../../components/AuthContext';
import { logOut } from '../../lib/firebase-auth';

function AdminContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold mb-8 text-center">Blog Control</h1>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Control</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome Risith</span>
            <button
              onClick={handleLogout}
              className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        <BlogAdmin />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}
