import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import React, { useState } from 'react';

export interface GuestDetails {
	email: string;
	firstName: string;
	lastName: string;
}

interface GuestFormProps {
	onSubmit: (details: GuestDetails) => void;
	isSubmitting: boolean;
}

export const GuestForm: React.FC<GuestFormProps> = ({ onSubmit, isSubmitting }) => {
	const { t } = useI18n();
	const [details, setDetails] = useState<GuestDetails>({ email: '', firstName: '', lastName: '' });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(details);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-3">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="guest-first-name">{t('checkout.firstName')}</Label>
					<Input
						id="guest-first-name"
						required
						value={details.firstName}
						onChange={(e) => setDetails((prev) => ({ ...prev, firstName: e.target.value }))}
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="guest-last-name">{t('checkout.lastName')}</Label>
					<Input
						id="guest-last-name"
						required
						value={details.lastName}
						onChange={(e) => setDetails((prev) => ({ ...prev, lastName: e.target.value }))}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="guest-email">{t('checkout.email')}</Label>
				<Input
					id="guest-email"
					type="email"
					required
					value={details.email}
					onChange={(e) => setDetails((prev) => ({ ...prev, email: e.target.value }))}
				/>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{t('checkout.submit')}
			</Button>
		</form>
	);
};
