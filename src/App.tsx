import { CartBar } from '@/components/CartBar.tsx';
import { EventInfo } from '@/components/EventInfo.tsx';
import { Header } from '@/components/Header.tsx';
import { SeatMap } from '@/components/SeatMap.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { useEventData } from '@/hooks/useEventData.ts';
import './App.css';

function App() {
	const { event, tickets, isLoading, error } = useEventData();
	const { t } = useI18n();

	return (
		<div className="flex flex-col grow min-h-screen">
			<Header />

			<main className="grow flex flex-col justify-center">
				<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full flex-col md:flex-row">
					{isLoading && (
						<div className="grow flex items-center justify-center self-stretch bg-white dark:bg-zinc-900 rounded-md shadow-sm p-12 text-zinc-400">
							{t('event.loading')}
						</div>
					)}

					{error && !isLoading && (
						<div className="grow flex items-center justify-center self-stretch bg-white dark:bg-zinc-900 rounded-md shadow-sm p-12 text-red-500 dark:text-red-400">
							{t('event.error')}
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
