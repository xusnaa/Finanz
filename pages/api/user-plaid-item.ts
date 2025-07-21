import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  const items = await prisma.plaidItem.findMany({
    where: { userId: String(userId) },
  });

  res.status(200).json({ items });
}
