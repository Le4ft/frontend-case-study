import { DialogDescription, DialogTitle } from '@/components/ui/dialog.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

interface DialogIconHeaderProps {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	gradientClassName?: string;
}

export const DialogIconHeader: React.FC<DialogIconHeaderProps> = ({ icon, title, subtitle, gradientClassName }) => (
	<div className="flex flex-col items-center text-center gap-2">
		<div
			className={cn(
				'flex items-center justify-center size-12 rounded-2xl text-white shadow-sm [&>svg]:size-6',
				gradientClassName ?? 'bg-gradient-to-br from-pink-500 to-rose-600'
			)}
		>
			{icon}
		</div>
		<DialogTitle className="text-lg">{title}</DialogTitle>
		{subtitle && <DialogDescription>{subtitle}</DialogDescription>}
	</div>
);
