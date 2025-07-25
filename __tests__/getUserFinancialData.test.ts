import { getUserFinancialData } from '@/lib/dataTest';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('getUserFinancialData', () => {
  it('fetches accounts and transactions for a user', async () => {
    (prisma.account.findMany as jest.Mock).mockResolvedValue([
      {
        name: 'Checking',
        type: 'checking',
        mask: '1234',
        transactions: [
          {
            date: new Date('2024-01-01'),
            amount: 100.5,
            name: 'Coffee Shop',
            category: 'Food',
          },
        ],
      },
    ]);

    const result = await getUserFinancialData('user-123');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Checking');
    expect(result[0].transactions[0].name).toBe('Coffee Shop');
  });
});
