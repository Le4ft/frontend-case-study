import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Locale = 'cs' | 'en';

const STORAGE_KEY = 'nfctron-case-study:locale';

const dictionaries = {
	cs: {
		'header.login': 'Přihlásit se',
		'header.logout': 'Odhlásit se',
		'event.addToCalendar': 'Přidat do kalendáře',
		'event.loading': 'Načítání akce…',
		'event.error': 'Akci se nepodařilo načíst.',
		'event.retry': 'Zkusit znovu',
		'event.share': 'Sdílet',
		'event.countdown.startsIn': 'Začíná za',
		'event.countdown.live': 'Právě probíhá',
		'event.countdown.ended': 'Akce skončila',
		'seatmap.legend': 'Legenda',
		'seatmap.stage': 'Pódium',
		'seatmap.randomSeat': 'Vybrat místo náhodně',
		'seatmap.cheapestSeat': 'Nejlevnější dostupné místo',
		'seatmap.clearFilter': 'Zrušit filtr',
		'seatmap.zoomIn': 'Přiblížit',
		'seatmap.zoomOut': 'Oddálit',
		'seatmap.zoomReset': 'Výchozí přiblížení',
		'seatmap.row': 'Řada',
		'seat.add': 'Přidat do košíku',
		'seat.add.short': 'Přidat',
		'seat.remove': 'Odebrat z košíku',
		'seat.remove.short': 'Odebrat',
		'seat.seat': 'Sedadlo',
		'seat.price': 'Cena',
		'cart.total': 'Celkem za {count} {ticketWord}',
		'cart.checkout': 'Koupit vstupenky',
		'cart.empty': 'Vyberte sedadla pro pokračování',
		'checkout.title': 'Dokončení objednávky',
		'checkout.tab.guest': 'Pokračovat jako host',
		'checkout.tab.login': 'Přihlásit se',
		'checkout.firstName': 'Jméno',
		'checkout.lastName': 'Příjmení',
		'checkout.email': 'E-mail',
		'checkout.password': 'Heslo',
		'checkout.submit': 'Odeslat objednávku',
		'checkout.loginSubmit': 'Přihlásit se',
		'checkout.summary': 'Shrnutí objednávky',
		'checkout.loggedInAs': 'Přihlášen/a jako',
		'checkout.success.title': 'Objednávka byla vytvořena!',
		'checkout.success.orderId': 'Číslo objednávky',
		'checkout.error.title': 'Objednávku se nepodařilo vytvořit',
		'checkout.close': 'Zavřít',
		'checkout.backToCart': 'Zpět',
		'common.cancel': 'Zrušit',
		'toast.seat.added': 'Sedadlo přidáno do košíku',
		'toast.seat.removed': 'Sedadlo odebráno z košíku',
		'toast.share.copied': 'Odkaz zkopírován do schránky',
		'toast.share.failed': 'Odkaz se nepodařilo zkopírovat',
		'toast.calendar.added': 'Přidáno do kalendáře',
		'toast.noSeatsAvailable': 'Všechna sedadla jsou již vybrána'
	},
	en: {
		'header.login': 'Login or register',
		'header.logout': 'Log out',
		'event.addToCalendar': 'Add to calendar',
		'event.loading': 'Loading event…',
		'event.error': 'Failed to load the event.',
		'event.retry': 'Try again',
		'event.share': 'Share',
		'event.countdown.startsIn': 'Starts in',
		'event.countdown.live': 'Happening now',
		'event.countdown.ended': 'Event has ended',
		'seatmap.legend': 'Legend',
		'seatmap.stage': 'Stage',
		'seatmap.randomSeat': 'Pick a random seat',
		'seatmap.cheapestSeat': 'Cheapest available seat',
		'seatmap.clearFilter': 'Clear filter',
		'seatmap.zoomIn': 'Zoom in',
		'seatmap.zoomOut': 'Zoom out',
		'seatmap.zoomReset': 'Reset zoom',
		'seatmap.row': 'Row',
		'seat.add': 'Add to cart',
		'seat.add.short': 'Add',
		'seat.remove': 'Remove from cart',
		'seat.remove.short': 'Remove',
		'seat.seat': 'Seat',
		'seat.price': 'Price',
		'cart.total': 'Total for {count} {ticketWord}',
		'cart.checkout': 'Checkout now',
		'cart.empty': 'Select seats to continue',
		'checkout.title': 'Complete your order',
		'checkout.tab.guest': 'Continue as guest',
		'checkout.tab.login': 'Login',
		'checkout.firstName': 'First name',
		'checkout.lastName': 'Last name',
		'checkout.email': 'Email',
		'checkout.password': 'Password',
		'checkout.submit': 'Place order',
		'checkout.loginSubmit': 'Login',
		'checkout.summary': 'Order summary',
		'checkout.loggedInAs': 'Logged in as',
		'checkout.success.title': 'Your order was created!',
		'checkout.success.orderId': 'Order ID',
		'checkout.error.title': 'Failed to create order',
		'checkout.close': 'Close',
		'checkout.backToCart': 'Back',
		'common.cancel': 'Cancel',
		'toast.seat.added': 'Seat added to cart',
		'toast.seat.removed': 'Seat removed from cart',
		'toast.share.copied': 'Link copied to clipboard',
		'toast.share.failed': 'Could not copy the link',
		'toast.calendar.added': 'Added to calendar',
		'toast.noSeatsAvailable': 'All seats are already selected'
	}
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof dictionaries.cs;

interface I18nContextValue {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectDefaultLocale(): Locale {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'cs' || stored === 'en') return stored;
	return navigator.language.toLowerCase().startsWith('cs') ? 'cs' : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(detectDefaultLocale);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, locale);
	}, [locale]);

	const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

	const t = useCallback(
		(key: TranslationKey, params?: Record<string, string | number>) => {
			let text: string = dictionaries[locale][key] ?? key;
			if (params) {
				for (const [paramKey, value] of Object.entries(params)) {
					text = text.replace(`{${paramKey}}`, String(value));
				}
			}
			return text;
		},
		[locale]
	);

	return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error('useI18n must be used within I18nProvider');
	}
	return context;
}
