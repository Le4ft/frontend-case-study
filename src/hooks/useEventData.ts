import { fetchEvent, fetchEventTickets } from '@/lib/api.ts';
import type { EventInfo, EventTickets } from '@/types';
import { useEffect, useState } from 'react';

interface EventDataState {
	event: EventInfo | null;
	tickets: EventTickets | null;
	isLoading: boolean;
	error: string | null;
}

export function useEventData(): EventDataState {
	const [state, setState] = useState<EventDataState>({
		event: null,
		tickets: null,
		isLoading: true,
		error: null
	});

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const event = await fetchEvent();
				const tickets = await fetchEventTickets(event.eventId);
				if (!cancelled) {
					setState({ event, tickets, isLoading: false, error: null });
				}
			} catch (err) {
				if (!cancelled) {
					setState({
						event: null,
						tickets: null,
						isLoading: false,
						error: err instanceof Error ? err.message : 'Unknown error'
					});
				}
			}
		}

		load();

		return () => {
			cancelled = true;
		};
	}, []);

	return state;
}
