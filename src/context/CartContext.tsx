import type { CartItem, Seat, TicketType } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface CartContextValue {
	items: Map<string, CartItem>;
	totalCount: number;
	totalAmount: number;
	isInCart: (seatId: string) => boolean;
	addSeat: (seat: Seat, ticketType: TicketType, seatRow: number) => void;
	removeSeat: (seatId: string) => void;
	toggleSeat: (seat: Seat, ticketType: TicketType, seatRow: number) => void;
	clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<Map<string, CartItem>>(new Map());

	const addSeat = useCallback((seat: Seat, ticketType: TicketType, seatRow: number) => {
		setItems((prev) => {
			const next = new Map(prev);
			next.set(seat.seatId, { seat, ticketType, seatRow });
			return next;
		});
	}, []);

	const removeSeat = useCallback((seatId: string) => {
		setItems((prev) => {
			if (!prev.has(seatId)) return prev;
			const next = new Map(prev);
			next.delete(seatId);
			return next;
		});
	}, []);

	const toggleSeat = useCallback((seat: Seat, ticketType: TicketType, seatRow: number) => {
		setItems((prev) => {
			const next = new Map(prev);
			if (next.has(seat.seatId)) {
				next.delete(seat.seatId);
			} else {
				next.set(seat.seatId, { seat, ticketType, seatRow });
			}
			return next;
		});
	}, []);

	const clear = useCallback(() => setItems(new Map()), []);

	const isInCart = useCallback((seatId: string) => items.has(seatId), [items]);

	const totalCount = items.size;
	const totalAmount = useMemo(
		() => Array.from(items.values()).reduce((sum, item) => sum + item.ticketType.price, 0),
		[items]
	);

	const value = useMemo(
		() => ({ items, totalCount, totalAmount, isInCart, addSeat, removeSeat, toggleSeat, clear }),
		[items, totalCount, totalAmount, isInCart, addSeat, removeSeat, toggleSeat, clear]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within CartProvider');
	}
	return context;
}
