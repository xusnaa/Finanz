'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Modal from '@/components/Modal/InputModal';
import Sidebar from '@/components/sidebar';
import Chatbot from '@/components/Chatbot';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#22c55e', '#f87171']; // saved = green, remaining = red

const Goals = () => {
  const [goalAmount, setGoalAmount] = useState<number>(5000);
  const [savedAmount, setSavedAmount] = useState<number>(3200);
  const [modalOpen, setModalOpen] = useState(false);

  const [predicted, setPredicted] = useState<{
    predictedSpending: number;
    predictedSavings: number;
  } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const monthlySavings = {
    Jan: 300,
    Feb: 400,
    Mar: 500,
    Apr: 300,
    May: 200,
    Jun: 300,
  };

  const percentage = (savedAmount / goalAmount) * 100;
  const remaining = goalAmount - savedAmount;

  const chartData = Object.entries(monthlySavings).map(([month, amount]) => ({
    month,
    amount,
  }));

  const extendedChartData = predicted
    ? [...chartData, { month: 'Next', amount: predicted.predictedSavings }]
    : chartData;

  const pieData = [
    { name: 'Saved', value: savedAmount },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0 },
  ];

  const handlePredict = async () => {
    setLoadingPrediction(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyData: monthlySavings }),
      });

      const data = await res.json();
      setPredicted(data);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 dark:text-slate-200">
      <Sidebar />

      <main className="flex-1 flex flex-col p-6 mt-10 space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Financial Goals</h2>

        <Card className="dark:bg-slate-900 border-dashed border-2 border-primary">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Set Financial Goal</h3>
              <p className="text-sm text-muted-foreground">Define how much you want to save.</p>
            </div>
            <Button onClick={() => setModalOpen(true)}>+ Set Goal</Button>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Goal Progress</h3>
            <p className="text-sm text-muted-foreground">
              ${savedAmount} / ${goalAmount} saved
            </p>
            <Progress value={percentage} />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart + Predict Button */}
        <Card className="dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Monthly Savings</h3>
              <Button onClick={handlePredict} disabled={loadingPrediction}>
                {loadingPrediction ? 'Predicting...' : 'Predict Next Month'}
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={extendedChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {predicted && (
              <div className="text-sm mt-2 text-green-500">
                <p>🧠 Predicted Spending: ${predicted.predictedSpending}</p>
                <p>💰 Predicted Savings: ${predicted.predictedSavings}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <aside className="relative w-80 h-screen p-4 shadow-xl flex flex-col justify-between">
        <div className="p-6 rounded-lg bg-purple-400 mt-10 h-[200px] text-center">
          <h3 className="font-bold text-xl mb-2">Goal Summary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You’ve saved {percentage.toFixed(1)}% of your goal!
          </p>
          <p className="text-xl font-extrabold text-white mt-2">${savedAmount.toFixed(2)}</p>
        </div>
        <div className="p-6">
          <Chatbot />
        </div>
      </aside>

      {/* Modal */}
      {modalOpen && (
        <Modal title="Set Financial Goal" onClose={() => setModalOpen(false)}>
          <Input
            type="number"
            placeholder="Enter goal amount"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
          />
          <Button onClick={() => setModalOpen(false)} className="mt-4 w-full">
            Save Goal
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
