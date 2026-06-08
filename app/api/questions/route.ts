import { supabase } from "@/lib/supabase";
import { getQuestionsPage, searchQuestions } from "@/lib/questions";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (q) {
      const questions = await searchQuestions(q, PAGE_SIZE);
      return Response.json({ questions, hasMore: false });
    }

    const offset = Number(searchParams.get("offset") ?? 0);
    const { questions, hasMore } = await getQuestionsPage(offset, PAGE_SIZE);

    return Response.json({ questions, hasMore });
  } catch (error) {
    console.error("Error loading questions:", error);
    return Response.json(
      {
        questions: [],
        hasMore: false,
        error: error instanceof Error ? error.message : "Failed to load questions",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { body, author } = await req.json();

    if (!body) {
      return Response.json(
        { error: "Missing required field: body" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          body,
          author: author ?? "anonymous",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return Response.json(
      {
        error: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}