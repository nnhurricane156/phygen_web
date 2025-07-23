"use server";

import { z } from "zod";
import { API_ENDPOINTS, USER_ROLES } from "@/lib/api";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .trim(),
});

const registerSchema = z.object({
    userName: z.string()
        .min(1, { message: "Username is required" })
        .regex(/^[a-zA-Z]+$/, { message: "Username must contain only letters (no numbers or special characters)" })
        .trim(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .trim(),
});

export async function loginUserWithToken(prevState: unknown, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
        }
    }

    const { email, password } = result.data;

    try {
        // Call your API to authenticate user
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            // Add timeout and better error handling
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            return {
                error: {
                    email: [data?.message || "Invalid email or password"],
                    password: [data?.message || "Invalid email or password"],
                },
            }
        }

        const data = await response.json();

        if (!data?.accessToken) {
            return {
                error: {
                    email: ["Invalid response from server"],
                    password: ["Invalid response from server"],
                },
            }
        }

        // Return token and user data for client-side storage
        return {
            success: true,
            token: data.accessToken,
            user: {
                id: data.id,
                email: data.email,
                username: data.username || data.userName,
                role: data.role
            },
            redirectTo: getRedirectPath(data.role)
        };

    } catch (error) {
        console.error("Login error:", error);
        
        // Handle different types of errors
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return {
                    error: {
                        email: ["Request timeout. Please try again."],
                        password: ["Request timeout. Please try again."],
                    },
                }
            }
            if (error.message.includes('fetch')) {
                return {
                    error: {
                        email: ["Network error. Please check your connection."],
                        password: ["Network error. Please check your connection."],
                    },
                }
            }
        }
        
        return {
            error: {
                email: ["An unexpected error occurred. Please try again."],
                password: ["An unexpected error occurred. Please try again."],
            },
        }
    }
}

export async function registerUserWithToken(prevState: unknown, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
        }
    }

    const { userName, email, password } = result.data;

    try {
        console.log("Register attempt:", { userName, email, password: "***" });

        // Call your API to register user
        const requestBody = {
            userName: userName,
            email: email,
            password: password
        };

        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Register response status:", response.status);

        const data = await response.json();

        console.log("Register response data:", data);

        if (!response.ok) {
            // Handle validation errors from server
            if (data.errors) {
                const errorObj: Record<string, string[]> = {};

                // Map server errors to form fields
                if (data.errors.userName || data.errors.UserName) {
                    errorObj.userName = data.errors.userName || data.errors.UserName;
                }
                if (data.errors.email || data.errors.Email) {
                    errorObj.email = data.errors.email || data.errors.Email;
                }
                if (data.errors.password || data.errors.Password) {
                    errorObj.password = data.errors.password || data.errors.Password;
                }

                // If we have specific field errors, return them
                if (Object.keys(errorObj).length > 0) {
                    return { error: errorObj };
                }
            }

            // Generic error fallback
            console.log("Register failed:", data.message || data.title);
            return {
                error: {
                    email: [data.message || data.title || "Registration failed. Please try again."],
                    userName: [data.message || data.title || "Registration failed. Please try again."],
                    password: [data.message || data.title || "Registration failed. Please try again."],
                },
            }
        }

        return {
            success: true,
            message: "Registration successful! Please login with your credentials.",
            redirectTo: "/login"
        };

    } catch (error) {
        console.error("Registration error:", error);
        return {
            error: {
                email: ["Network error. Please try again."],
                userName: ["Network error. Please try again."],
                password: ["Network error. Please try again."],
            },
        }
    }
}

function getRedirectPath(role: number): string {
    switch (role) {
        case USER_ROLES.ADMIN:
            return "/admin";
        case USER_ROLES.USER:
            return "/createExam";
        case USER_ROLES.MANAGER:
            return "/manager";
        default:
            return "/manager";
    }
}
