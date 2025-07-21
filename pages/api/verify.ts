import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.verified) return res.status(400).json({ error: 'User already verified' });

  const now = new Date();
  if (user.otp !== otp || user.otpExpiresAt! < now) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  await prisma.user.update({
    where: { email },
    data: { verified: true, otp: null, otpExpiresAt: null },
  });

  return res.status(200).json({ message: 'Email verified successfully' });
}
