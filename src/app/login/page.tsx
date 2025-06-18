"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import EyeCloseIcon from "@/components/icons/eye-close.svg";
import EyeIcon from "@/components/icons/eye.svg";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { loginUser } from "@/actions/auth"; // Adjust the import path as necessary
import { stat } from "fs";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [state, loginAction] = useActionState(loginUser, undefined)

    return (
        <div className="flex h-screen bg-white justify-center items-center">
            {/* Centered login form with border */}
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
                                Sign In
                            </h1>
                            <p className="text-sm text-gray-500">
                                Enter your email and password to sign in!
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-center w-full">
                                <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Sign in with Google
                                </button>
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
                            <form action={loginAction}>
                                <div className="space-y-4">
                                    <div>
                                        <Label>
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            name="email"
                                            placeholder="info@gmail.com"
                                            type="email"
                                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
                                        />
                                    </div>
                                    {state?.error?.email && (
                                        <p className="text-red-500">{state.error.email}</p>
                                    )}
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
                                    </div>
                                    {state?.error?.password && (
                                        <p className="text-red-500">{state.error.password}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox checked={isChecked} onChange={setIsChecked} />
                                            <span className="text-sm text-gray-700">
                                                Keep me logged in
                                            </span>
                                        </div>
                                        <Link
                                            href="/reset-password"
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-6">
                                <p className="text-sm text-center text-gray-600">
                                    Don&apos;t have an account? {" "}
                                    <Link
                                        href="/register"
                                        className="text-blue-500 hover:text-blue-700 font-medium"
                                    >
                                        Sign Up
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
