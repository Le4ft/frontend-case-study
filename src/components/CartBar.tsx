import { Button } from '@/components/ui/button.tsx';
import { CheckoutDialog } from '@/components/CheckoutDialog.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { CART_FLY_TARGET_ID } from '@/lib/flyToCart.ts';
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
			<nav className="sticky bottom-0 left-0 right-0 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.08)] flex justify-center">
				<div className="max-w-screen-lg p-4 sm:p-6 flex justify-between items-center gap-4 grow">
					<div id={CART_FLY_TARGET_ID} className="flex flex-col">
						{totalCount > 0 ? (
							<>
								<span className="text-sm text-zinc-500 dark:text-zinc-400">
									{t('cart.total', { count: totalCount, ticketWord })}
								</span>
								<span
									key={totalAmount}
									className="text-2xl font-semibold tabular-nums animate-in zoom-in-90 fade-in duration-200"
								>
									{formatCurrency(totalAmount, currencyIso, locale)}
								</span>
							</>
						) : (
							<span className="text-sm text-zinc-500 dark:text-zinc-400">{t('cart.empty')}</span>
						)}
					</div>

					<Button
						disabled={totalCount === 0}
						variant="default"
						size="lg"
						onClick={() => setIsCheckoutOpen(true)}
					>
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
