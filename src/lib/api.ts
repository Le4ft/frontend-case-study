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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
	}

	return response.json() as Promise<T>;
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
		body: JSON.stringify(order)
	});
}
