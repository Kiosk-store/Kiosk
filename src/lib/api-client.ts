/**
 * Centralized API Client for Kiosk Backend Integration
 * Connects frontend (kiosk.online) to NestJS Backend (api.kiosk.online / localhost:4000)
 */

import { env } from "./env";

export interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
	statusCode?: number;
}

class ApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = typeof window !== "undefined"
			? "/api/v1"
			: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1");
	}

	private getHeaders(workspaceId?: string): HeadersInit {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		if (workspaceId) {
			headers["X-Workspace-ID"] = workspaceId;
		}

		return headers;
	}

	async get<T>(endpoint: string, workspaceId?: string): Promise<ApiResponse<T>> {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "GET",
				headers: this.getHeaders(workspaceId),
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				return { error: data.message || "An error occurred", statusCode: res.status };
			}
			return { data, statusCode: res.status };
		} catch (err: any) {
			return { error: err.message || "Network request failed" };
		}
	}

	async post<T>(endpoint: string, body: any, workspaceId?: string): Promise<ApiResponse<T>> {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "POST",
				headers: this.getHeaders(workspaceId),
				body: JSON.stringify(body),
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				return { error: data.message || "An error occurred", statusCode: res.status };
			}
			return { data, statusCode: res.status };
		} catch (err: any) {
			return { error: err.message || "Network request failed" };
		}
	}

	async patch<T>(endpoint: string, body: any, workspaceId?: string): Promise<ApiResponse<T>> {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "PATCH",
				headers: this.getHeaders(workspaceId),
				body: JSON.stringify(body),
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				return { error: data.message || "An error occurred", statusCode: res.status };
			}
			return { data, statusCode: res.status };
		} catch (err: any) {
			return { error: err.message || "Network request failed" };
		}
	}

	async delete<T>(endpoint: string, workspaceId?: string): Promise<ApiResponse<T>> {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				method: "DELETE",
				headers: this.getHeaders(workspaceId),
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				return { error: data.message || "An error occurred", statusCode: res.status };
			}
			return { data, statusCode: res.status };
		} catch (err: any) {
			return { error: err.message || "Network request failed" };
		}
	}
}

export const apiClient = new ApiClient();
