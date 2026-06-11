import { getQuestionsPage, searchQuestions } from "@/lib/questions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q");
    const offset = Number(searchParams.get("offset") ?? "0");

    if (q) {
      const questions = await searchQuestions(q, 20);
      return Response.json({
        questions,
        hasMore: false,
      });
    }

    const result = await getQuestionsPage(offset, 10);

    return Response.json(result);
  } catch (error) {
    console.error("GET /api/questions error:", error);

    return Response.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { body, author } = await req.json();

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
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}