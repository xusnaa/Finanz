import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

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
  const { userId } = req.body;
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Your App Name',
      products: [Products.Transactions], // use string literals, not enum
      country_codes: [CountryCode.Us], // string literals here too
      language: 'en',
    });

    res.status(200).json({ link_token: response.data.link_token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Plaid link token error:', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error:', error);
    }

    res.status(500).json({ error: 'Failed to create link token' });
  }
}
