export interface EventInfo {
	eventId: string;
	namePub: string;
	description: string;
	currencyIso: string;
	dateFrom: string;
	dateTo: string;
	headerImageUrl: string;
	place: string;
}

export interface TicketType {
	id: string;
	name: string;
	price: number;
}

export interface Seat {
	seatId: string;
	place: number;
	ticketTypeId: string;
}

export interface SeatRow {
	seatRow: number;
	seats: Seat[];
}

export interface EventTickets {
	ticketTypes: TicketType[];
	seatRows: SeatRow[];
}

export interface User {
	firstName: string;
	lastName: string;
	email: string;
}

export interface LoginResponse {
	message: string;
	user: User;
}

export interface CartItem {
	seat: Seat;
	ticketType: TicketType;
	seatRow: number;
}

export interface OrderTicket {
	ticketTypeId: string;
	seatId: string;
}

export interface OrderRequest {
	eventId: string;
	tickets: OrderTicket[];
	user: {
		email: string;
		firstName: string;
		lastName: string;
	};
}

export interface OrderResponse {
	message: string;
	orderId: string;
	tickets: OrderTicket[];
	user: User;
	totalAmount: number;
}
