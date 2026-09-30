import { fetchEvent, fetchEventTickets } from '@/lib/api.ts';
import type { EventInfo, EventTickets } from '@/types';
import { useCallback, useEffect, useState } from 'react';

/**
 * The demo API always returns a fixed 2025-06-01 date for this event, which
 * is in the past by now. Override it to a near-future date so the countdown
 * on the event card actually has something to count down to instead of
 * permanently showing "event has ended".
 */
function withDemoDate(event: EventInfo): EventInfo {
	return { ...event, dateFrom: '2026-12-01T12:00:00.000Z', dateTo: '2026-12-01T18:00:00.000Z' };
}

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
				const event = withDemoDate(await fetchEvent());
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
