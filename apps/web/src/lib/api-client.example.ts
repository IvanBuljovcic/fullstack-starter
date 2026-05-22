/**
 * Example usage of API client with React Query
 *
 * This file demonstrates common patterns for using the API client
 * with @tanstack/react-query hooks.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFetcher, fetcher, patchFetcher, postFetcher, putFetcher } from "./api-client";

// Example: Type definitions for dummyjson.com API
interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	// Add other fields as needed
}

interface UsersResponse {
	users: User[];
	total: number;
	skip: number;
	limit: number;
}

interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	// Add other fields as needed
}

// ====================
// GET Request Examples
// ====================

/**
 * Fetch all users
 * GET https://dummyjson.com/users
 */
export function useUsers() {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => fetcher<UsersResponse>("/users"),
	});
}

/**
 * Fetch a single user by ID
 * GET https://dummyjson.com/users/1
 */
export function useUser(userId: number) {
	return useQuery({
		queryKey: ["users", userId],
		queryFn: () => fetcher<User>(`/users/${userId}`),
		enabled: !!userId, // Only run if userId is provided
	});
}

/**
 * Fetch products with query parameters
 * GET https://dummyjson.com/products?limit=10&skip=0
 */
export function useProducts(limit = 10, skip = 0) {
	return useQuery({
		queryKey: ["products", { limit, skip }],
		queryFn: () => fetcher<{ products: Product[] }>(`/products?limit=${limit}&skip=${skip}`),
	});
}

// ====================
// POST Request Examples
// ====================

/**
 * Create a new user
 * POST https://dummyjson.com/users/add
 */
export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (newUser: Partial<User>) => postFetcher<User>("/users/add", newUser),
		onSuccess: () => {
			// Invalidate and refetch users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
}

/**
 * Login user
 * POST https://dummyjson.com/auth/login
 */
export function useLogin() {
	return useMutation({
		mutationFn: (credentials: { username: string; password: string }) =>
			postFetcher<{ token: string; id: number }>("/auth/login", credentials),
	});
}

// ====================
// PUT Request Examples
// ====================

/**
 * Update user (full update)
 * PUT https://dummyjson.com/users/1
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => putFetcher<User>(`/users/${id}`, data),
		onSuccess: (data) => {
			// Update the specific user in cache
			queryClient.setQueryData(["users", data.id], data);
			// Invalidate users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
}

// ====================
// PATCH Request Examples
// ====================

/**
 * Update user (partial update)
 * PATCH https://dummyjson.com/users/1
 */
export function usePatchUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => patchFetcher<User>(`/users/${id}`, data),
		onSuccess: (data) => {
			queryClient.setQueryData(["users", data.id], data);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
}

// ====================
// DELETE Request Examples
// ====================

/**
 * Delete user
 * DELETE https://dummyjson.com/users/1
 */
export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: number) => deleteFetcher<User>(`/users/${userId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
}

// ====================
// Usage in Components
// ====================

/*
// Example in a React component:

function UsersPage() {
	const { data, isLoading, error } = useUsers();
	const createUser = useCreateUser();
	const deleteUser = useDeleteUser();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const handleCreateUser = async () => {
		await createUser.mutateAsync({
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			age: 30,
		});
	};

	const handleDeleteUser = async (id: number) => {
		await deleteUser.mutateAsync(id);
	};

	return (
		<div>
			<button onClick={handleCreateUser}>Create User</button>
			{data?.users.map((user) => (
				<div key={user.id}>
					{user.firstName} {user.lastName}
					<button onClick={() => handleDeleteUser(user.id)}>Delete</button>
				</div>
			))}
		</div>
	);
}
*/
