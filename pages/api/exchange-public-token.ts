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
  try {
    const { public_token, userId } = req.body;

    // Step 1: Exchange token
    const tokenResponse = await client.itemPublicTokenExchange({ public_token });
    const access_token = tokenResponse.data.access_token;
    const item_id = tokenResponse.data.item_id;

    // Step 2: Get item details
    const itemInfo = await client.itemGet({ access_token });
    const institutionId = itemInfo.data.item.institution_id;

    let institutionName = '';
    if (institutionId) {
      const inst = await client.institutionsGetById({
        institution_id: institutionId,
        country_codes: [CountryCode.Us],
      });
      institutionName = inst.data.institution.name;
    }

    // Step 3: Save PlaidItem
    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId,
        accessToken: access_token,
        itemId: item_id,
        institutionName,
      },
    });

    // Step 4: Get and save accounts
    const accountRes = await client.accountsGet({ access_token });
    const accounts = accountRes.data.accounts;

    for (const acct of accounts) {
      await prisma.account.create({
        data: {
          plaidItemId: plaidItem.id,
          name: acct.name,
          mask: acct.mask || '',
          officialName: acct.official_name || '',
          subtype: acct.subtype || '',
          type: acct.type,
          accountId: acct.account_id,
        },
      });
    }

    res.status(200).json({ access_token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Plaid error:', error);
      res.status(500).json({ error: 'Failed to exchange and save data', details: error.message });
    } else {
      console.error('Unknown Plaid error:', error);
      res
        .status(500)
        .json({ error: 'Failed to exchange and save data', details: 'Unknown error occurred' });
    }
  }
}
