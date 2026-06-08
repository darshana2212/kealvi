"use client";
import { useState, useEffect } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // ✅ SINGLE SOURCE OF TRUTH FETCH
  async function loadQuestions() {
    try {
      const url = query
        ? `/api/questions?q=${encodeURIComponent(query)}`
        : `/api/questions`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(Array.isArray(data.questions) ? data.questions : []);
      setHasMore(data.hasMore ?? false);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  }

  // Debounced search (FIXED)
  useEffect(() => {
    const id = setTimeout(() => {
      loadQuestions();
    }, 300);

    return () => clearTimeout(id);
  }, [query]);

  // Submit question (FIXED)
  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });

    if (!res.ok) return;

    setDraft("");
    await loadQuestions(); // 🔥 refresh from DB
  }

  async function upvote(id: string) {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );

    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId: getVoterId() }),
    });

    if (!res.ok) {
      setQuestions((qs) =>
        qs.map((q) => (q.id === id ? { ...q, votes: q.votes - 1 } : q))
      );
    }
  }

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?offset=${questions.length}`);
      const data = await res.json();

      setQuestions((qs) => [
        ...qs,
        ...(Array.isArray(data.questions) ? data.questions : []),
      ]);

      setHasMore(data.hasMore ?? false);
    } catch (error) {
      console.error("Error loading more questions:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Ask box */}
      <div className="rounded-2xl border bg-surface p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask a question…"
            className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
          />
          <button
            onClick={submit}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full flex-1 rounded-xl border bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
        />
        <span className="shrink-0 text-xs text-muted">
          {hydrated ? "Interactive ✓" : "Loading interactivity…"}
        </span>
      </div>

      {/* Questions */}
      <ul className="space-y-3">
        {questions
          .filter((q) => q?.id)
          .map((q) => (
            <li
              key={q.id}
              className="flex items-start gap-3 rounded-2xl border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => upvote(q.id)}
                className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3.5 py-2 text-brand transition-colors hover:border-brand hover:bg-brand-soft"
              >
                <span className="text-xs leading-none">▲</span>
                <span className="text-sm font-semibold leading-none tabular-nums">
                  {q.votes}
                </span>
              </button>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="leading-snug">{q.body}</p>
                {q.author && (
                  <p className="mt-1.5 text-xs text-muted">{q.author}</p>
                )}
              </div>
            </li>
          ))}
      </ul>

      {questions.length === 0 && (
        <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted">
          No questions yet — be the first to ask.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}