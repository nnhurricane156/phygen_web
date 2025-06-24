"use server";

import { createSession } from "@/lib/session";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const testUser = {
    id: "1",
    email: "admin@gmail.com",
    name: "Admin User",
    password: "password",
    isAdmin: true,
}

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
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

    if (email !== testUser.email && password !== "password") {
        return {
            error: {
                email: ["Invalid email or password"],
            },
        }
    }

    await createSession(testUser.id, testUser.email, testUser.name, testUser.isAdmin);

    redirect("/admin");
}



export async function registerUser() { }

export async function logoutUser() {
    await deleteSession();
    redirect("/");
}