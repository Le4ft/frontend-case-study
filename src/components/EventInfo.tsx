import { Button } from '@/components/ui/button.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { buildCalendarEvent, formatDateRange } from '@/lib/format.ts';
import type { EventInfo as EventInfoData } from '@/types';
import { CalendarPlus } from 'lucide-react';
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
		<aside className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-md shadow-sm p-3 flex flex-col gap-2 self-start">
			<img
				src={event.headerImageUrl}
				alt={event.namePub}
				className="bg-zinc-100 dark:bg-zinc-800 rounded-md h-32 w-full object-cover"
			/>
			<h1 className="text-xl text-zinc-900 dark:text-zinc-50 font-semibold">{event.namePub}</h1>
			<p className="text-sm text-zinc-600 dark:text-zinc-300">{formatDateRange(event.dateFrom, event.dateTo, locale)}</p>
			<p className="text-sm text-zinc-600 dark:text-zinc-300">{event.place}</p>
			<p className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-pre-line">{event.description}</p>
			<Button variant="secondary" onClick={handleAddToCalendar} className="gap-2">
				<CalendarPlus className="size-4" />
				{t('event.addToCalendar')}
			</Button>
		</aside>
	);
};
