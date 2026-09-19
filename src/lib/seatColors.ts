const PALETTE = [
	{
		bg: 'bg-sky-100 dark:bg-sky-950',
		hover: 'hover:bg-sky-200 dark:hover:bg-sky-900',
		text: 'text-sky-700 dark:text-sky-300',
		dot: 'bg-sky-400'
	},
	{
		bg: 'bg-violet-100 dark:bg-violet-950',
		hover: 'hover:bg-violet-200 dark:hover:bg-violet-900',
		text: 'text-violet-700 dark:text-violet-300',
		dot: 'bg-violet-400'
	},
	{
		bg: 'bg-amber-100 dark:bg-amber-950',
		hover: 'hover:bg-amber-200 dark:hover:bg-amber-900',
		text: 'text-amber-700 dark:text-amber-300',
		dot: 'bg-amber-400'
	},
	{
		bg: 'bg-emerald-100 dark:bg-emerald-950',
		hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900',
		text: 'text-emerald-700 dark:text-emerald-300',
		dot: 'bg-emerald-400'
	},
	{
		bg: 'bg-rose-100 dark:bg-rose-950',
		hover: 'hover:bg-rose-200 dark:hover:bg-rose-900',
		text: 'text-rose-700 dark:text-rose-300',
		dot: 'bg-rose-400'
	},
	{
		bg: 'bg-cyan-100 dark:bg-cyan-950',
		hover: 'hover:bg-cyan-200 dark:hover:bg-cyan-900',
		text: 'text-cyan-700 dark:text-cyan-300',
		dot: 'bg-cyan-400'
	}
];

export function getTicketTypeColor(ticketTypeIds: string[], ticketTypeId: string) {
	const index = ticketTypeIds.indexOf(ticketTypeId);
	return PALETTE[index >= 0 ? index % PALETTE.length : 0];
}
