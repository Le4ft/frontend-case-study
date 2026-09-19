const PALETTE = [
	{ bg: 'bg-sky-100', hover: 'hover:bg-sky-200', text: 'text-sky-700', dot: 'bg-sky-400' },
	{ bg: 'bg-violet-100', hover: 'hover:bg-violet-200', text: 'text-violet-700', dot: 'bg-violet-400' },
	{ bg: 'bg-amber-100', hover: 'hover:bg-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
	{ bg: 'bg-emerald-100', hover: 'hover:bg-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' },
	{ bg: 'bg-rose-100', hover: 'hover:bg-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' },
	{ bg: 'bg-cyan-100', hover: 'hover:bg-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-400' }
];

export function getTicketTypeColor(ticketTypeIds: string[], ticketTypeId: string) {
	const index = ticketTypeIds.indexOf(ticketTypeId);
	return PALETTE[index >= 0 ? index % PALETTE.length : 0];
}
