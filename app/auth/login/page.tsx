"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirectTo") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-surface p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">Sign In</h1>
          <p className="text-sm text-muted mb-6">
            Welcome back to Live Q&A
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand text-white font-medium py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-strong transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-brand hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted">Loading...</p>
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
