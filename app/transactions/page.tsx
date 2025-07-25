'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Banner from '@/components/Banner';
import { Plus, Upload } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';

interface Transaction {
  date: string;
  category: string;
  name: string; // updated from "payee"
  amount: number;
  account: string;
}

interface Account {
  id: string;
  name: string;
  mask?: string;
  officialName?: string;
}

const TransactionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState({
    date: '',
    category: '',
    name: '', // updated from "payee"
    amount: '',
    account: '',
  });
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/account?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setAccounts(data.accounts);
          if (data.accounts.length > 0) {
            setSelectedAccountId(data.accounts[0].id);
          }
        } else {
          console.error('Error fetching accounts:', data.error);
        }
      } catch (err) {
        console.error('Fetch accounts error:', err);
      }
    };

    fetchAccounts();
  }, [user]);

  useEffect(() => {
    if (!selectedAccountId || !user) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transaction-by-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, accountId: selectedAccountId }),
        });
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.transactions);
        } else {
          console.error('Error fetching transactions:', data.error);
        }
      } catch (err) {
        console.error('Fetch transactions error:', err);
      }
    };

    fetchTransactions();
  }, [selectedAccountId, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = () => {
    const newTx: Transaction = {
      ...form,
      amount: parseFloat(form.amount),
    };
    setTransactions((prev) => [...prev, newTx]);
    setModalOpen(false);
    setForm({ date: '', category: '', name: '', amount: '', account: '' });
  };

  return (
    <div className="flex h-screen bg-white text-black dark:bg-slate-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <Banner />

        <div className="flex justify-between items-center mt-6 mb-4">
          <h3 className="text-2xl font-bold">Transaction History</h3>
          <div className="flex gap-2">
            <Button onClick={() => setModalOpen(true)} className="bg-indigo-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Import New
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <select
            className="p-2 border rounded-md bg-white dark:bg-slate-800 dark:text-white"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} {acc.mask ? `(${acc.mask})` : ''}
              </option>
            ))}
          </select>

          <Input placeholder="Search Payee..." className="w-96 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto rounded-md border bg-white dark:bg-slate-800">
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Payee</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Account</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">{tx.category}</td>
                    <td className="px-4 py-2">{tx.name}</td> {/* updated */}
                    <td className="px-4 py-2 text-red-500 font-semibold">
                      -${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{tx.account}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Drawer */}
      {modalOpen && (
        <div className="fixed top-0 right-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 shadow-xl z-50 p-6 overflow-y-auto flex flex-col transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add New Transaction</h2>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-500 hover:text-red-600 text-2xl"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTransaction();
            }}
            className="flex flex-col space-y-4 flex-1"
          >
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              placeholder="Date"
            />
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Payee" />{' '}
            {/* updated */}
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <Input
              name="account"
              value={form.account}
              onChange={handleChange}
              placeholder="Account"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
            </select>
            <div className="mt-auto">
              <Button type="submit" className="w-full bg-indigo-600 text-white">
                Save Transaction
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
