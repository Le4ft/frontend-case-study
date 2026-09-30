import { cn } from '@/lib/utils.ts';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import React, { createContext, useCallback, useContext, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
	id: number;
	message: string;
	variant: ToastVariant;
}

interface ToastContextValue {
	showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const VARIANT_ICON: Record<ToastVariant, React.ReactNode> = {
	success: <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />,
	error: <XCircle className="size-4 text-red-500 shrink-0" />,
	info: <CheckCircle2 className="size-4 text-sky-500 shrink-0" />
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const dismiss = useCallback((id: number) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback(
		(message: string, variant: ToastVariant = 'success') => {
			const id = nextId++;
			setToasts((prev) => [...prev, { id, message, variant }]);
			setTimeout(() => dismiss(id), 2600);
		},
		[dismiss]
	);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed bottom-24 sm:bottom-6 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						role="status"
						className={cn(
							'pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-2.5 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 fade-in-0',
							'bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50'
						)}
					>
						{VARIANT_ICON[toast.variant]}
						<span>{toast.message}</span>
						<button
							type="button"
							onClick={() => dismiss(toast.id)}
							className="ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
							aria-label="Dismiss"
						>
							<X className="size-3.5" />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return context;
}
