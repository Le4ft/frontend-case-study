import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { useToast } from '@/context/ToastContext.tsx';
import { flyToCart } from '@/lib/flyToCart.ts';
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
	size?: number;
	dimmed?: boolean;
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>(
	(
		{
			seat,
			seatRow,
			ticketType,
			ticketTypeIds,
			currencyIso,
			isInCart,
			onToggle,
			size = 32,
			dimmed = false,
			className,
			style,
			...props
		},
		ref
	) => {
		const { locale, t } = useI18n();
		const { showToast } = useToast();
		const color = getTicketTypeColor(ticketTypeIds, ticketType.id);

		const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
			flyToCart(e.currentTarget, color.dot);
			onToggle();
			showToast(t('toast.seat.added'), 'success');
		};

		const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
			flyToCart(e.currentTarget, color.dot, true);
			onToggle();
			showToast(t('toast.seat.removed'), 'info');
		};

		return (
			<Popover>
				<PopoverTrigger asChild>
					<div
						className={cn(
							'rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95',
							dimmed && 'opacity-25 saturate-50',
							isInCart
								? 'bg-zinc-900 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:hover:bg-zinc-50/90 ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-white dark:ring-offset-zinc-900'
								: `${color.bg} ${color.hover}`,
							className
						)}
						style={{ width: size, height: size, ...style }}
						ref={ref}
						{...props}
					>
						<span
							className={cn('font-medium', isInCart ? 'text-white dark:text-zinc-900' : color.text)}
							style={{ fontSize: Math.max(10, Math.round(size * 0.375)) }}
						>
							{seat.place}
						</span>
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-72 p-4 rounded-[25px]">
					<div className="grid grid-cols-2 gap-3 rounded-[12.5px] bg-zinc-100 dark:bg-zinc-800/70 p-3.5">
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

					<div className="flex items-end justify-between gap-3 pt-3">
						<div className="flex flex-col gap-1.5 min-w-0">
							<span className="inline-flex items-center gap-1.5 self-start rounded-full bg-zinc-50 dark:bg-zinc-800/60 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 max-w-full">
								<span className={cn('size-2 rounded-full shrink-0', color.dot)} />
								<span className="truncate">{ticketType.name}</span>
							</span>
							<span className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
								{formatCurrency(ticketType.price, currencyIso, locale)}
							</span>
						</div>

						{isInCart ? (
							<Button
								variant="destructive"
								size="sm"
								className="rounded-[12.5px] px-4 shrink-0"
								onClick={handleRemove}
							>
								{t('seat.remove.short')}
							</Button>
						) : (
							<Button
								variant="default"
								size="sm"
								className="rounded-[12.5px] px-4 shrink-0"
								onClick={handleAdd}
							>
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
