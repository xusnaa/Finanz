'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, Flag, List, Settings, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/context';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Categories', icon: Folder, href: '/categories' },
  { label: 'Goals', icon: Flag, href: '/goals' },
  { label: 'Transactions', icon: List, href: '/transactions' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      logout(); // This removes user data and redirects to main page
    }
  };

  return (
    <aside className="h-screen w-64 bg-white dark:bg-slate-950 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
          Finanz
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-10 space-y-2">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900 ${
                isActive ? 'bg-purple-100 dark:bg-purple-900 font-semibold' : ''
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-0 w-full h-1 bg-purple-500 rounded-t-md" />
              )}
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 mt-4 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Theme Toggle + Footer */}
      <div className="px-4 py-6 flex flex-col items-center gap-4">
        <ThemeToggle />
        <div className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Finanz App
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
