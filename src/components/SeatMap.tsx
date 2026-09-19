import { Seat } from '@/components/Seat.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { getTicketTypeColor } from '@/lib/seatColors.ts';
import type { EventTickets } from '@/types';
import React from 'react';

interface SeatMapProps {
	tickets: EventTickets;
	currencyIso: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({ tickets, currencyIso }) => {
	const { isInCart, toggleSeat } = useCart();
	const { t } = useI18n();

	const ticketTypeIds = tickets.ticketTypes.map((ticketType) => ticketType.id);
	const ticketTypeById = new Map(tickets.ticketTypes.map((ticketType) => [ticketType.id, ticketType]));

	const sortedRows = [...tickets.seatRows].sort((a, b) => a.seatRow - b.seatRow);

	return (
		<div className="bg-white rounded-md grow shadow-sm p-3 self-stretch flex flex-col gap-4 overflow-x-auto">
			<div className="flex flex-wrap gap-3 text-xs text-zinc-500 pb-2 border-b border-zinc-100">
				<span className="font-medium text-zinc-700">{t('seatmap.legend')}:</span>
				{tickets.ticketTypes.map((ticketType) => {
					const color = getTicketTypeColor(ticketTypeIds, ticketType.id);
					return (
						<span key={ticketType.id} className="flex items-center gap-1.5">
							<span className={`size-2.5 rounded-full ${color.dot}`} />
							{ticketType.name}
						</span>
					);
				})}
			</div>

			<div className="flex flex-col gap-2 min-w-fit">
				{sortedRows.map((row) => {
					const seatsByPlace = new Map(row.seats.map((seat) => [seat.place, seat]));
					const maxPlace = Math.max(0, ...row.seats.map((seat) => seat.place));

					return (
						<div key={row.seatRow} className="flex items-center gap-2">
							<span className="w-8 shrink-0 text-xs text-zinc-400 font-medium text-right">{row.seatRow}</span>
							<div className="flex gap-1.5">
								{Array.from({ length: maxPlace }, (_, i) => i + 1).map((place) => {
									const seat = seatsByPlace.get(place);
									if (!seat) {
										return <div key={place} className="size-8" />;
									}
									const ticketType = ticketTypeById.get(seat.ticketTypeId);
									if (!ticketType) {
										return <div key={place} className="size-8" />;
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
	);
};
