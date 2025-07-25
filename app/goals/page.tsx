'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/context';
import { useRouter } from 'next/navigation';

const Goals = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
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

  const chartData = Object.entries(monthlySavings).map(([month, amount]) => ({
    month,
    amount,
  }));

  const extendedChartData = predicted
    ? [...chartData, { month: 'Next', amount: predicted.predictedSavings }]
    : chartData;

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
        <h2 className="text-2xl font-bold mb-4">Savings Prediction</h2>

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
    </div>
  );
};

export default Goals;
