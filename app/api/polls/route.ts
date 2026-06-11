import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("polls")
    .select(`
      id,
      question,
      created_at,
      poll_options (
        id,
        option_text
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ polls: data ?? [] });
}

export async function POST(req: Request) {
  try {
    const { question, options } = await req.json();

    if (!question || !options || options.length < 2) {
      return Response.json(
        { error: "Question and at least 2 options are required" },
        { status: 400 }
      );
    }

    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert([{ question }])
      .select()
      .single();

    if (pollError) {
      return Response.json({ error: pollError.message }, { status: 500 });
    }

    const pollOptions = options.map((option: string) => ({
      poll_id: poll.id,
      option_text: option,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(pollOptions);

    if (optionsError) {
      return Response.json(
        { error: optionsError.message },
        { status: 500 }
      );
    }

    return Response.json({ success: true, poll });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}