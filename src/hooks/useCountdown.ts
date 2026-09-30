import { useEffect, useState } from 'react';

export interface Countdown {
	status: 'upcoming' | 'live' | 'past';
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

function computeCountdown(dateFrom: string, dateTo: string): Countdown {
	const now = Date.now();
	const from = new Date(dateFrom).getTime();
	const to = new Date(dateTo).getTime();

	if (now >= from && now <= to) {
		return { status: 'live', days: 0, hours: 0, minutes: 0, seconds: 0 };
	}
	if (now > to) {
		return { status: 'past', days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	const diff = Math.max(0, from - now);
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((diff / (1000 * 60)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);

	return { status: 'upcoming', days, hours, minutes, seconds };
}

export function useCountdown(dateFrom: string, dateTo: string): Countdown {
	const [countdown, setCountdown] = useState(() => computeCountdown(dateFrom, dateTo));

	useEffect(() => {
		const tick = () => setCountdown(computeCountdown(dateFrom, dateTo));
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [dateFrom, dateTo]);

	return countdown;
}
