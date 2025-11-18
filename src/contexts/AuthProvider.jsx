// authProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { authAPI } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      const storedUser = localStorage.getItem('user');
      if (storedUser) 
      {
        try 
        {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              setLoading(false); // Stop loading immediately if we have stored user
          
            // Optional: Verify token is still valid in background
              try 
              {
                const currentUser = await authAPI.getCurrentUser();
                setUser(currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser));
              } 
              catch (error) 
              {
                // Token might be expired, but don't clear if we just logged in
                console.error('Error verifying user:', error);
              }
              return;
        } 
        catch (error) 
        {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }

      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        console.error('Error fetching current user:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuth]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
