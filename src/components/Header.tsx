import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { LanguageSwitcher } from '@/components/LanguageSwitcher.tsx';
import { LoginForm } from '@/components/LoginForm.tsx';
import { ThemeToggle } from '@/components/ThemeToggle.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { useI18n } from '@/context/I18nContext.tsx';
import React, { useState } from 'react';

export const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const { t } = useI18n();
	const [isLoginOpen, setIsLoginOpen] = useState(false);

	const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : '';

	return (
		<nav className="sticky top-0 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex justify-center z-40">
			<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
				<div className="max-w-[250px] w-full flex">
					<div className="bg-zinc-100 dark:bg-zinc-800 rounded-md size-12 flex items-center justify-center text-xl">
						🎟️
					</div>
				</div>

				<div className="flex items-center gap-1">
					<ThemeToggle />
					<LanguageSwitcher />
				</div>

				<div className="max-w-[250px] w-full flex justify-end">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost">
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												src={`https://source.boringavatars.com/marble/120/${user.email}?colors=25106C,7F46DB`}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>

										<div className="flex flex-col text-left">
											<span className="text-sm font-medium">
												{user.firstName} {user.lastName}
											</span>
											<span className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</span>
										</div>
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[250px]">
								<DropdownMenuLabel>
									{user.firstName} {user.lastName}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={logout}>{t('header.logout')}</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
							<DialogTrigger asChild>
								<Button variant="secondary">{t('header.login')}</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t('header.login')}</DialogTitle>
								</DialogHeader>
								<LoginForm onSuccess={() => setIsLoginOpen(false)} />
							</DialogContent>
						</Dialog>
					)}
				</div>
			</div>
		</nav>
	);
};
