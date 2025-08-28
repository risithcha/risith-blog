'use client';

import { useState } from 'react';
import { signIn } from '../lib/firebase-auth';

// Login form for admin access
// This lets me sign in to access the blog admin panel
export default function LoginForm({ onLoginSuccess }) {
  // Form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Track if we're currently signing in (shows loading state)
  const [isLoading, setIsLoading] = useState(false);
  // Show error messages if login fails
  const [error, setError] = useState('');

  // Handle form submission - attempt to sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try to sign in with Firebase
      await signIn(email, password);
      // If successful, tell the parent component
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input field */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
            required
          />
        </div>
        
        {/* Password input field */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
            required
          />
        </div>
        
        {/* Error message display */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* Submit button - disabled while signing in */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-400 hover:bg-purple-300 disabled:bg-gray-600 text-black px-4 py-2 rounded font-medium"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
