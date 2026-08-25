import Link from "next/link";
import { ReviewsTable } from "@/components/admin/reviews-table";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export const metadata = {
  title: "Reviews",
};

export default async function AdminReviewsPage() {
  let reviews: Testimonial[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) reviews = data as Testimonial[];
  }

  const pending = reviews.filter((r) => !r.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Reviews</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Student submissions stay pending until you approve them. {pending} waiting.
          </p>
        </div>
        <Link href="/admin/reviews/new" className="btn-primary !py-2 text-sm">
          Add review
        </Link>
      </div>
      <div className="mt-6">
        <ReviewsTable reviews={reviews} />
      </div>
    </div>
  );
}
