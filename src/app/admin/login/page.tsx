import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="admin-shell grid min-h-screen place-items-center px-4 py-16">
      <Suspense fallback={<div className="text-sm text-ink-muted">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
