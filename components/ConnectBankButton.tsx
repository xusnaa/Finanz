'use client';

import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from './ui/button';
import { useAuth } from '@/lib/context';

export default function PlaidLinkButton() {
  const { user } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [hasBank, setHasBank] = useState<boolean>(false);

  // Fetch whether user already has a connected bank
  useEffect(() => {
    if (!user) return;
    fetch(`/api/user-banks?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setHasBank(data?.banks?.length > 0))
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!hasBank) {
      fetch('/api/create-link-token', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((data) => setLinkToken(data.link_token))
        .catch(() => alert('Failed to load Plaid link token'));
    }
  }, [hasBank]);

  const { open, ready } = usePlaidLink({
    token: linkToken ?? '',
    onSuccess: async (public_token) => {
      const res = await fetch('/api/exchange-public-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token, userId: user.id }),
      });
      const { access_token } = await res.json();

      await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, userId: user.id }),
      });

      setHasBank(true);
    },
  });

  const removeBank = async () => {
    await fetch(`/api/remove-bank?userId=${user.id}`, { method: 'DELETE' });
    setHasBank(false);
  };

  return (
    <>
      {hasBank ? (
        <Button onClick={removeBank} className="bg-red-600 hover:bg-red-700 text-white">
          Remove Bank
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Connect Bank
        </Button>
      )}
    </>
  );
}
