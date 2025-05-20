import type { NextApiRequest, NextApiResponse } from "next";
import { Supabase } from "@/lib/supabase";

// Create admin client with service role key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Step 1: Create Auth user
  const { data: authData, error: authError } =
    await Supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError || !authData?.user) {
    return res
      .status(400)
      .json({ error: authError?.message || "Failed to create auth user" });
  }

  const userId = authData.user.id;

  // Step 2: Insert into custom User table
  const { error: dbError } = await Supabase.from("User").insert([
    {
      id: userId, // FK to auth.users.id
      email,
      full_name: fullName,
      // Add other fields as needed
    },
  ]);

  if (dbError) {
    return res.status(500).json({ error: "Failed to create user in database" });
  }

  return res.status(200).json({ message: "User created successfully", userId });
}
