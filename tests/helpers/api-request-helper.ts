import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function apiRequest(
    request: APIRequestContext,
    endpoint: string,
    options: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        body?: any;
        token?: string;
    }
): Promise<APIResponse> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await request.fetch(endpoint, {
        method: options.method,
        data: options.body,
        headers: headers,
    });

    return response;
}

export async function getJsonResponse(response: APIResponse): Promise<any> {
    try {
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to parse JSON response: ${error}`);
    }
}

export async function loginAndGetToken(
    request: APIRequestContext,
    usernameOrRole: string,
    password: string
): Promise<{ accessToken: string; refreshToken?: string; user: { id: number } }> {
    // Backend 'LoginRequestDto' requires 'role'
    const response = await apiRequest(request, '/api/auth/login', {
        method: 'POST',
        body: {
            role: usernameOrRole,
            password: password,
        },
    });

    if (!response.ok()) {
        try {
            const err = await response.json();
            throw new Error(`Login failed with status ${response.status()}: ${JSON.stringify(err)}`);
        } catch {
            throw new Error(`Login failed with status ${response.status()}`);
        }
    }

    const data = await getJsonResponse(response);
    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
    };
}

export async function registerUser(
    request: APIRequestContext,
    email: string, // optional/empty
    password: string,
    name: string,
    role: string // This acts as username/role
): Promise<any> {
    // Backend 'RegisterRequestDto' requires 'role', 'password'. 'email' and 'name' optional.
    const response = await apiRequest(request, '/api/auth/register', {
        method: 'POST',
        body: {
            role: role,
            password: password,
            email: email || undefined,
            name: name,
        },
    });

    // We don't throw here to allow tests to check for 409 (already exists)
    return response;
}

export async function createPanel(
    request: APIRequestContext,
    panelName: string,
    token: string
): Promise<any> {
    // Correct Endpoint: /api/panel (singular)
    // Correct Body: { namePanel: ... }
    const response = await apiRequest(request, '/api/panel', {
        method: 'POST',
        body: {
            namePanel: panelName,
        },
        token: token,
    });

    if (!response.ok()) {
        const error = await response.text();
        throw new Error(`Failed to create panel: ${response.status()} ${error}`);
    }

    return await getJsonResponse(response);
}

export async function deletePanel(
    request: APIRequestContext,
    panelId: number,
    token: string
): Promise<void> {
    // Check if endpoint supports deletion, usually ID is required.
    // Given we don't have explicit confirmation of delete endpoint structure, 
    // we assume RESTful /api/panel/ID or /api/panel with ID body
    // But typically REST is /api/panel/ID
    const response = await apiRequest(request, `/api/panel/${panelId}`, {
        method: 'DELETE',
        token: token,
    });

    // Ignore 404
    if (!response.ok() && response.status() !== 404) {
        console.warn(`Failed to delete panel ${panelId}: ${response.status()}`);
    }
}

export async function deleteElectricityBill(
    request: APIRequestContext,
    billId: number,
    token: string
): Promise<void> {
    const response = await apiRequest(request, `/api/electricity-bills/${billId}`, {
        method: 'DELETE',
        token: token,
    });

    // Ignore 404
    if (!response.ok() && response.status() !== 404) {
        console.warn(`Failed to delete bill ${billId}: ${response.status()}`);
    }
}
