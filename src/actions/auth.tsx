// "use server";
// import { redirect } from "next/navigation";
// import { z } from "zod";
// import { API_ENDPOINTS, USER_ROLES, type ApiResponse, type LoginResponse } from "@/lib/api";
// import { adminAuth } from "@/lib/firebase-admin";

// const loginSchema = z.object({
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z
//         .string()
//         .min(6, { message: "Password must be at least 6 characters long" })
//         .trim(),
// });

// const registerSchema = z.object({
//     userName: z.string()
//         .min(1, { message: "Username is required" })
//         .regex(/^[a-zA-Z]+$/, { message: "Username must contain only letters (no numbers or special characters)" })
//         .trim(),
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z
//         .string()
//         .min(1, { message: "Password is required" })
//         .trim(),
// });

// export async function loginUser(prevState: unknown, formData: FormData) {
//     const result = loginSchema.safeParse(Object.fromEntries(formData))

//     if (!result.success) {
//         return {
//             error: result.error.flatten().fieldErrors,
//         }
//     }

//     const { email, password } = result.data;

//     try {
//         // Call your API to authenticate user
//         const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();

//         if (!response.ok || !data) {
//             return {
//                 error: {
//                     email: [data?.message || "Invalid email or password"],
//                     password: [data?.message || "Invalid email or password"],
//                 },
//             }
//         }

//         // If login successful, create Firebase custom token and session
//         try {
//             // Create Firebase custom token
//             const firebaseToken = await adminAuth.createCustomToken(data.id, {
//                 email: data.email,
//                 username: data.username || data.userName,
//                 role: data.role
//             });

//             // Create session with user data from API response
//             const isAdmin = data.role === USER_ROLES.ADMIN;

//             await createSession({
//                 userId: data.id,
//                 email: data.email,
//                 username: data.username || data.userName,
//                 role: data.role,
//                 identityId: data.identityId || data.id
//             });

//             // Return success with redirect path based on role
//             let redirectTo = "/manager"; // default

//             if (data.role === USER_ROLES.ADMIN) {
//                 redirectTo = "/admin";
//             } else if (data.role === USER_ROLES.USER) {
//                 redirectTo = "/createExam";
//             } else if (data.role === USER_ROLES.MANAGER) {
//                 redirectTo = "/manager";
//             }

//             return {
//                 success: true,
//                 redirectTo
//             };

//         } catch (firebaseError) {
//             console.error("Firebase token creation error:", firebaseError);
//             // Still proceed with login even if Firebase fails
//             const isAdmin = data.role === USER_ROLES.ADMIN;

//             await createSession({
//                 userId: data.id,
//                 email: data.email,
//                 username: data.username || data.userName,
//                 role: data.role,
//                 identityId: data.identityId || data.id
//             });

//             let redirectTo = "/manager";
//             if (data.role === USER_ROLES.ADMIN) {
//                 redirectTo = "/admin";
//             } else if (data.role === USER_ROLES.USER) {
//                 redirectTo = "/createExam";
//             } else if (data.role === USER_ROLES.MANAGER) {
//                 redirectTo = "/manager";
//             }

//             return {
//                 success: true,
//                 redirectTo
//             };
//         }

//     } catch (error) {
//         console.error("Login error:", error);
//         return {
//             error: {
//                 email: ["Network error. Please try again."],
//                 password: ["Network error. Please try again."],
//             },
//         }
//     }
// }



// export async function registerUser(prevState: unknown, formData: FormData) {
//     const result = registerSchema.safeParse(Object.fromEntries(formData))

//     if (!result.success) {
//         return {
//             error: result.error.flatten().fieldErrors,
//         }
//     }

//     const { userName, email, password } = result.data;

//     try {
//         console.log("Register attempt:", { userName, email, password: "***" });

//         // Call your API to register user
//         const requestBody = {
//             userName: userName,
//             email: email,
//             password: password
//         };

//         console.log("Request body:", {
//             userName: userName,
//             email: email,
//             password: "***" // Never log real password
//         });

//         const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody),
//         });

//         console.log("Register response status:", response.status);

//         const data = await response.json();

//         console.log("Register response data:", data);

//         if (!response.ok) {
//             // Handle validation errors from server
//             if (data.errors) {
//                 const errorObj: Record<string, string[]> = {};

//                 // Map server errors to form fields
//                 if (data.errors.userName || data.errors.UserName) {
//                     errorObj.userName = data.errors.userName || data.errors.UserName;
//                 }
//                 if (data.errors.email || data.errors.Email) {
//                     errorObj.email = data.errors.email || data.errors.Email;
//                 }
//                 if (data.errors.password || data.errors.Password) {
//                     errorObj.password = data.errors.password || data.errors.Password;
//                 }

//                 // If we have specific field errors, return them
//                 if (Object.keys(errorObj).length > 0) {
//                     return { error: errorObj };
//                 }
//             }

//             // Generic error fallback
//             console.log("Register failed:", data.message || data.title);
//             return {
//                 error: {
//                     email: [data.message || data.title || "Registration failed. Please try again."],
//                     userName: [data.message || data.title || "Registration failed. Please try again."],
//                     password: [data.message || data.title || "Registration failed. Please try again."],
//                 },
//             }
//         }

//         // Registration successful
//         // Try to create Firebase user as well
//         try {
//             await adminAuth.createUser({
//                 uid: data.id,
//                 email: data.email,
//                 displayName: data.username || data.userName,
//                 emailVerified: false,
//             });
//             console.log("Firebase user created successfully");
//         } catch (firebaseError) {
//             console.error("Firebase user creation failed (but registration was successful):", firebaseError);
//             // Continue with success even if Firebase fails
//         }

//         return {
//             success: true,
//             message: "Registration successful! Please login with your credentials.",
//             redirectTo: "/login"
//         };

//     } catch (error) {
//         console.error("Registration error:", error);
//         return {
//             error: {
//                 email: ["Network error. Please try again."],
//                 userName: ["Network error. Please try again."],
//                 password: ["Network error. Please try again."],
//             },
//         }
//     }
// }

// export async function logoutUser() {
//     await deleteSession();
//     redirect("/login");
// }

// export async function logoutAction() {
//     await deleteSession();
//     return { success: true };
// }