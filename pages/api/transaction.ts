import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments } from 'plaid';
import { prisma } from '@/lib/prisma';

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
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { access_token, userId } = req.body;

  if (!access_token || !userId) {
    return res.status(400).json({ error: 'Missing access_token or userId' });
  }

  try {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 1);

    // 1. Get item and institution info
    const plaidItemData = await client.itemGet({ access_token });
    const itemId = plaidItemData.data.item.item_id;
    const institutionId = plaidItemData.data.item.institution_id;

    let institutionName = '';
    if (institutionId) {
      const institutionData = await client.institutionsGetById({
        institution_id: institutionId,
        country_codes: [CountryCode.Us],
      });
      institutionName = institutionData.data.institution.name;
    }

    // 2. Store or update PlaidItem
    const plaidItem = await prisma.plaidItem.upsert({
      where: { itemId },
      update: {
        accessToken: access_token,
        institutionName,
      },
      create: {
        userId,
        itemId,
        accessToken: access_token,
        institutionName,
      },
    });

    // 3. Get and upsert accounts
    const accountsData = await client.accountsGet({ access_token });

    for (const acc of accountsData.data.accounts) {
      await prisma.account.upsert({
        where: { accountId: acc.account_id },
        update: {
          name: acc.name,
          mask: acc.mask ?? '',
          officialName: acc.official_name ?? '',
          subtype: acc.subtype ?? '',
          type: acc.type,
        },
        create: {
          plaidItemId: plaidItem.id,
          accountId: acc.account_id,
          name: acc.name,
          mask: acc.mask ?? '',
          officialName: acc.official_name ?? '',
          subtype: acc.subtype ?? '',
          type: acc.type,
        },
      });
    }

    // 4. Get and upsert transactions
    const txResponse = await client.transactionsGet({
      access_token,
      start_date: start.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
    });

    const transactions = txResponse.data.transactions;

    for (const tx of transactions) {
      const account = await prisma.account.findUnique({
        where: { accountId: tx.account_id },
      });

      if (!account) continue;

      await prisma.transaction.upsert({
        where: { plaidId: tx.transaction_id },
        update: {
          amount: tx.amount,
          name: tx.name,
          category: tx.category?.[0] ?? null,
          date: new Date(tx.date),
        },
        create: {
          userId,
          plaidId: tx.transaction_id,
          name: tx.name,
          amount: tx.amount,
          category: tx.category?.[0] ?? null,
          date: new Date(tx.date),
          plaidItemId: plaidItem.id,
          accountDbId: account.id,
        },
      });
    }

    res.status(200).json({ message: 'Transactions synced successfully' });
  } catch (error: any) {
    console.error('Failed to sync transactions:', error);
    res.status(500).json({ error: 'Failed to sync transactions', detail: error.message });
  }
}
