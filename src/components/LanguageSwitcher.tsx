import { Flag } from '@/components/Flag.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { useI18n, type Locale } from '@/context/I18nContext.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

const LOCALES: { value: Locale; label: string }[] = [
	{ value: 'cs', label: 'Čeština' },
	{ value: 'en', label: 'English' }
];

export const LanguageSwitcher: React.FC = () => {
	const { locale, setLocale } = useI18n();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Change language">
					<Flag locale={locale} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{LOCALES.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onClick={() => setLocale(option.value)}
						className={cn('gap-2', option.value === locale && 'bg-zinc-100 dark:bg-zinc-800')}
					>
						<Flag locale={option.value} />
						{option.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
