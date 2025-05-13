import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define authorized email
const AUTHORIZED_EMAIL = 'jchezik@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is authorized
        if (user.email === AUTHORIZED_EMAIL) {
          console.log("Authorized user authenticated:", user.email);
          setCurrentUser(user);
          setIsAuthorized(true);
        } else {
          console.log("Unauthorized user attempted access:", user.email);
          // Sign out unauthorized users
          signOut(auth).then(() => {
            console.log('Unauthorized user signed out');
            setCurrentUser(null);
            setIsAuthorized(false);
          }).catch((error) => {
            console.error('Error signing out unauthorized user:', error);
          });
        }
      } else {
        console.log("No user authenticated");
        setCurrentUser(null);
        setIsAuthorized(false);
      }
      
      setLoading(false);
    });
    
    // Clean up subscription
    return unsubscribe;
  }, []);
  
  // Context value
  const value = {
    currentUser,
    loading,
    isAuthorized
  };
  
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        // Show loading indicator while checking auth state
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 