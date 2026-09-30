import { CartBar } from '@/components/CartBar.tsx';
import { EventInfo } from '@/components/EventInfo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Header } from '@/components/Header.tsx';
import { SeatMap } from '@/components/SeatMap.tsx';
import { EventInfoSkeleton, SeatMapSkeleton } from '@/components/SeatMapSkeleton.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { useEventData } from '@/hooks/useEventData.ts';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import './App.css';

function App() {
	const { event, tickets, isLoading, error, refetch } = useEventData();
	const { t } = useI18n();

	useEffect(() => {
		document.title = event ? `${event.namePub} — NFCtron Tickets` : 'NFCtron Tickets';
	}, [event]);

	return (
		<div className="flex flex-col grow min-h-screen">
			<Header />

			<main className="grow flex flex-col justify-center">
				<div className="max-w-screen-lg m-auto p-4 sm:p-6 flex items-start grow gap-4 sm:gap-6 w-full flex-col md:flex-row">
					{isLoading && (
						<>
							<SeatMapSkeleton />
							<EventInfoSkeleton />
						</>
					)}

					{error && !isLoading && (
						<div className="grow flex flex-col items-center justify-center gap-3 self-stretch bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-12 text-center">
							<AlertTriangle className="size-8 text-red-500 dark:text-red-400" />
							<p className="text-zinc-600 dark:text-zinc-300">{t('event.error')}</p>
							<Button variant="secondary" onClick={refetch} className="gap-2">
								<RotateCw className="size-4" />
								{t('event.retry')}
							</Button>
						</div>
					)}

					{event && tickets && !isLoading && !error && (
						<>
							<SeatMap tickets={tickets} currencyIso={event.currencyIso} />
							<EventInfo event={event} />
						</>
					)}
				</div>
			</main>

			{event && <CartBar eventId={event.eventId} currencyIso={event.currencyIso} />}
		</div>
	);
}

export default App;
