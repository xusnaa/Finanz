import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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

export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    const response = await client.transactionsGet({
      access_token,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      options: {
        count: 250,
        offset: 0,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Plaid transactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
