import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = [
  {
    student_name: "Ananya R.",
    college: "JNTU affiliated college",
    quote:
      "Got a clear estimate upfront and the report matched exactly what our guide asked for in the review.",
    project_title: "Smart Irrigation System (IoT)",
  },
  {
    student_name: "Karthik M.",
    college: "Private engineering college, Hyderabad",
    quote:
      "The robotic arm demo was the highlight of our batch. Hardware arrived wired and labeled.",
    project_title: "Gesture-Controlled Robotic Arm",
  },
  {
    student_name: "Sneha P.",
    college: "Autonomous college, Telangana",
    quote:
      "Loved the private details link — no guessing components. Booking on WhatsApp was smooth.",
    project_title: "Campus Lost & Found Web App",
  },
];

export const metadata = {
  title: "Student stories",
};

export default async function TestimonialsPage() {
  let items = FALLBACK;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data?.length) items = data;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold text-ink">Student stories</h1>
      <p className="mt-3 text-ink-muted">Real outcomes from recent major and minor batches.</p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((t, i) => (
          <blockquote
            key={`${t.student_name}-${i}`}
            className="rounded-2xl border border-line bg-white/85 p-5"
          >
            <p className="text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
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
    </div>
  );
}
