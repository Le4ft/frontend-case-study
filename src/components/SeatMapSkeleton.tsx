import React from 'react';

export const SeatMapSkeleton: React.FC = () => (
	<div className="bg-white dark:bg-zinc-900 rounded-xl grow shadow-sm dark:border dark:border-zinc-800 p-4 self-stretch flex flex-col gap-4 animate-pulse">
		<div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800 rounded" />
		<div className="flex flex-col gap-2.5">
			{Array.from({ length: 6 }, (_, row) => (
				<div key={row} className="flex items-center gap-2">
					<div className="size-4 bg-zinc-100 dark:bg-zinc-800 rounded" />
					<div className="flex gap-1.5">
						{Array.from({ length: 10 }, (_, seat) => (
							<div key={seat} className="size-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
						))}
					</div>
				</div>
			))}
		</div>
	</div>
);

export const EventInfoSkeleton: React.FC = () => (
	<aside className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-sm dark:border dark:border-zinc-800 p-4 flex flex-col gap-3 self-start animate-pulse">
		<div className="bg-zinc-100 dark:bg-zinc-800 rounded-md h-32 w-full" />
		<div className="h-5 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
		<div className="h-3.5 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
		<div className="h-3.5 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
		<div className="flex flex-col gap-1.5 pt-1">
			<div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
			<div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
			<div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
		</div>
		<div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md mt-1" />
	</aside>
);
