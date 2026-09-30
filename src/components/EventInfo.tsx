import { Button } from '@/components/ui/button.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { useToast } from '@/context/ToastContext.tsx';
import { useCountdown } from '@/hooks/useCountdown.ts';
import { buildCalendarEvent, formatDateRange } from '@/lib/format.ts';
import type { EventInfo as EventInfoData } from '@/types';
import { CalendarPlus, Clock, MapPin, Share2 } from 'lucide-react';
import React from 'react';

interface EventInfoProps {
	event: EventInfoData;
}

export const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
	const { locale, t } = useI18n();
	const { showToast } = useToast();
	const countdown = useCountdown(event.dateFrom, event.dateTo);

	const handleAddToCalendar = () => {
		const ics = buildCalendarEvent(event);
		const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${event.namePub.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
		link.click();
		URL.revokeObjectURL(url);
		showToast(t('toast.calendar.added'), 'success');
	};

	const handleShare = async () => {
		const shareData = { title: event.namePub, text: event.namePub, url: window.location.href };
		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch {
				// user cancelled the native share sheet — nothing to do
			}
			return;
		}
		try {
			await navigator.clipboard.writeText(window.location.href);
			showToast(t('toast.share.copied'), 'success');
		} catch {
			showToast(t('toast.share.failed'), 'error');
		}
	};

	return (
		<aside className="w-full md:max-w-sm h-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm dark:border dark:border-zinc-800 p-4 flex flex-col gap-3">
			<div className="relative -mx-4 -mt-4 mb-1">
				<img
					src={event.headerImageUrl}
					alt={event.namePub}
					className="bg-zinc-100 dark:bg-zinc-800 rounded-t-xl h-36 w-full object-cover"
				/>
				<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-t-xl pointer-events-none" />

				<div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 tabular-nums">
					{countdown.status === 'live' && (
						<>
							<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
							{t('event.countdown.live')}
						</>
					)}
					{countdown.status === 'upcoming' && (
						<>
							{t('event.countdown.startsIn')} {countdown.days}d {countdown.hours}h {countdown.minutes}m{' '}
							{countdown.seconds}s
						</>
					)}
					{countdown.status === 'past' && t('event.countdown.ended')}
				</div>
			</div>

			<h1 className="text-xl text-zinc-900 dark:text-zinc-50 font-semibold leading-tight">{event.namePub}</h1>

			<div className="flex flex-col gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
				<span className="flex items-center gap-2">
					<Clock className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
					{formatDateRange(event.dateFrom, event.dateTo, locale)}
				</span>
				<span className="flex items-center gap-2">
					<MapPin className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
					{event.place}
				</span>
			</div>

			<p className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
				{event.description}
			</p>

			<div className="flex gap-2 mt-auto pt-1">
				<Button variant="secondary" onClick={handleAddToCalendar} className="gap-2 flex-1">
					<CalendarPlus className="size-4" />
					{t('event.addToCalendar')}
				</Button>
				<Button variant="secondary" size="icon" onClick={handleShare} aria-label={t('event.share')}>
					<Share2 className="size-4" />
				</Button>
			</div>
		</aside>
	);
};
