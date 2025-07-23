"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase-client';
import { tokenStorage, setupTokenExpiry, UserData, jwtUtils } from '@/lib/auth-token';
import { httpClient } from '@/lib/http-client';

interface AuthContextType {
    user: UserData | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (userName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    // Debug auth state changes
    useEffect(() => {
        console.log('🔍 AuthContext: State changed:', {
            isAuthenticated,
            hasUser: !!user,
            hasToken: !!token,
            userRole: user?.role,
            isLoading
        });
    }, [isAuthenticated, user, token, isLoading]);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for existing tokens
                const storedToken = tokenStorage.getToken();
                const storedUser = tokenStorage.getUserData();

                if (storedToken && !jwtUtils.isTokenExpired(storedToken) && storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                    setupTokenExpiry();
                } else {
                    // Clean up expired or invalid tokens
                    tokenStorage.removeToken();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                tokenStorage.removeToken();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = useCallback(async (email: string, password: string) => {
        try {
            console.log('🔐 AuthContext: Starting login request...');
            setIsLoading(true);
            const response = await httpClient.post<{
                isSuccess: boolean;
                message: string;
                data: {
                    accessToken: string;
                    id: string;
                    email: string;
                    username: string;
                    role: number;
                    identityId: string;
                };
            }>('/Auth/login', { email, password });

            console.log('📨 AuthContext: Login response received:', response);

            // Check if login was successful
            if (!response.isSuccess || !response.data) {
                throw new Error(response.message || 'Login failed');
            }

            const { data } = response;

            console.log('📨 AuthContext: Login data extracted:', {
                id: data.id,
                email: data.email,
                username: data.username,
                role: data.role,
                hasToken: !!data.accessToken
            });

            const userData: UserData = {
                id: data.id,
                email: data.email,
                username: data.username,
                role: data.role
            };

            // Store token and user data
            tokenStorage.setToken(data.accessToken);
            tokenStorage.setUserData(userData);

            setToken(data.accessToken);
            setUser(userData);

            console.log('✅ AuthContext: State updated successfully:', {
                userData,
                tokenSet: !!data.accessToken
            });

            // Setup token expiry monitoring
            setupTokenExpiry();
        } catch (error) {
            console.error('❌ AuthContext: Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Login with Google function
    const loginWithGoogle = useCallback(async () => {
        try {
            console.log('🔄 Google login initiated...');
            setIsLoading(true);
            
            // Check if Firebase is properly configured
            if (!auth || !googleProvider) {
                console.error('❌ Firebase not configured:', { auth: !!auth, googleProvider: !!googleProvider });
                throw new Error('Google authentication is not configured. Please check your Firebase environment variables.');
            }
            
            console.log('✅ Firebase configured, starting popup...');
            
            // Use popup for debugging
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            
            console.log('📱 Google popup result:', {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                uid: firebaseUser.uid
            });
            
            // Get Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            console.log('🔑 ID token obtained, length:', idToken.length);
            
            // Send the Firebase ID token to our local API endpoint for verification
            const response = await fetch('/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid, // Send Firebase UID
                    idToken,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                }),
            });

            console.log('📡 API response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API error:', errorData);
                throw new Error(errorData.error || 'Google login failed');
            }

            const data = await response.json();
            console.log('� Google login API response:', data);

            // Handle the response structure (check if it's wrapped in data property)
            const actualData = data.data || data;

            const userData: UserData = {
                id: actualData.id,
                email: actualData.email,
                username: actualData.username || actualData.userName,
                role: actualData.role
            };

            // Store token and user data
            tokenStorage.setToken(actualData.accessToken);
            tokenStorage.setUserData(userData);

            setToken(actualData.accessToken);
            setUser(userData);

            console.log('✅ Google login successful:', userData);

            // Setup token expiry monitoring
            setupTokenExpiry();
            
        } catch (error: any) {
            console.error('❌ Google popup login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);    // Register function
    const register = useCallback(async (userName: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            await httpClient.post('/Auth/register', {
                userName,
                email,
                password
            });
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Sign out from Firebase if available
            if (auth) {
                await firebaseSignOut(auth);
            }
        } catch (error) {
            console.error('Firebase signout error:', error);
        }
        
        // Clear local storage and state
        tokenStorage.removeToken();
        setToken(null);
        setUser(null);
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        try {
            if (!token) return;
            
            // You can implement a user profile endpoint here
            // For now, we'll just validate the token by trying to decode it
            const payload = jwtUtils.decodePayload(token);
            if (!payload) {
                logout();
                return;
            }

            // If you have a user profile endpoint, call it here:
            // const userData = await httpClient.get<UserData>('/auth/profile');
            // setUser(userData);
        } catch (error) {
            console.error('Error refreshing user:', error);
            logout();
        }
    }, [token, logout]);

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
