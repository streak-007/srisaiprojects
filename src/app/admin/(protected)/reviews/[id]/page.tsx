import { notFound } from "next/navigation";
import { ReviewAdminForm } from "@/components/admin/review-admin-form";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold">Edit review</h1>
      <div className="mt-6">
        <ReviewAdminForm review={data as Testimonial} />
      </div>
    </div>
  );
}
