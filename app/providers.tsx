"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Supabase is configured
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isConfigured) {
      setError(
        "Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
      );
      setLoading(false);
      return;
    }

    // Get initial session
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function signUp(email: string, password: string) {
    if (error) throw new Error(error);

    const { data, error: authError } = await supabaseBrowser.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    // Create profile after signup
    if (data.user) {
      const userEmail = data.user.email ?? email;
      const usernameFallback = userEmail.split("@")[0] || "";

      const { error: profileError } = await supabaseBrowser
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email: userEmail,
            username: usernameFallback,
            avatar_url: null,
            role: "user",
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error("Failed to create profile:", profileError.message);
      }
    }
  }

  async function signIn(email: string, password: string) {
    if (error) throw new Error(error);

    const { error: authError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
  }

  async function signOut() {
    const { error: authError } = await supabaseBrowser.auth.signOut();
    if (authError) throw new Error(authError.message);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, error, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
