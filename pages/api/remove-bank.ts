import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end('Method Not Allowed');

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing userId' });
  }

  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { plaidItem: { userId } } });
  await prisma.plaidItem.deleteMany({ where: { userId } });

  res.status(200).json({ message: 'Bank removed successfully' });
}
