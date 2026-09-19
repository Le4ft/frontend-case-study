import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { formatCurrency } from '@/lib/format.ts';
import { cn } from '@/lib/utils.ts';
import { getTicketTypeColor } from '@/lib/seatColors.ts';
import type { Seat as SeatData, TicketType } from '@/types';
import React from 'react';

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	seat: SeatData;
	seatRow: number;
	ticketType: TicketType;
	ticketTypeIds: string[];
	currencyIso: string;
	isInCart: boolean;
	onToggle: () => void;
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
	({ seat, seatRow, ticketType, ticketTypeIds, currencyIso, isInCart, onToggle, className, ...props }, ref) => {
		const { locale, t } = useI18n();
		const color = getTicketTypeColor(ticketTypeIds, ticketType.id);

		return (
			<Popover>
				<PopoverTrigger asChild>
					<div
						className={cn(
							'size-8 rounded-full flex items-center justify-center cursor-pointer transition-colors',
							isInCart
								? 'bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90'
								: `${color.bg} ${color.hover}`,
							className
						)}
						ref={ref}
						{...props}
					>
						<span
							className={cn(
								'text-xs font-medium',
								isInCart ? 'text-white dark:text-zinc-900' : color.text
							)}
						>
							{seat.place}
						</span>
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-64">
					<div className="flex flex-col gap-1 text-sm">
						<div className="flex justify-between">
							<span className="text-zinc-500 dark:text-zinc-400">{t('seatmap.row')}</span>
							<span className="font-medium">{seatRow}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-zinc-500 dark:text-zinc-400">{t('seat.seat')}</span>
							<span className="font-medium">{seat.place}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-zinc-500 dark:text-zinc-400">{ticketType.name}</span>
							<span className="font-medium">{formatCurrency(ticketType.price, currencyIso, locale)}</span>
						</div>
					</div>

					<footer className="flex flex-col mt-3">
						{isInCart ? (
							<Button variant="destructive" size="sm" onClick={onToggle}>
								{t('seat.remove')}
							</Button>
						) : (
							<Button variant="default" size="sm" onClick={onToggle}>
								{t('seat.add')}
							</Button>
						)}
					</footer>
				</PopoverContent>
			</Popover>
		);
	}
);
Seat.displayName = 'Seat';
