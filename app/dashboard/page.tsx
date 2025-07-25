'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Banknote, Receipt } from 'lucide-react';
import CountUp from 'react-countup';
import {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import Sidebar from '@/components/sidebar';
import Chatbot from '@/components/Chatbot';

import { Menu } from '@headlessui/react';
import Banner from '@/components/Banner';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';

interface Transaction {
  amount: number;
  date: string;
  category: string;
  account: string;
  payee: string;
}

interface Account {
  id: string;
  name: string;
  mask?: string;
}

type SummaryCardProps = {
  title: string;
  value: number;
  icon: React.ReactElement<{ className?: string }>;
  color: string; // e.g. "red", "blue", "green"
};

type ChartDropdownProps<T extends string> = {
  selected: T;
  setSelected: (option: T) => void;
  options: T[];
};

type ChartDataPoint = {
  date?: string;
  value: number;
  name?: string;
};

type ChartRendererProps = {
  type: 'Line' | 'Bar' | 'Area' | 'Pie' | 'Radar' | 'Radial';
  data: ChartDataPoint[];
};

const Dashboard: React.FC = () => {
  const [transactionChart, setTransactionChart] = useState<'Line' | 'Bar' | 'Area'>('Line');
  const [categoryChart, setCategoryChart] = useState<'Pie' | 'Radar' | 'Radial'>('Pie');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { user, loading } = useAuth();
  const router = useRouter();

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
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
  }, [user]);

  // Fetch transactions on account selection
  useEffect(() => {
    if (!user || !selectedAccountId) return;

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
        }
      } catch (err) {
        console.error('Fetch transactions error:', err);
      }
    };

    fetchTransactions();
  }, [selectedAccountId, user]);

  if (loading || !user) return <p className="p-8">Loading...</p>;

  const income = accounts ? 10000 : 0;

  const expenses = transactions.reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  const chartData: ChartDataPoint[] = transactions.map((tx) => ({
    date: tx.date,
    value: tx.amount,
  }));

  const categoriesData: ChartDataPoint[] = Object.values(
    transactions.reduce(
      (acc, tx) => {
        const category = tx.category || 'Uncategorized';
        if (!acc[tx.category]) acc[tx.category] = { name: tx.category, value: 0 };
        acc[tx.category].value += tx.amount;
        return acc;
      },
      {} as Record<string, ChartDataPoint>,
    ),
  );

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar />

      <main className="flex-1 flex flex-col p-4 pt-20 md:pt-6">
        <Banner />
        {!accounts && (
          <div className="mx-6 mb-4 text-yellow-700 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md shadow">
            Please connect your bank account to view income and transactions.
          </div>
        )}

        <div className="p-6 flex flex-col gap-8">
          <div>
            <label className="text-sm font-medium mb-1 block">Select Account:</label>
            <select
              className="p-2 border rounded-md bg-white dark:bg-slate-800 dark:text-white"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} {acc.mask && `(${acc.mask})`}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard title="Remaining" value={balance} icon={<Wallet />} color="purple" />
            <SummaryCard title="Income" value={income} icon={<Banknote />} color="green" />
            <SummaryCard title="Expenses" value={expenses} icon={<Receipt />} color="red" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transactions</h3>
                <ChartDropdown
                  selected={transactionChart}
                  setSelected={setTransactionChart}
                  options={['Line', 'Bar', 'Area']}
                />
              </div>
              <ChartRenderer type={transactionChart} data={chartData} />
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Charts</h3>
                <ChartDropdown
                  selected={categoryChart}
                  setSelected={setCategoryChart}
                  options={['Pie', 'Radar', 'Radial']}
                />
              </div>
              <ChartRenderer
                type={categoryChart}
                data={[
                  { name: 'Groceries', value: 400 },
                  { name: 'Rent', value: 1200 },
                  { name: 'Utilities', value: 200 },
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;

// --- Reusable components ---

const SummaryCard = ({ title, value, icon, color }: SummaryCardProps) => (
  <div className="bg-white dark:bg-slate-900 shadow-md rounded-xl p-6 space-y-2">
    <div className="flex justify-between items-center">
      <h4 className="font-bold text-lg">{title}</h4>
      {React.cloneElement(icon, {
        className: `w-5 h-5 text-${color}-600 dark:text-${color}-400`,
      })}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Jul 02, 2025</p>
    <h2 className={`text-3xl font-extrabold text-${color}-600 dark:text-${color}-400`}>
      <CountUp end={value} prefix="$" decimals={2} duration={1.5} />
    </h2>
  </div>
);

const ChartDropdown = <T extends string>({
  selected,
  setSelected,
  options,
}: ChartDropdownProps<T>) => (
  <Menu as="div" className="relative">
    <Menu.Button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600">
      {selected}
    </Menu.Button>
    <Menu.Items className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded shadow-lg z-10">
      {options.map((option) => (
        <Menu.Item key={option}>
          {({ active }) => (
            <button
              onClick={() => setSelected(option)}
              className={`w-full px-4 py-2 text-left ${active ? 'bg-indigo-100 dark:bg-slate-700' : ''}`}
            >
              {option}
            </button>
          )}
        </Menu.Item>
      ))}
    </Menu.Items>
  </Menu>
);

const ChartRenderer = ({ type, data }: ChartRendererProps) => {
  const [isClient, setIsClient] = useState(false);
  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  switch (type) {
    case 'Line':
      return (
        <LineChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      );
    case 'Bar':
      return (
        <BarChart width={300} height={200} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#10b981" />
        </BarChart>
      );
    case 'Area':
      return (
        <AreaChart width={300} height={200} data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#colorArea)" />
        </AreaChart>
      );
    case 'Pie':
      return (
        <PieChart width={300} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    case 'Radar':
      return (
        <RadarChart outerRadius={80} width={300} height={200} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar
            name="Spending"
            dataKey="value"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      );
    case 'Radial':
      return (
        <RadialBarChart
          width={300}
          height={200}
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius={100}
          barSize={10}
          data={data}
        >
          <RadialBar
            background
            dataKey="value"
            fill="#f43f5e"
            label={{ position: 'insideStart', fill: '#fff' }}
          />
          <Tooltip />
        </RadialBarChart>
      );
    default:
      return null;
  }
};
