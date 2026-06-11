import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params.id is the poll id from the route: /api/polls/[id]/vote



    const { optionId, voterId } = await req.json();

    if (!optionId || !voterId) {
      return Response.json(
        { error: "Missing optionId or voterId" },
        { status: 400 }
      );
    }

    // check if already voted for this option
    const { data: existing } = await supabase
      .from("poll_votes")
      .select("id")
      .eq("voter_id", voterId)
      .eq("option_id", optionId)
      .maybeSingle();

    if (existing) {
      return Response.json(
        { error: "You already voted" },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("poll_votes")
      .insert([
        {
          option_id: optionId,
          voter_id: voterId,
        },
      ]);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

