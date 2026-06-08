import { supabase } from "@/lib/supabase";

// ❌ REMOVE CONFIG CHECK COMPLETELY

function mapQuestion(q: any) {
  return {
    id: q.id,
    body: q.body,
    author: q.author ?? null,
    votes: q.votes ?? 0,
  };
}

export async function getQuestionsPage(offset: number, limit: number) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getQuestionsPage error:", error);
    throw error;
  }

  const rows = (data ?? []).map(mapQuestion);

  return {
    questions: rows,
    hasMore: rows.length === limit,
  };
}

export async function searchQuestions(q: string, limit: number) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .ilike("body", `%${q}%`)
    .limit(limit);

  if (error) {
    console.error("searchQuestions error:", error);
    throw error;
  }

  return (data ?? []).map(mapQuestion);
}