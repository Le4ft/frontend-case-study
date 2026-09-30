import { fetchEvent, fetchEventTickets } from '@/lib/api.ts';
import type { EventInfo, EventTickets } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface EventDataState {
	event: EventInfo | null;
	tickets: EventTickets | null;
	isLoading: boolean;
	error: string | null;
}

interface UseEventDataResult extends EventDataState {
	refetch: () => void;
}

export function useEventData(): UseEventDataResult {
	const [state, setState] = useState<EventDataState>({
		event: null,
		tickets: null,
		isLoading: true,
		error: null
	});
	const [retryToken, setRetryToken] = useState(0);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));
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
	}, [retryToken]);

	const refetch = useCallback(() => setRetryToken((prev) => prev + 1), []);

	return { ...state, refetch };
}
