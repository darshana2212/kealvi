import Link from "next/link";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <div className="border-b bg-surface">
      <div className="mx-auto w-full max-w-2xl px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">Live Q&A</h1>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="hover:text-brand transition-colors"
            >
              Questions
            </Link>

            <Link
              href="/polls"
              className="hover:text-brand transition-colors"
            >
              Polls
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}