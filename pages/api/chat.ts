import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const MAX_MESSAGES = 10;
const MAX_LENGTH = 500;

function sanitizeInput(text: string): string {
  return text
    .trim()
    .replace(/<[^>]*>?/gm, '')
    .replace(/(script|function|eval|alert|window|document)/gi, '')
    .replace(/[`$<>]/g, '')
    .slice(0, MAX_LENGTH);
}

function isValidMessages(messages: any): boolean {
  return (
    Array.isArray(messages) &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (msg) =>
        typeof msg === 'object' &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string' &&
        msg.content.length <= MAX_LENGTH,
    )
  );
}

// Helper: fetch user financial summary from DB (example)
async function getUserFinancialData(userId: string) {
  // fetch accounts and total balance (example)
  const accounts = await prisma.account.findMany({
    where: { plaidItem: { userId } },
    select: {
      name: true,
      type: true,
      mask: true,
      transactions: {
        take: 5,
        orderBy: { date: 'desc' },
        select: {
          date: true,
          amount: true,
          name: true,
          category: true,
        },
      },
    },
  });

  // You can customize more summary/aggregations here
  return accounts;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured' });

  try {
    const { messages, userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    if (!isValidMessages(messages)) return res.status(400).json({ error: 'Invalid input format' });

    // Sanitize messages
    const sanitizedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: sanitizeInput(msg.content),
    }));

    // Fetch user financial data from DB
    const financialData = await getUserFinancialData(userId);

    // Build a context prompt based on DB data (simplified)
    const financialSummary = financialData
      .map(
        (acc) =>
          `Account: ${acc.name} (${acc.mask || 'N/A'}), Type: ${acc.type}. Recent transactions:\n` +
          acc.transactions
            .map(
              (tx) =>
                ` - ${tx.date.toISOString().slice(0, 10)}: ${tx.name} - $${tx.amount.toFixed(2)} (${tx.category || 'Uncategorized'})`,
            )
            .join('\n'),
      )
      .join('\n\n');

    // Insert this context at the start of the messages for OpenAI
    const promptMessages = [
      {
        role: 'system',
        content: `You are a helpful AI financial assistant. Use the user's financial data to answer questions. Here is their recent account and transaction info:\n\n${financialSummary}`,
      },
      ...sanitizedMessages,
    ];

    // Call OpenAI Chat API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: promptMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      return res.status(openaiRes.status).json({ error: errorData });
    }

    const data = await openaiRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) return res.status(502).json({ error: 'No reply from OpenAI' });

    return res.status(200).json({ reply: sanitizeInput(reply) });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
