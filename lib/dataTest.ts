import { prisma } from '@/lib/prisma';

export async function getUserFinancialData(userId: string) {
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
