import { ReviewForm } from "@/components/public/review-form";

export const metadata = {
  title: "Leave a review",
  description: "Share feedback after your Sri Sai Projects delivery. Reviews are published after approval.",
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold text-ink">Leave a review</h1>
      <p className="mt-3 text-ink-muted">
        Finished your kit and viva? Tell other students how it went. Submissions stay private until we
        approve them.
      </p>
      <div className="mt-8">
        <ReviewForm />
      </div>
    </div>
  );
}
