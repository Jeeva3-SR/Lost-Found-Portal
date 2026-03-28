import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (rollNumber, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { rollNumber, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (userData) => {
      try {
          const { data } = await axios.post('/api/auth/register', userData);
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          return data;
      } catch (error) {
          throw error.response?.data?.message || 'Registration failed';
      }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('/api/auth/change-password', { oldPassword, newPassword }, config);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Password update failed';
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
