import QuestionsList from "./questions-list";
import { getQuestionsPage } from "@/lib/questions";
import { Header } from "./components/header";

// Render on every request (don't cache/prerender) so new questions show up.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

// Server component — runs only on the server, awaits the data, renders to HTML.
export default async function Page() {
  let questions: any[] = [];
  let hasMore = false;
  let error: string | null = null;

  try {
    const result = await getQuestionsPage(0, PAGE_SIZE);
    questions = result.questions;
    hasMore = result.hasMore;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load questions";
    console.error("Error loading questions:", error);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <div className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
          <header className="mb-7">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Live now
            </span>
            <h2 className="text-3xl font-semibold tracking-tight">Questions</h2>
            <p className="mt-1.5 text-sm text-muted">
              Ask a question, upvote the ones you want answered.
            </p>
          </header>

          {error && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 mb-6">
              <p className="font-medium mb-2">Configuration Required</p>
              <p className="mb-3">{error}</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a> and create a project</li>
                <li>In your project, go to Settings → API</li>
                <li>Copy the Project URL and API keys</li>
                <li>Paste them into <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code>: <br/>
                  <code className="bg-yellow-100 px-2 py-1 rounded block mt-1 text-xs">SUPABASE_URL=...</code>
                  <code className="bg-yellow-100 px-2 py-1 rounded block text-xs">SUPABASE_SERVICE_ROLE_KEY=...</code>
                </li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          )}

          <QuestionsList initialQuestions={questions} initialHasMore={hasMore} />
        </div>
      </div>
    </main>
  );
}
