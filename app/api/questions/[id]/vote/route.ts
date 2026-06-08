import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const questionId = (await context.params).id;
    const { voterId } = await req.json();

    const { error } = await supabase.from("votes").insert([
      {
        question_id: questionId,
        voter_id: voterId,
      },
    ] as any);

    if (error) {
      console.log("Vote error:", error);

      // duplicate vote
      if ((error as any)?.code === "23505") {
        return Response.json({ error: "already voted" }, { status: 409 });
      }

      return Response.json({ error: error.message }, { status: 500 });
    }

    // increment question votes (IMPORTANT)
    const { data } = await supabase
      .from("questions")
      .select("votes")
      .eq("id", questionId)
      .single();

    await supabase
      .from("questions")
      .update({ votes: (data?.votes ?? 0) + 1 })
      .eq("id", questionId);

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}