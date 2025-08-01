'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/theme';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      {theme === 'dark' ? <Sun className="w-5 h-5 text-slate-300" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};

export default ThemeToggle;
