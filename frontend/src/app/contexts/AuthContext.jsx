"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { auth } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const { data } = await auth.getProfile();
          setUser(data);
        } catch (error) {
          console.error('Auth token invalid', error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await auth.login(credentials);
      // Extract token from the nested `data` object
      const token = data.data.token;
      console.log('Token from login response:', token); // Debugging
  
      // Set the token in the cookie
      Cookies.set('token', token, { 
        expires: 7, // Expires in 7 days
        sameSite: 'lax', // Allow cookies to be sent with same-site requests
        secure: true, // Set to true if using HTTPS
      });
  
      // Fetch the user profile using the token
      const profileResp = await auth.getProfile();
      setUser(profileResp.data.data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await auth.register(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isAdmin, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;