"use client";

import { useEffect, useState } from "react";
import { getVoterId } from "@/lib/voter";

type Poll = {
  id: string;
  question: string;
  poll_options: {
    id: string;
    option_text: string;
  }[];
};

export default function PollsList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadPolls() {
    const res = await fetch("/api/polls");
    const data = await res.json();

    setPolls(data.polls ?? []);
  }

  async function vote(pollId: string, optionId: string) {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId,
          voterId: getVoterId(),
        }),
      });

      const data = await res.json().catch(() => null);

      console.log("VOTE RESPONSE:", res.status, data);

      if (!res.ok) {
        alert(data?.error || "Vote failed");
        return;
      }

      alert("✅ Vote recorded!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPolls();
  }, []);

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div
          key={poll.id}
          className="rounded-2xl border bg-surface p-4 shadow-sm"
        >
          <h3 className="mb-3 font-semibold">
            {poll.question}
          </h3>

          <div className="space-y-2">
            {poll.poll_options.map((option) => (
              <button
                key={option.id}
                disabled={loading}
                onClick={() => vote(poll.id, option.id)}
                className="block w-full rounded-xl border px-4 py-2 text-left hover:border-brand disabled:opacity-50"
              >
                {option.option_text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}