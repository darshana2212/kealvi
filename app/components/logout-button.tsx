"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

export function LogoutButton() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  if (!user) {
    return null;
  }

  async function handleLogout() {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-surface border border-border transition-colors"
    >
      Sign Out
    </button>
  );
}
