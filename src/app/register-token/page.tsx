"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import EyeCloseIcon from "@/components/icons/eye-close.svg";
import EyeIcon from "@/components/icons/eye.svg";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function TokenRegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    
    const { register, isAuthenticated, user } = useAuth();
    const router = useRouter();

    // Fix hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user && isMounted) {
            const redirectPath = getRedirectPath(user.role);
            router.push(redirectPath);
        }
    }, [isAuthenticated, user, router, isMounted]);

    const getRedirectPath = (role: number): string => {
        switch (role) {
            case 1: return "/admin";    // Admin
            case 2: return "/createExam"; // User
            case 3: return "/manager";  // Manager
            default: return "/manager";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const userName = formData.get('userName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Clear previous errors and success message
        setErrors({});
        setSuccessMessage("");
        setIsLoading(true);

        try {
            // Basic validation
            const newErrors: Record<string, string> = {};
            
            if (!userName || !/^[a-zA-Z]+$/.test(userName)) {
                newErrors.userName = 'Username must contain only letters (no numbers or special characters)';
            }
            
            if (!email || !email.includes('@')) {
                newErrors.email = 'Please enter a valid email address';
            }
            
            if (!password || password.length < 1) {
                newErrors.password = 'Password is required';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            await register(userName, email, password);
            
            // Registration successful
            setSuccessMessage("Registration successful! You can now login with your credentials.");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login-token?message=' + encodeURIComponent("Registration successful! Please login with your credentials."));
            }, 2000);
            
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.message || 'Registration failed. Please try again.';
            
            // Handle specific API errors
            if (error.message.includes('email')) {
                setErrors({ email: errorMessage });
            } else if (error.message.includes('username')) {
                setErrors({ userName: errorMessage });
            } else {
                setErrors({
                    email: errorMessage,
                    userName: errorMessage,
                    password: errorMessage
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <div className="flex h-screen bg-white justify-center items-center">
                <div className="flex flex-col w-full max-w-md bg-white px-6 py-8 sm:px-8 rounded-xl shadow-lg border border-gray-200 mx-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white justify-center items-center">
            {/* Centered signup form with border */}
            <div className="flex flex-col w-full max-w-md bg-white px-6 py-8 sm:px-8 rounded-xl shadow-lg border border-gray-200 mx-4">
                <div className="flex flex-col w-full">
                    <div className="w-full">
                        <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </Link>
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                                Sign Up
                            </h1>
                            <p className="text-sm text-gray-500">
                                Enter your email and password to sign up!
                            </p>
                            {successMessage && (
                                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                    {successMessage}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-center w-full">
                                <GoogleLoginButton 
                                    variant="register"
                                    onSuccess={(role) => {
                                        const redirectPath = getRedirectPath(role);
                                        router.push(redirectPath);
                                    }}
                                    onError={(error) => {
                                        setErrors({
                                            email: error,
                                            userName: error,
                                            password: error
                                        });
                                    }}
                                    disabled={isLoading}
                                    className="w-full"
                                />
                            </div>
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 text-gray-500 bg-white">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <Label>
                                            Username <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            name="userName"
                                            placeholder="Enter your username"
                                            type="text"
                                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Only letters allowed (no numbers or special characters)</p>
                                        {errors.userName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            name="email"
                                            placeholder="Enter your email"
                                            type="email"
                                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
                                                disabled={isLoading}
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500" />
                                                )}
                                            </span>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="terms-checkbox"
                                            checked={isChecked}
                                            onChange={setIsChecked}
                                            label={
                                                <span className="text-sm text-gray-700">
                                                    By creating an account means you agree to the <Link href="/terms" className="text-blue-600 font-medium">Terms and Conditions</Link>, and our <Link href="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
                                                </span>
                                            }
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "Creating Account..." : "Sign Up"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-6">
                                <p className="text-sm text-center text-gray-600">
                                    Already have an account? {" "}
                                    <Link
                                        href="/login-token"
                                        className="text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
