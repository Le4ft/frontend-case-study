import { Seat } from '@/components/Seat.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { useToast } from '@/context/ToastContext.tsx';
import { flyToCart } from '@/lib/flyToCart.ts';
import { cn } from '@/lib/utils.ts';
import { getTicketTypeColor } from '@/lib/seatColors.ts';
import type { EventTickets } from '@/types';
import { Coins, Shuffle, X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';

interface SeatMapProps {
	tickets: EventTickets;
	currencyIso: string;
}

const ZOOM_LEVELS = [24, 28, 32, 40, 48];
const DEFAULT_ZOOM_INDEX = 2;

export const SeatMap: React.FC<SeatMapProps> = ({ tickets, currencyIso }) => {
	const { isInCart, toggleSeat, addSeat } = useCart();
	const { t } = useI18n();
	const { showToast } = useToast();

	const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
	const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());

	const seatSize = ZOOM_LEVELS[zoomIndex];
	const isFiltering = activeTypes.size > 0;

	const toggleTypeFilter = (ticketTypeId: string) => {
		setActiveTypes((prev) => {
			const next = new Set(prev);
			if (next.has(ticketTypeId)) {
				next.delete(ticketTypeId);
			} else {
				next.add(ticketTypeId);
			}
			return next;
		});
	};

	const ticketTypeIds = tickets.ticketTypes.map((ticketType) => ticketType.id);
	const ticketTypeById = new Map(tickets.ticketTypes.map((ticketType) => [ticketType.id, ticketType]));

	const sortedRows = [...tickets.seatRows].sort((a, b) => a.seatRow - b.seatRow);

	const availableSeats = sortedRows
		.flatMap((row) =>
			row.seats
				.filter((seat) => !isInCart(seat.seatId) && ticketTypeById.has(seat.ticketTypeId))
				.map((seat) => ({ seat, seatRow: row.seatRow }))
		)
		.filter(({ seat }) => !isFiltering || activeTypes.has(seat.ticketTypeId));

	const pickSeat = (origin: HTMLElement, pick: () => { seat: EventTickets['seatRows'][number]['seats'][number]; seatRow: number } | undefined) => {
		if (availableSeats.length === 0) {
			showToast(t('toast.noSeatsAvailable'), 'error');
			return;
		}
		const picked = pick();
		if (!picked) return;
		const { seat, seatRow } = picked;
		const ticketType = ticketTypeById.get(seat.ticketTypeId)!;
		flyToCart(origin, getTicketTypeColor(ticketTypeIds, ticketType.id).dot);
		addSeat(seat, ticketType, seatRow);
		showToast(t('toast.seat.added'), 'success');
	};

	const handleRandomSeat = (e: React.MouseEvent<HTMLButtonElement>) => {
		pickSeat(e.currentTarget, () => availableSeats[Math.floor(Math.random() * availableSeats.length)]);
	};

	const handleCheapestSeat = (e: React.MouseEvent<HTMLButtonElement>) => {
		pickSeat(e.currentTarget, () =>
			availableSeats.reduce((cheapest, current) => {
				const cheapestPrice = ticketTypeById.get(cheapest.seat.ticketTypeId)!.price;
				const currentPrice = ticketTypeById.get(current.seat.ticketTypeId)!.price;
				return currentPrice < cheapestPrice ? current : cheapest;
			})
		);
	};

	return (
		<div className="bg-white dark:bg-zinc-900 rounded-xl grow shadow-sm dark:border dark:border-zinc-800 p-4 sm:p-5 self-stretch flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-2 text-xs">
					<span className="font-medium text-zinc-700 dark:text-zinc-300 mr-1">{t('seatmap.legend')}:</span>
					{tickets.ticketTypes.map((ticketType) => {
						const color = getTicketTypeColor(ticketTypeIds, ticketType.id);
						const isActive = activeTypes.has(ticketType.id);
						return (
							<button
								key={ticketType.id}
								type="button"
								onClick={() => toggleTypeFilter(ticketType.id)}
								aria-pressed={isActive}
								className={cn(
									'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-zinc-600 dark:text-zinc-300 transition-all',
									isActive
										? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 ring-2 ring-offset-1 ring-zinc-900 dark:ring-zinc-50 ring-offset-white dark:ring-offset-zinc-900'
										: 'bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800'
								)}
							>
								<span className={`size-2 rounded-full ${color.dot}`} />
								{ticketType.name}
							</button>
						);
					})}
					{isFiltering && (
						<button
							type="button"
							onClick={() => setActiveTypes(new Set())}
							className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
						>
							<X className="size-3.5" />
							{t('seatmap.clearFilter')}
						</button>
					)}
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<button
						type="button"
						onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
						disabled={zoomIndex === 0}
						aria-label={t('seatmap.zoomOut')}
						className="flex items-center justify-center size-7 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
					>
						<ZoomOut className="size-4" />
					</button>
					<button
						type="button"
						onClick={() => setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
						disabled={zoomIndex === ZOOM_LEVELS.length - 1}
						aria-label={t('seatmap.zoomIn')}
						className="flex items-center justify-center size-7 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
					>
						<ZoomIn className="size-4" />
					</button>
				</div>
			</div>

			<div className="flex flex-col items-center gap-1 px-4">
				<div className="h-1.5 w-full max-w-md rounded-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent" />
				<span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
					{t('seatmap.stage')}
				</span>
			</div>

			<div className="scrollbar-thin overflow-x-auto pb-1">
				<div className="flex flex-col gap-2 min-w-fit mx-auto w-fit">
					{sortedRows.map((row) => {
						const seatsByPlace = new Map(row.seats.map((seat) => [seat.place, seat]));
						const maxPlace = Math.max(0, ...row.seats.map((seat) => seat.place));

						return (
							<div key={row.seatRow} className="flex items-center gap-2">
								<span className="w-5 shrink-0 text-xs text-zinc-400 dark:text-zinc-500 font-medium text-right tabular-nums">
									{row.seatRow}
								</span>
								<div className="flex gap-1.5">
									{Array.from({ length: maxPlace }, (_, i) => i + 1).map((place) => {
										const seat = seatsByPlace.get(place);
										if (!seat) {
											return <div key={place} style={{ width: seatSize, height: seatSize }} />;
										}
										const ticketType = ticketTypeById.get(seat.ticketTypeId);
										if (!ticketType) {
											return <div key={place} style={{ width: seatSize, height: seatSize }} />;
										}
										return (
											<Seat
												key={seat.seatId}
												seat={seat}
												seatRow={row.seatRow}
												ticketType={ticketType}
												ticketTypeIds={ticketTypeIds}
												currencyIso={currencyIso}
												isInCart={isInCart(seat.seatId)}
												size={seatSize}
												dimmed={isFiltering && !activeTypes.has(seat.ticketTypeId)}
												onToggle={() => toggleSeat(seat, ticketType, row.seatRow)}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
				<button
					type="button"
					onClick={handleRandomSeat}
					disabled={availableSeats.length === 0}
					className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
				>
					<Shuffle className="size-3.5" />
					{t('seatmap.randomSeat')}
				</button>
				<button
					type="button"
					onClick={handleCheapestSeat}
					disabled={availableSeats.length === 0}
					className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
				>
					<Coins className="size-3.5" />
					{t('seatmap.cheapestSeat')}
				</button>
			</div>
		</div>
	);
};
