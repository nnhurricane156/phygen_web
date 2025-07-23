"use client";

// Token management utilities for client-side authentication

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export interface UserData {
    id: string;
    email: string;
    username: string;
    role: number;
}

// Token storage functions
export const tokenStorage = {
    // Get token from localStorage
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    // Set token in localStorage
    setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Remove token from localStorage
    removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Get user data from localStorage
    getUserData(): UserData | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    // Set user data in localStorage
    setUserData(userData: UserData): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};

// JWT token utilities
export const jwtUtils = {
    // Decode JWT payload (without verification - for client-side display only)
    decodePayload(token: string): any {
        try {
            const payload = token.split('.')[1];
            // Handle URL-safe base64 encoding
            const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
            // Add padding if needed
            const paddedPayload = normalizedPayload + '='.repeat((4 - normalizedPayload.length % 4) % 4);
            const decoded = atob(paddedPayload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    },

    // Check if token is expired
    isTokenExpired(token: string): boolean {
        try {
            const payload = this.decodePayload(token);
            if (!payload || !payload.exp) return true;
            
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    },

    // Get time until token expires (in seconds)
    getTimeToExpiry(token: string): number {
        try {
            const payload = this.decodePayload(token);
            if (!payload || !payload.exp) return 0;
            
            const currentTime = Date.now() / 1000;
            return Math.max(0, payload.exp - currentTime);
        } catch (error) {
            console.error('Error calculating time to expiry:', error);
            return 0;
        }
    }
};

// Auto-logout when token expires
export const setupTokenExpiry = () => {
    const token = tokenStorage.getToken();
    if (!token) return;

    if (jwtUtils.isTokenExpired(token)) {
        tokenStorage.removeToken();
        window.location.href = '/login';
        return;
    }

    const timeToExpiry = jwtUtils.getTimeToExpiry(token);
    
    // Set timeout to auto-logout when token expires
    setTimeout(() => {
        tokenStorage.removeToken();
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
    }, timeToExpiry * 1000);
};
