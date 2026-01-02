'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, login as loginUser, logout as logoutUser, signup as signupUser, User } from '@/lib/storage';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing user on mount
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const loggedInUser = loginUser(email, password);
            if (loggedInUser) {
                setUser(loggedInUser);
                return { success: true };
            }
            return { success: false, error: 'Invalid email or password' };
        } catch (error) {
            return { success: false, error: 'An error occurred during login' };
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const newUser = signupUser(email, password, name);
            if (newUser) {
                setUser(newUser);
                return { success: true };
            }
            return { success: false, error: 'Email already exists' };
        } catch (error) {
            return { success: false, error: 'An error occurred during signup' };
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
    };
}
