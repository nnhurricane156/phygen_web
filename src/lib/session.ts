import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set');
}
const encodedKey = new TextEncoder().encode(secretKey)


export async function createSession(userId: string, email: string, name?: string, isAdmin?: boolean, accessToken?: string, role?: number) {
    const sessionPayload: SessionPayload = {
        userId,
        email,
        name,
        isAdmin,
        accessToken,
        role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
    const session = await encrypt(sessionPayload)

    const cookieStore = await cookies()

    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: sessionPayload.expiresAt,
        sameSite: 'strict',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete("session")
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) return null

    return await decrypt(session)
}

type SessionPayload = {
    userId: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
    accessToken?: string;
    role?: number;
    expiresAt?: Date;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        if (!session || session === '') {
            return null;
        }

        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session:', error);
        return null;
    }
}