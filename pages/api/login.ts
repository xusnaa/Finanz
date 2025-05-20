import type { NextApiRequest, NextApiResponse } from 'next';
import { Supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Step 1: Authenticate user
  const { data: authData, error: authError } = await Supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return res.status(401).json({ error: authError?.message || 'Invalid credentials' });
  }

  const userId = authData.user.id;

  // Step 2: Fetch custom user profile from your User table
  const { data: profile, error: profileError } = await Supabase.from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    return res.status(500).json({ error: 'User profile not found' });
  }

  return res.status(200).json({ user: profile });
}
