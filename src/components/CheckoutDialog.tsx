import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { DialogIconHeader } from '@/components/DialogIconHeader.tsx';
import { GuestForm, type GuestDetails } from '@/components/GuestForm.tsx';
import { LoginForm } from '@/components/LoginForm.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { useCart } from '@/context/CartContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import { ApiError, createOrder } from '@/lib/api.ts';
import { formatCurrency } from '@/lib/format.ts';
import { getTicketTypeColor } from '@/lib/seatColors.ts';
import type { OrderResponse } from '@/types';
import { CheckCircle2, LogIn, Ticket, UserRound, XCircle } from 'lucide-react';
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
	const cartTicketTypeIds = Array.from(new Set(cartItems.map((item) => item.ticketType.id))).sort();

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
			<DialogContent className="sm:max-w-md gap-5">
				{(step === 'form' || step === 'submitting') && (
					<>
						<DialogIconHeader
							icon={<Ticket />}
							title={t('checkout.title')}
							subtitle={t('checkout.header.subtitle')}
							gradientClassName="bg-gradient-to-br from-violet-500 to-fuchsia-600"
						/>

						<div className="flex flex-col gap-4">
							<div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5 flex flex-col gap-2.5">
								<div className="flex flex-col gap-2 max-h-32 overflow-y-auto scrollbar-thin pr-1">
									{cartItems.map((item) => {
										const color = getTicketTypeColor(cartTicketTypeIds, item.ticketType.id);
										return (
											<div key={item.seat.seatId} className="flex items-center justify-between gap-2 text-sm">
												<span className="flex items-center gap-2 min-w-0 text-zinc-600 dark:text-zinc-300">
													<span className={`size-2 rounded-full shrink-0 ${color.dot}`} />
													<span className="truncate">
														{t('seatmap.row')} {item.seatRow} · {t('seat.seat')} {item.seat.place}
													</span>
												</span>
												<span className="shrink-0 font-medium tabular-nums text-zinc-700 dark:text-zinc-200">
													{formatCurrency(item.ticketType.price, currencyIso, locale)}
												</span>
											</div>
										);
									})}
								</div>
								<div className="flex justify-between items-center pt-2.5 border-t border-zinc-200 dark:border-zinc-700">
									<span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
										{t('checkout.summary')}
									</span>
									<span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
										{formatCurrency(totalAmount, currencyIso, locale)}
									</span>
								</div>
							</div>

							{user ? (
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl px-3.5 py-2.5">
										<UserRound className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
										{t('checkout.loggedInAs')}: <span className="font-medium">{user.email}</span>
									</div>
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
										<TabsTrigger value="guest" className="gap-1.5">
											<UserRound className="size-3.5" />
											{t('checkout.tab.guest')}
										</TabsTrigger>
										<TabsTrigger value="login" className="gap-1.5">
											<LogIn className="size-3.5" />
											{t('checkout.tab.login')}
										</TabsTrigger>
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
					</>
				)}

				{step === 'success' && result && (
					<>
						<DialogIconHeader
							icon={<CheckCircle2 />}
							title={t('checkout.success.title')}
							gradientClassName="bg-gradient-to-br from-emerald-500 to-teal-600"
						/>
						<div className="flex flex-col items-center gap-3 text-center">
							<div className="flex flex-col items-center gap-1 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl px-4 py-3 w-full">
								<span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
									{t('checkout.success.orderId')}
								</span>
								<span className="font-mono text-sm text-zinc-700 dark:text-zinc-200">{result.orderId}</span>
							</div>
							<p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
								{formatCurrency(result.totalAmount, currencyIso, locale)}
							</p>
							<Button onClick={() => handleOpenChange(false)} className="w-full">
								{t('checkout.close')}
							</Button>
						</div>
					</>
				)}

				{step === 'error' && (
					<>
						<DialogIconHeader
							icon={<XCircle />}
							title={t('checkout.error.title')}
							gradientClassName="bg-gradient-to-br from-red-500 to-rose-600"
						/>
						<div className="flex flex-col items-center gap-3 text-center">
							<p className="text-sm text-zinc-600 dark:text-zinc-400">{errorMessage}</p>
							<Button variant="secondary" onClick={() => setStep('form')} className="w-full">
								{t('checkout.backToCart')}
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
