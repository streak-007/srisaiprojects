import { RequestsTable } from "@/components/admin/requests-table";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { DetailRequest } from "@/lib/types";

export default async function RequestsPage() {
  let requests: DetailRequest[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("detail_requests")
      .select("*, projects(id, title, slug)")
      .order("created_at", { ascending: false });
    if (data) requests = data as DetailRequest[];
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Requests inbox</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Approve to generate a unique private link, copy it, and open WhatsApp prefilled.
      </p>
      <div className="mt-6">
        <RequestsTable requests={requests} />
      </div>
    </div>
  );
}
