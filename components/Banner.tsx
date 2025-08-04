'use client';

import React from 'react';
import PlaidLinkButton from './ConnectBankButton';
import { useAuth } from '@/lib/context';

export default function Banner() {
  const { user } = useAuth();
  
  return (
    <div className="bg-indigo-950 dark:bg-slate-900 px-6 py-10 text-white rounded-t-3xl mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold">Welcome back 👋</h2>
        <p className="text-2xl font-semibold mt-2">{user?.firstname}</p>
      </div>

      <PlaidLinkButton />
    </div>
  );
}
