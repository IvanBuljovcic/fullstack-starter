/**
 * API Client Configuration for React Query
 *
 * Provides fetcher functions optimized for use with @tanstack/react-query
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
	throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file.");
}

export const apiConfig = {
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
} as const;

/**
 * API Error class for handling API-specific errors
 */
export class APIError extends Error {
	constructor(
		message: string,
		public status?: number,
		public statusText?: string,
		public data?: unknown
	) {
		super(message);
		this.name = "APIError";
	}
}

/**
 * Build a full URL from a path
 */
function buildURL(path: string): string {
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;
	return `${apiConfig.baseURL}/${cleanPath}`;
}

/**
 * Base fetch function with timeout and error handling
 */
async function baseFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const url = buildURL(path);

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				...apiConfig.headers,
				...options?.headers,
			},
			signal: options?.signal || controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new APIError(`API request failed: ${response.statusText}`, response.status, response.statusText, errorData);
		}

		return response.json();
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof APIError) {
			throw error;
		}

		if (error instanceof Error && error.name === "AbortError") {
			throw new APIError("Request timeout", 408, "Request Timeout");
		}

		throw new APIError(error instanceof Error ? error.message : "Unknown error occurred");
	}
}

/**
 * React Query fetcher for GET requests
 * Usage: useQuery({ queryKey: ['users'], queryFn: () => fetcher('/users') })
 */
export async function fetcher<T>(path: string): Promise<T> {
	return baseFetch<T>(path, { method: "GET" });
}

/**
 * React Query fetcher for POST requests
 * Usage: useMutation({ mutationFn: (data) => postFetcher('/users', data) })
 */
export async function postFetcher<T, D = unknown>(path: string, data?: D): Promise<T> {
	return baseFetch<T>(path, {
		method: "POST",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * React Query fetcher for PUT requests
 * Usage: useMutation({ mutationFn: (data) => putFetcher('/users/1', data) })
 */
export async function putFetcher<T, D = unknown>(path: string, data?: D): Promise<T> {
	return baseFetch<T>(path, {
		method: "PUT",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * React Query fetcher for PATCH requests
 * Usage: useMutation({ mutationFn: (data) => patchFetcher('/users/1', data) })
 */
export async function patchFetcher<T, D = unknown>(path: string, data?: D): Promise<T> {
	return baseFetch<T>(path, {
		method: "PATCH",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * React Query fetcher for DELETE requests
 * Usage: useMutation({ mutationFn: (id) => deleteFetcher(`/users/${id}`) })
 */
export async function deleteFetcher<T>(path: string): Promise<T> {
	return baseFetch<T>(path, { method: "DELETE" });
}
