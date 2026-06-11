import { Header } from "../components/header";
import CreatePoll from "../create_poll";
import PollsList from "../polls_list";

export default function PollsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <header className="mb-7">
          <h2 className="text-3xl font-semibold">
            Live Polls
          </h2>

          <p className="mt-1.5 text-sm text-muted">
            Create polls and vote live.
          </p>
        </header>

        <div className="space-y-6">
          <CreatePoll />
          <PollsList />
        </div>
      </div>
    </main>
  );
}