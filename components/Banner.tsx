'use client';

import React, { useState } from 'react';
import PlaidLinkButton from './ConnectBankButton';

export default function Banner() {
  const [publicToken, setPublicToken] = useState<string | null>(null);

  async function handlePlaidSuccess(publicToken: string) {
    setPublicToken(publicToken);
    // Exchange publicToken for access token by calling your backend
    const res = await fetch('/api/exchange-public-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Access token:', data.access_token);
      // Save the access token or fetch transactions now
      alert('Bank connected successfully!');
    } else {
      alert('Failed to connect bank');
    }
  }

  return (
    <div className="bg-indigo-950 dark:bg-slate-900 px-6 py-10 text-white rounded-t-3xl mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold">Welcome back 👋</h2>
        <p className="text-2xl font-semibold mt-2">Husna</p>
      </div>

      <PlaidLinkButton onSuccess={handlePlaidSuccess} />
    </div>
  );
}
