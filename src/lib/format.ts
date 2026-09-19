export function formatCurrency(amount: number, currencyIso: string, locale: string): string {
	return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyIso }).format(amount);
}

export function formatDateRange(dateFrom: string, dateTo: string, locale: string): string {
	const from = new Date(dateFrom);
	const to = new Date(dateTo);

	const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'short' });

	if (from.toDateString() === to.toDateString()) {
		const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' });
		return `${dateFormatter.format(from)} – ${timeFormatter.format(to)}`;
	}

	return `${dateFormatter.format(from)} – ${dateFormatter.format(to)}`;
}

function toIcsDate(date: Date): string {
	return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildCalendarEvent(event: {
	namePub: string;
	description: string;
	place: string;
	dateFrom: string;
	dateTo: string;
}): string {
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//NFCtron Case Study//EN',
		'BEGIN:VEVENT',
		`UID:${crypto.randomUUID()}`,
		`DTSTAMP:${toIcsDate(new Date())}`,
		`DTSTART:${toIcsDate(new Date(event.dateFrom))}`,
		`DTEND:${toIcsDate(new Date(event.dateTo))}`,
		`SUMMARY:${event.namePub.replace(/\n/g, ' ')}`,
		`DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
		`LOCATION:${event.place.replace(/\n/g, ' ')}`,
		'END:VEVENT',
		'END:VCALENDAR'
	];

	return lines.join('\r\n');
}
