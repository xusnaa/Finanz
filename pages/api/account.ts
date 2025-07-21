// pages/api/accounts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; // or req.body, depends on method

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const plaidItems = await prisma.plaidItem.findMany({
      where: { userId },
      include: {
        accounts: true,
      },
    });

    // Flatten accounts from all PlaidItems
    const accounts = plaidItems.flatMap((item) => item.accounts);

    res.status(200).json({ accounts });
  } catch (error) {
    console.error('DB error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
