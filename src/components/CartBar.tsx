import { Button } from '@/components/ui/button.tsx';
import { CheckoutDialog } from '@/components/CheckoutDialog.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { formatCurrency } from '@/lib/format.ts';
import React, { useState } from 'react';

interface CartBarProps {
	eventId: string;
	currencyIso: string;
}

export const CartBar: React.FC<CartBarProps> = ({ eventId, currencyIso }) => {
	const { totalCount, totalAmount } = useCart();
	const { locale, t } = useI18n();
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

	const ticketWord = totalCount === 1 ? (locale === 'cs' ? 'vstupenku' : 'ticket') : locale === 'cs' ? 'vstupenky' : 'tickets';

	return (
		<>
			<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					<div className="flex flex-col">
						{totalCount > 0 ? (
							<>
								<span className="text-sm text-zinc-500">{t('cart.total', { count: totalCount, ticketWord })}</span>
								<span className="text-2xl font-semibold">{formatCurrency(totalAmount, currencyIso, locale)}</span>
							</>
						) : (
							<span className="text-sm text-zinc-500">{t('cart.empty')}</span>
						)}
					</div>

					<Button disabled={totalCount === 0} variant="default" onClick={() => setIsCheckoutOpen(true)}>
						{t('cart.checkout')}
					</Button>
				</div>
			</nav>

			<CheckoutDialog
				open={isCheckoutOpen}
				onOpenChange={setIsCheckoutOpen}
				eventId={eventId}
				currencyIso={currencyIso}
			/>
		</>
	);
};
