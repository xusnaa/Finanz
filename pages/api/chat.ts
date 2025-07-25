import { prisma } from '@/lib/prisma';
import { isValidMessages, sanitizeInput } from '@/lib/validateTest';
import { NextApiRequest, NextApiResponse } from 'next';

const MAX_MESSAGES = 10;
const MAX_LENGTH = 500;
type Message = { role: string; content: string };

async function getUserFinancialData(userId: string) {
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
    const sanitizedMessages = messages.map((msg: Message) => ({
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

    const promptMessages = [
      {
        role: 'system',
        content: `You are a helpful AI financial assistant. Use the user's financial data to answer questions. Here is their recent account and transaction info:\n\n${financialSummary}`,
      },
      ...sanitizedMessages,
    ];

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
