import { supabase } from "@/lib/supabase";

/**
 * Create a user profile in the profiles table after sign up.
 * Called after successful auth signup.
 */
export async function createProfile(
  userId: string,
  email: string,
  username?: string,
  avatarUrl?: string
) {
  const { error } = await supabase.from("profiles").insert([{
    id: userId,
    email,
    username,
    avatar_url: avatarUrl,
    role: "user",
  }] as any);

  if (error) throw new Error(error.message);
}

/**
 * Get current user's profile.
 */
export async function getProfile(userId: string) {
  const { data, error } = (await (supabase
    .from("profiles") as any)
    .select("*")
    .eq("id", userId)
    .single()) as { data: any; error: any };

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update user profile.
 */
export async function updateProfile(
  userId: string,
  updates: {
    username?: string;
    avatar_url?: string;
  }
) {
  const { data, error } = (await (supabase
    .from("profiles") as any)
    .update(updates)
    .eq("id", userId)
    .select()
    .single()) as { data: any; error: any };

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Check if username is available.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const value = (username ?? "").trim();

  if (!value) return false;
  if (value.length < 3) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", value)
    .maybeSingle();

  // IMPORTANT FIX:
  // If error happens (RLS or network), DO NOT block signup
  if (error) {
    console.warn("Username check warning:", error.message);
    return true;
  }

  // If user exists → not available
  return !data;
}