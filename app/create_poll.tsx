"use client";

import { useState } from "react";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  function addOption() {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  }

  async function submit() {
    const cleanOptions = options.filter((o) => o.trim());

    if (!question.trim() || cleanOptions.length < 2) return;

    setLoading(true);

    const res = await fetch("/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        options: cleanOptions,
      }),
    });

    setLoading(false);

    if (!res.ok) return;

    setQuestion("");
    setOptions(["", ""]);
    window.location.reload();
  }

  return (
    <div className="rounded-2xl border bg-surface p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">Create Poll</h3>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Poll question..."
        className="mb-3 w-full rounded-xl border px-4 py-2"
      />

      <div className="space-y-2">
        {options.map((option, index) => (
          <input
            key={index}
            value={option}
            onChange={(e) => updateOption(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="w-full rounded-xl border px-4 py-2"
          />
        ))}
      </div>

      {options.length < 5 && (
        <button
          onClick={addOption}
          className="mt-3 text-sm text-brand"
        >
          + Add option
        </button>
      )}

      <div>
        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 rounded-xl bg-brand px-5 py-2 text-white"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </div>
  );
}