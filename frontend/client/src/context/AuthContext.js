import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { loginUser, logoutUser, signupUser, getCurrentUser } from '../lib/api';
import { toast } from 'react-toastify';
import React from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // On mount, check if user is logged in based on session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const userData = await loginUser(username, password);      
      if (userData) 
        {
        setUser(userData);
        toast.success('Logged in successfully');
        
        // Redirect based on role
        if (userData.role === 'admin') {
          setLocation('/admin');
        } else {
          setLocation('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, password, name, email) => {
    setIsLoading(true);
    try {
      const userData = await signupUser(username, password, name, email);
      
      if (userData) {
        setUser(userData);
        toast.success('Account created successfully');
        setLocation('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success('Logged out successfully');
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
    }
  };

  return React.createElement(
    AuthContext.Provider, 
    { value: { user, isLoading, login, signup, logout } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
