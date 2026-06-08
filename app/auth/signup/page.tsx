"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { isUsernameAvailable } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<boolean | null>(null);

  // Check username availability with debounce
  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (!value) {
      setUsernameCheck(null);
      return;
    }

    if (value.length < 3) {
      setUsernameCheck(null);
      return;
    }

    try {
      const available = await isUsernameAvailable(value);
      setUsernameCheck(available);
    } catch {
      setUsernameCheck(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (username && !usernameCheck) {
      setError("Username is not available");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      // Update profile with username if provided
      if (username) {
        // This will be done in the auth context after user creation
        // For now, the profile is created with just email and id
      }
      router.push("/?signup=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
          <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
          <p className="text-sm text-muted mb-6">
            Join Live Q&A to ask questions and vote
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
              <label className="block text-sm font-medium mb-2">
                Username (optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="john_doe"
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
              />
              {username && usernameCheck === true && (
                <p className="text-xs text-green-600 mt-1">✓ Username available</p>
              )}
              {username && usernameCheck === false && (
                <p className="text-xs text-red-600 mt-1">✗ Username not available</p>
              )}
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
              <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
