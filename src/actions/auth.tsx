"use server";

import { createSession } from "@/lib/session";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { API_ENDPOINTS, USER_ROLES, type ApiResponse, type LoginResponse, type RegisterResponse } from "@/lib/api";

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

export async function loginUser(prevState: unknown, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
        }
    }

    const { email, password } = result.data;

    try {
        // Call the API to authenticate user
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data: ApiResponse<LoginResponse> = await response.json();

        if (!response.ok || !data.isSuccess) {
            return {
                error: {
                    email: [data.message || "Invalid email or password"],
                    password: [data.message || "Invalid email or password"],
                },
            }
        }

        // Create session with user data from API response
        const userData = data.data;
        const isAdmin = userData.role === USER_ROLES.ADMIN;

        await createSession(
            userData.id,
            userData.email,
            userData.username,
            isAdmin,
            userData.accessToken,
            userData.role
        );

        // Return success with redirect path based on role
        let redirectTo = "/manager"; // default

        if (userData.role === USER_ROLES.ADMIN) {
            redirectTo = "/admin";
        } else if (userData.role === USER_ROLES.USER) {
            redirectTo = "/createExam";
        } else if (userData.role === USER_ROLES.MANAGER) {
            redirectTo = "/manager";
        }

        return {
            success: true,
            redirectTo
        };

    } catch (error) {
        console.error("Login error:", error);
        return {
            error: {
                email: ["Network error. Please try again."],
                password: ["Network error. Please try again."],
            },
        }
    }
}



export async function registerUser(prevState: unknown, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
        }
    }

    const { userName, email, password } = result.data;

    try {
        console.log("Register attempt:", { userName, email, password: "***" });

        // Call the API to register user - Server expects UserName (PascalCase)
        const requestBody = {
            UserName: userName,
            Email: email,
            Password: password
        };

        console.log("Request body:", {
            UserName: userName,
            Email: email,
            Password: "***" // Never log real password
        });

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
                const errorObj: any = {};

                // Map server errors to form fields
                if (data.errors.UserName) {
                    errorObj.userName = data.errors.UserName;
                }
                if (data.errors.Email) {
                    errorObj.email = data.errors.Email;
                }
                if (data.errors.Password) {
                    errorObj.password = data.errors.Password;
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

        // Registration successful, return success state
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

export async function logoutUser() {
    await deleteSession();
    redirect("/login");
}

export async function logoutAction() {
    await deleteSession();
    return { success: true };
}