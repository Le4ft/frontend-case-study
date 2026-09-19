import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { GuestForm, type GuestDetails } from '@/components/GuestForm.tsx';
import { LoginForm } from '@/components/LoginForm.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { ApiError, createOrder } from '@/lib/api.ts';
import { formatCurrency } from '@/lib/format.ts';
import type { OrderResponse } from '@/types';
import { CheckCircle2, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface CheckoutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	eventId: string;
	currencyIso: string;
}

type Step = 'form' | 'submitting' | 'success' | 'error';

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ open, onOpenChange, eventId, currencyIso }) => {
	const { user } = useAuth();
	const { items, totalAmount, clear } = useCart();
	const { locale, t } = useI18n();

	const [step, setStep] = useState<Step>('form');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [result, setResult] = useState<OrderResponse | null>(null);

	const cartItems = Array.from(items.values());

	const submitOrder = async (customer: GuestDetails) => {
		setStep('submitting');
		setErrorMessage(null);
		try {
			const order = await createOrder({
				eventId,
				tickets: cartItems.map((item) => ({ ticketTypeId: item.ticketType.id, seatId: item.seat.seatId })),
				user: customer
			});
			setResult(order);
			setStep('success');
			clear();
		} catch (err) {
			setErrorMessage(err instanceof ApiError ? err.message : 'Order failed');
			setStep('error');
		}
	};

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen);
		if (!nextOpen) {
			setTimeout(() => {
				setStep('form');
				setResult(null);
				setErrorMessage(null);
			}, 200);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{step === 'success'
							? t('checkout.success.title')
							: step === 'error'
								? t('checkout.error.title')
								: t('checkout.title')}
					</DialogTitle>
				</DialogHeader>

				{(step === 'form' || step === 'submitting') && (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<span className="text-sm font-medium text-zinc-700">{t('checkout.summary')}</span>
							<div className="flex flex-col gap-1 max-h-32 overflow-y-auto text-sm text-zinc-600">
								{cartItems.map((item) => (
									<div key={item.seat.seatId} className="flex justify-between">
										<span>
											{t('seatmap.row')} {item.seatRow} · {t('seat.seat')} {item.seat.place} · {item.ticketType.name}
										</span>
										<span>{formatCurrency(item.ticketType.price, currencyIso, locale)}</span>
									</div>
								))}
							</div>
							<div className="flex justify-between font-semibold pt-2 border-t border-zinc-100 mt-1">
								<span>{t('checkout.summary')}</span>
								<span>{formatCurrency(totalAmount, currencyIso, locale)}</span>
							</div>
						</div>

						{user ? (
							<div className="flex flex-col gap-3">
								<p className="text-sm text-zinc-600">
									{t('checkout.loggedInAs')}: <span className="font-medium">{user.email}</span>
								</p>
								<Button
									disabled={step === 'submitting'}
									onClick={() =>
										submitOrder({ email: user.email, firstName: user.firstName, lastName: user.lastName })
									}
								>
									{t('checkout.submit')}
								</Button>
							</div>
						) : (
							<Tabs defaultValue="guest">
								<TabsList className="w-full grid grid-cols-2">
									<TabsTrigger value="guest">{t('checkout.tab.guest')}</TabsTrigger>
									<TabsTrigger value="login">{t('checkout.tab.login')}</TabsTrigger>
								</TabsList>
								<TabsContent value="guest">
									<GuestForm onSubmit={submitOrder} isSubmitting={step === 'submitting'} />
								</TabsContent>
								<TabsContent value="login">
									<LoginForm onSuccess={() => {}} />
								</TabsContent>
							</Tabs>
						)}
					</div>
				)}

				{step === 'success' && result && (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<CheckCircle2 className="size-12 text-emerald-500" />
						<p className="text-sm text-zinc-600">
							{t('checkout.success.orderId')}: <span className="font-mono">{result.orderId}</span>
						</p>
						<p className="text-lg font-semibold">{formatCurrency(result.totalAmount, currencyIso, locale)}</p>
						<Button onClick={() => handleOpenChange(false)}>{t('checkout.close')}</Button>
					</div>
				)}

				{step === 'error' && (
					<div className="flex flex-col items-center gap-3 py-4 text-center">
						<XCircle className="size-12 text-red-500" />
						<p className="text-sm text-zinc-600">{errorMessage}</p>
						<Button variant="secondary" onClick={() => setStep('form')}>
							{t('checkout.backToCart')}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};
