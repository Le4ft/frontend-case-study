import { login as apiLogin } from '@/lib/api.ts';
import type { User } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'nfctron-case-study:user';

interface AuthContextValue {
	user: User | null;
	isLoggingIn: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? (JSON.parse(stored) as User) : null;
	});
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	useEffect(() => {
		if (user) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, [user]);

	const login = useCallback(async (email: string, password: string) => {
		setIsLoggingIn(true);
		try {
			const response = await apiLogin(email, password);
			setUser(response.user);
		} finally {
			setIsLoggingIn(false);
		}
	}, []);

	const logout = useCallback(() => setUser(null), []);

	return (
		<AuthContext.Provider value={{ user, isLoggingIn, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
