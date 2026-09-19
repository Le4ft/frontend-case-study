import { cn } from '@/lib/utils.ts';
import type { Locale } from '@/context/I18nContext.tsx';
import React from 'react';

const TWEMOJI_CODE: Record<Locale, string> = {
	cs: '1f1e8-1f1ff',
	en: '1f1ec-1f1e7'
};

interface FlagProps {
	locale: Locale;
	className?: string;
}

export const Flag: React.FC<FlagProps> = ({ locale, className }) => (
	<img
		src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${TWEMOJI_CODE[locale]}.svg`}
		alt=""
		aria-hidden="true"
		width={20}
		height={20}
		className={cn('inline-block size-5 shrink-0', className)}
	/>
);
