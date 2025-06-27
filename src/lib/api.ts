// API base URL
export const API_BASE_URL = "http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api";

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
        LOGOUT: `${API_BASE_URL}/Auth/logout`,
    },
} as const;

// Common API response types
export interface ApiResponse<T = unknown> {
    isSuccess: boolean;
    message: string;
    data: T;
}

export interface LoginResponse {
    accessToken: string;
    id: string;
    email: string;
    username: string;
    role: number;
    identityId: string;
}

export interface RegisterResponse {
    id: string;
    username: string;
    email: string;
    password: string;
    identityId: string;
    isProvider: boolean;
    role: number;
    status: number;
    createdAt: string;
    createdExamSets: null;
    reviewedExamSets: null;
}

// User roles
export const USER_ROLES = {
    ADMIN: 1,
    USER: 2,
    MANAGER: 3,
} as const;

// API helper function
export async function apiCall<T = unknown>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<ApiResponse<T>>;
}
