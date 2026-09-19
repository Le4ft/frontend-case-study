import { Button } from '@/components/ui/button.tsx';
import { useTheme } from '@/context/ThemeContext.tsx';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

export const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
			{theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</Button>
	);
};
