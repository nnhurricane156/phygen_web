"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/lib/api';
import { auth, googleProvider } from '@/lib/firebase-client';

interface GoogleLoginButtonProps {
    onSuccess?: (role: number) => void;
    onError?: (error: string) => void;
    className?: string;
    disabled?: boolean;
    variant?: 'login' | 'register';
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    onSuccess,
    onError,
    className = "",
    disabled = false,
    variant = 'login'
}) => {
    const { loginWithGoogle, isLoading } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Check if Firebase is configured
    const isFirebaseConfigured = !!(auth && googleProvider);

    const handleGoogleLogin = async () => {
        console.log('🔘 Google login button clicked');
        
        if (disabled || isLoading || isGoogleLoading) {
            console.log('🔘 Button disabled, skipping:', { disabled, isLoading, isGoogleLoading });
            return;
        }

        if (!isFirebaseConfigured) {
            console.error('🔘 Firebase not configured');
            const errorMessage = 'Google authentication is not configured. Please add Firebase credentials to environment variables.';
            if (onError) {
                onError(errorMessage);
            }
            return;
        }

        try {
            setIsGoogleLoading(true);
            console.log('🔄 Initiating Google popup login...');
            await loginWithGoogle();
            
            console.log('✅ Google login completed successfully');
            
            // If success callback is provided, call it
            if (onSuccess) {
                // You might want to get the user role from the auth context
                onSuccess(USER_ROLES.USER); // Default role, adjust as needed
            }
            
        } catch (error: any) {
            console.error('❌ Google login failed:', error);
            const errorMessage = error?.message || 'Google login failed. Please try again.';
            
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (!isFirebaseConfigured) {
        return (
            <div className={`
                flex items-center justify-center w-full px-4 py-2.5 
                border border-gray-300 rounded-lg shadow-sm bg-gray-100 
                text-sm font-medium text-gray-500 cursor-not-allowed
                ${className}
            `}>
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 opacity-50" viewBox="0 0 24 24">
                        <path fill="#9CA3AF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#9CA3AF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#9CA3AF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#9CA3AF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google auth not configured
                </div>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => {
                console.log('🔘 Google button clicked!');
                handleGoogleLogin();
            }}
            disabled={disabled || isLoading || isGoogleLoading}
            className={`
                cursor-pointer flex items-center justify-center w-full px-4 py-2.5 
                border border-gray-300 rounded-lg shadow-sm bg-white 
                text-sm font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-primary 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${className}
            `}
        >
            {(isLoading || isGoogleLoading) ? (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in with Google...
                </div>
            ) : (
                <div className="flex items-center">
                    {/* Google Logo SVG */}
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {variant === 'register' ? 'Sign up with Google' : 'Continue with Google'}
                </div>
            )}
        </button>
    );
};
