'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChange } from '../lib/firebase-auth';

// Manage auth state across the app
// Allows for passing auth data through props everywhere
const AuthContext = createContext();

// Wraps the app and keeps track of who's logged in. Listens to Firebase for auth changes and updates the app state accordingly.
export function AuthProvider({ children }) {
  // Keep track of the current user (null = not logged in)
  const [user, setUser] = useState(null);
  
  // Loading state - prevents showing login form while Firebase is still checking
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth changes
  useEffect(() => {
    // Set up the listener for when users sign in/out
    const unsubscribe = onAuthStateChange((user) => {
      // Update our user state with whatever Firebase tells us
      setUser(user);
      // Done loading now
      setLoading(false);
    });

    // Clean up the listener when component unmounts (prevents memory leaks)
    return () => unsubscribe();
  }, []); // Only run this once when component mounts

  // The data we want to share with all child components
  const value = {
    user,                    // Current user (or null if not logged in)
    loading,                 // Still loading the auth state?
    isAuthenticated: !!user  // Quick way to check if someone's logged in
  };

  // Wrap children with our auth context
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Just call this hook and you'll get all the auth info you need.
export function useAuth() {
  // Get the auth context
  const context = useContext(AuthContext);
  // Make sure we're actually inside an AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
