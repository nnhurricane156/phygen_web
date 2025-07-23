"use client";

import { tokenStorage } from './auth-token';

// HTTP client with automatic token attachment
export class AuthenticatedHttpClient {
    private baseURL: string;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api") {
        this.baseURL = baseURL;
    }

    // Get default headers with authorization token
    private getHeaders(customHeaders: HeadersInit = {}): HeadersInit {
        const token = tokenStorage.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Handle response and check for auth errors
    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            // Token is invalid or expired
            tokenStorage.removeToken();
            
            // Only redirect if we're in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Unauthorized: Please login again');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // GET request
    async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(headers),
        });

        return this.handleResponse<T>(response);
    }

    // POST request
    async post<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(headers),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    // PUT request
    async put<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(headers),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    // DELETE request
    async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(headers),
        });

        return this.handleResponse<T>(response);
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: any, headers?: HeadersInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(headers),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }
}

// Create a default instance
export const httpClient = new AuthenticatedHttpClient();

// Utility function for making authenticated requests
export const makeAuthenticatedRequest = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = tokenStorage.getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        tokenStorage.removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};
