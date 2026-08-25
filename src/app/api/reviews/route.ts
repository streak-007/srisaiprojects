import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(request: Request) {
  const body = await request.json();
  const student_name = String(body.student_name || "").trim();
  const college = String(body.college || "").trim();
  const quote = String(body.quote || "").trim();
  const project_title = String(body.project_title || "").trim() || null;
  const ratingRaw = Number(body.rating);
  const rating = ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;

  if (!student_name || !college || quote.length < 20) {
    return NextResponse.json({ error: "Name, college, and a longer review are required." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("testimonials").insert({
    student_name,
    college,
    quote,
    project_title,
    rating,
    published: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
