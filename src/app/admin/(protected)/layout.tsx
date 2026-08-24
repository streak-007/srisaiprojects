import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
