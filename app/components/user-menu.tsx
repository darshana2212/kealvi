"use client";

import { useAuth } from "@/app/providers";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

export function UserMenu() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-20 h-10 bg-border rounded-lg animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link
          href="/auth/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft border border-brand transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-strong transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium">{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
