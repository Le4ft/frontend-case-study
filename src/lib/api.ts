import type { EventInfo, EventTickets, LoginResponse, OrderRequest, OrderResponse } from '@/types';

const API_BASE_URL = 'https://nfctron-frontend-seating-case-study-2024.vercel.app';

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RequestOptions extends RequestInit {
	/**
	 * Number of retries for network-level failures (CORS/TLS/DNS hiccups on
	 * the demo API's edge, which we've seen intermittently in practice).
	 * HTTP error responses (4xx/5xx) are never retried since they're real
	 * answers from the server, not transient connectivity issues. Defaults
	 * to 2; pass 0 for non-idempotent requests like order creation.
	 */
	retries?: number;
}

async function request<T>(path: string, { retries = 2, ...init }: RequestOptions = {}): Promise<T> {
	let lastNetworkError: unknown;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await fetch(`${API_BASE_URL}${path}`, {
				...init,
				headers: {
					'Content-Type': 'application/json',
					...init.headers
				}
			});

			if (!response.ok) {
				const body = await response.json().catch(() => null);
				throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
			}

			return (await response.json()) as T;
		} catch (err) {
			if (err instanceof ApiError) throw err;
			lastNetworkError = err;
			if (attempt < retries) {
				await sleep(300 * 2 ** attempt);
			}
		}
	}

	throw lastNetworkError;
}

export function fetchEvent(): Promise<EventInfo> {
	return request<EventInfo>('/event');
}

export function fetchEventTickets(eventId: string): Promise<EventTickets> {
	return request<EventTickets>(`/event-tickets?eventId=${encodeURIComponent(eventId)}`);
}

export function login(email: string, password: string): Promise<LoginResponse> {
	return request<LoginResponse>('/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
}

export function createOrder(order: OrderRequest): Promise<OrderResponse> {
	return request<OrderResponse>('/order', {
		method: 'POST',
		body: JSON.stringify(order),
		// Not retried automatically: a network failure here could mean the
		// order already went through server-side, and re-sending risks a
		// duplicate. The checkout UI already lets the user retry manually.
		retries: 0
	});
}
