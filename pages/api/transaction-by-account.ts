// pages/api/transactions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, accountId } = req.body;

  if (!userId || !accountId) {
    return res.status(400).json({ error: 'Missing userId or accountId' });
  }

  try {
    // Find the account by its Mongo _id and ensure it belongs to the user via joins
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        accountDbId: accountId,
      },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('DB error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
