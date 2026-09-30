import { Button } from '@/components/ui/button.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { buildCalendarEvent, formatDateRange } from '@/lib/format.ts';
import type { EventInfo as EventInfoData } from '@/types';
import { CalendarPlus, Clock, MapPin } from 'lucide-react';
import React from 'react';

interface EventInfoProps {
	event: EventInfoData;
}

export const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
	const { locale, t } = useI18n();

	const handleAddToCalendar = () => {
		const ics = buildCalendarEvent(event);
		const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${event.namePub.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<aside className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-sm dark:border dark:border-zinc-800 p-4 flex flex-col gap-3 self-start">
			<div className="relative -mx-4 -mt-4 mb-1">
				<img
					src={event.headerImageUrl}
					alt={event.namePub}
					className="bg-zinc-100 dark:bg-zinc-800 rounded-t-xl h-36 w-full object-cover"
				/>
				<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent rounded-t-xl pointer-events-none" />
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

			<Button variant="secondary" onClick={handleAddToCalendar} className="gap-2 mt-1">
				<CalendarPlus className="size-4" />
				{t('event.addToCalendar')}
			</Button>
		</aside>
	);
};
