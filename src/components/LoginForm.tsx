import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { ApiError } from '@/lib/api.ts';
import { useI18n } from '@/context/I18nContext.tsx';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';

interface LoginFormProps {
	onSuccess: () => void;
	submitLabel?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, submitLabel }) => {
	const { login, isLoggingIn } = useAuth();
	const { t } = useI18n();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await login(email, password);
			onSuccess();
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Login failed');
		}
	};

	const fillDemoCredentials = () => {
		setEmail('frontend@nfctron.com');
		setPassword('Nfctron2025');
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="login-email">{t('checkout.email')}</Label>
				<Input
					id="login-email"
					type="email"
					required
					icon={<Mail />}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="frontend@nfctron.com"
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="login-password">{t('checkout.password')}</Label>
				<Input
					id="login-password"
					type="password"
					required
					icon={<Lock />}
					placeholder={t('checkout.password.placeholder')}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
			<Button type="submit" disabled={isLoggingIn} className="mt-1">
				{submitLabel ?? t('checkout.loginSubmit')}
			</Button>

			<button
				type="button"
				onClick={fillDemoCredentials}
				className="text-xs text-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors underline underline-offset-2 decoration-dotted"
			>
				{t('checkout.useDemoAccount')}
			</button>
		</form>
	);
};
