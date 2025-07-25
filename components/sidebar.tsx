'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, Flag, List, Settings, LogOut, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/context';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Report', icon: Folder, href: '/report' },
  { label: 'Goals', icon: Flag, href: '/goals' },
  { label: 'Transactions', icon: List, href: '/transactions' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) logout();
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-screen flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-950 shadow-md">
        <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Finanz</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-200">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`h-screen w-64 flex-shrink-0 bg-white dark:bg-slate-950 shadow-lg fixed md:static top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
            Finanz
          </h1>
        </div>
        <div className="p-6 md:hidden">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
            Finanz
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900 ${
                  isActive ? 'bg-purple-100 dark:bg-purple-900 font-semibold' : ''
                }`}
                onClick={() => setIsOpen(false)} // close sidebar on mobile after click
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
