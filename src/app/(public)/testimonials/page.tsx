import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

type TestimonialItem = {
  student_name: string;
  college: string;
  quote: string;
  project_title: string | null;
  rating: number | null;
};

const FALLBACK: TestimonialItem[] = [
  {
    student_name: "Ananya R.",
    college: "JNTU affiliated college",
    quote:
      "Got a clear estimate upfront and the report matched exactly what our guide asked for in the review.",
    project_title: "Smart Irrigation System (IoT)",
    rating: 5,
  },
  {
    student_name: "Karthik M.",
    college: "Private engineering college, Hyderabad",
    quote:
      "The robotic arm demo was the highlight of our batch. Hardware arrived wired and labeled.",
    project_title: "Gesture-Controlled Robotic Arm",
    rating: 5,
  },
  {
    student_name: "Sneha P.",
    college: "Autonomous college, Telangana",
    quote:
      "Loved the private details link — no guessing components. Booking on WhatsApp was smooth.",
    project_title: "Campus Lost & Found Web App",
    rating: 4,
  },
];

export const metadata = {
  title: "Student stories",
};

export default async function TestimonialsPage() {
  let items: TestimonialItem[] = FALLBACK;
  let fromDb = false;

  if (isSupabaseConfigured()) {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    fromDb = true;
    items = (data ?? []).map((row) => ({
      student_name: row.student_name,
      college: row.college,
      quote: row.quote,
      project_title: row.project_title,
      rating: row.rating ?? null,
    }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-ink">Student stories</h1>
          <p className="mt-3 text-ink-muted">Real outcomes from recent major and minor batches.</p>
        </div>
        <Link href="/feedback" className="btn-secondary !py-2 text-sm">
          Leave a review
        </Link>
      </div>

      {items.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <blockquote
              key={`${t.student_name}-${i}`}
              className="rounded-2xl border border-line bg-white/85 p-5"
            >
              {t.rating ? (
                <p className="text-sm font-bold text-copper" aria-label={`${t.rating} out of 5`}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </p>
              ) : null}
              <p className="mt-2 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-5">
                <p className="font-bold text-ink">{t.student_name}</p>
                <p className="text-sm text-ink-muted">{t.college}</p>
                {t.project_title ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-teal">
                    {t.project_title}
                  </p>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 p-8 text-center text-ink-muted">
          {fromDb
            ? "No published reviews yet. After delivery, students can submit feedback — it appears here once approved."
            : "Reviews will show here after they are approved."}
        </p>
      )}
    </div>
  );
}
