// File: /pages/api/predict.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { monthlyData } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are a financial assistant. Predict the next month’s savings and spending based on the given historical monthly savings data. Respond with JSON format like: {"predictedSpending": 1200, "predictedSavings": 300}',
      },
      {
        role: 'user',
        content: `Monthly savings data: ${JSON.stringify(monthlyData)}`,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.5,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    // Try to parse the JSON returned by AI
    const parsed = JSON.parse(reply || '{}');
    res.status(200).json(parsed);
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Failed to predict savings' });
  }
}
