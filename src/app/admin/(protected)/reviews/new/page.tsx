import { ReviewAdminForm } from "@/components/admin/review-admin-form";

export const metadata = {
  title: "New review",
};

export default function NewReviewPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-extrabold">Add review</h1>
      <p className="mt-1 text-sm text-ink-muted">
        For a review you collected offline. Tick Published if it should show on Stories immediately.
      </p>
      <div className="mt-6">
        <ReviewAdminForm />
      </div>
    </div>
  );
}
