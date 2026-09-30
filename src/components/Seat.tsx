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
							'size-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95',
							isInCart
								? 'bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-white dark:ring-offset-zinc-900'
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
				<PopoverContent className="w-72 p-3">
					<div className="grid grid-cols-2 gap-3 rounded-md bg-zinc-100 dark:bg-zinc-800/70 p-3.5">
						<div className="flex flex-col gap-0.5">
							<span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								{t('seatmap.row')}
							</span>
							<span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{seatRow}</span>
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
								{t('seat.seat')}
							</span>
							<span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{seat.place}</span>
						</div>
					</div>

					<div className="flex items-end justify-between gap-3 px-1 pt-3">
						<div className="flex flex-col gap-1.5 min-w-0">
							<span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
								<span className={cn('size-2 rounded-full shrink-0', color.dot)} />
								<span className="truncate">{ticketType.name}</span>
							</span>
							<span className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
								{formatCurrency(ticketType.price, currencyIso, locale)}
							</span>
						</div>

						{isInCart ? (
							<Button variant="destructive" className="rounded-full px-5 shrink-0" onClick={onToggle}>
								{t('seat.remove.short')}
							</Button>
						) : (
							<Button variant="default" className="rounded-full px-6 shrink-0" onClick={onToggle}>
								{t('seat.add.short')}
							</Button>
						)}
					</div>
				</PopoverContent>
			</Popover>
		);
	}
);
Seat.displayName = 'Seat';
