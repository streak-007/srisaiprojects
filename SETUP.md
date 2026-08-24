# Deploy checklist (Vercel + Supabase)

1. Create a free Supabase project.
2. In SQL Editor, run `supabase/migrations/001_initial.sql`, then `002_seed.sql`.
3. Auth → Users → Add user (email/password). That user is your admin login.
4. Set environment variables locally (`.env.local`) and in Vercel → Settings → Environment Variables:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` **or** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (either works)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL` (no trailing slash preferred, e.g. `https://srisaiprojects.vercel.app`)

5. After changing Vercel env vars, click **Redeploy** (required for `NEXT_PUBLIC_*` keys).
6. Set GitHub Actions repository variable `SITE_URL` for the keep-alive workflow.
7. Optional: UptimeRobot free monitor → `https://YOUR_APP/api/health`.

Private project links: Admin → Projects → **Copy private link** (or on the edit page). Opens `/full/<token>` with full estimate.
