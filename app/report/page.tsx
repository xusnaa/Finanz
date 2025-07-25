'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/context';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';
import Logo from '@/sections/Navbar/Logo';

import { useRouter } from 'next/navigation';

interface Account {
  id: string;
  name: string;
}

const Report = () => {
  const router = useRouter();

  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [report, setReport] = useState<string>('');
  const [exported, setExported] = useState<boolean>(false); // NEW
  const [loading, setLoading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;
    fetch(`/api/account?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setAccounts(data.accounts || []))
      .catch((err) => console.error('Failed to load accounts:', err));
  }, [user]);

  const fetchReport = async () => {
    if (!selectedAccount || !user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/financial-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, accountDbId: selectedAccount }),
      });

      const data = await res.json();
      setReport(data.report || '⚠️ No report generated.');
    } catch (error) {
      console.error('Report fetch failed:', error);
      setReport('⚠️ Failed to fetch report.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    console.log('report');
  };
  return (
    <div className="flex min-h-screen gap-4 bg-gray-100 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar />

      <main className="flex-1 flex flex-col ml-4">
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent">
            Financial Report
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Account:</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">-- Choose an account --</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={fetchReport} disabled={!selectedAccount || loading} className="mb-4">
            {loading ? 'Generating Report...' : 'Generate Report'}
          </Button>

          {/* Export Button */}
          {report && (
            <Button
              onClick={exportPDF}
              className="mb-4 ml-2  bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              {exported ? 'Exported' : 'Export as PDF'}
            </Button>
          )}

          {/* Report Output */}
          {report && (
            <div
              ref={reportRef}
              className="bg-white p-6 rounded shadow mt-4 text-sm whitespace-pre-wrap"
            >
              <div className="mb-4">
                <Logo />
              </div>
              {report}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report;
