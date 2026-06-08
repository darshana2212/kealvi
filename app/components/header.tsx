import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <div className="border-b bg-surface">
      <div className="mx-auto w-full max-w-2xl px-5 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Live Q&A</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
