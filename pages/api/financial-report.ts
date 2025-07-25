// pages/api/financial-report.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});
const client = new PlaidApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, accountDbId } = req.body;

  if (!userId || !accountDbId) return res.status(400).json({ error: 'Missing parameters' });

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountDbId,
        userId,
      },
      orderBy: { date: 'desc' },
      take: 100, // limit to recent 100 for speed
    });

    if (!transactions.length) return res.status(404).json({ error: 'No transactions found' });

    // Generate summary string for AI
    const summary = transactions
      .map(
        (tx) =>
          `${tx.date.toISOString().split('T')[0]} - ${tx.name} - $${tx.amount} (${tx.category ?? 'Uncategorized'})`,
      )
      .join('\n');

    const prompt = `You are a financial assistant. Generate a user-friendly report based on these transactions:\n\n${summary}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful financial assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const report = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate financial report' });
  }
}
