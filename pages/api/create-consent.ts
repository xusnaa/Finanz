import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const consentId = 'your-consent-id'; // Typically you'd get this dynamically by first initiating a consent
  const authId = 'your-auth-id'; // Usually returned from a POST to the authorization sub-resource

  const response = await fetch(
    `https://psd2.api-sandbox.commerzbank.com/berlingroup/v1/consents/${consentId}/authorisations/${authId}`,
    {
      method: 'GET', // or POST, depending on API design
      headers: {
        'X-Request-ID': 'your-random-uuid',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Add Authorization if needed (e.g. Bearer token from certificate-based access)
      },
    },
  );

  const data = await response.json();

  if (response.ok && data?.scaRedirect?.url) {
    res.status(200).json({ redirectUrl: data.scaRedirect.url });
  } else {
    res.status(500).json({ error: 'Failed to get redirect URL', details: data });
  }
}
