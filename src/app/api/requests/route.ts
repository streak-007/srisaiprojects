import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(request: Request) {
  const body = await request.json();
  const required = ["project_id", "student_name", "phone", "email", "college", "year", "branch"];
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json({ error: `Missing ${key}` }, { status: 400 });
    }
  }

  if (!isSupabaseConfigured()) {
    // Demo mode without Supabase — accept and no-op
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("detail_requests").insert({
    project_id: body.project_id,
    student_name: body.student_name,
    phone: body.phone,
    email: body.email,
    college: body.college,
    year: Number(body.year),
    branch: body.branch,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
