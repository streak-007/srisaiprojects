# Deploy checklist (Vercel + Supabase)

1. Create a free Supabase project.
2. In SQL Editor, run `supabase/migrations/001_initial.sql`, then `002_seed.sql`.
3. Auth → Users → Add user (email/password). That user is your admin login.
4. Copy `.env.example` → `.env.local` and fill keys from Project Settings → API.
5. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (country code, digits only) and `NEXT_PUBLIC_SITE_URL`.
6. Push to GitHub → Import on Vercel → add the same env vars for Production.
7. After deploy, set GitHub Actions repository variable `SITE_URL` to your Vercel URL (keep-alive workflow).
8. Optional: UptimeRobot free monitor → `https://YOUR_APP/api/health`.

Demo without Supabase: `npm run dev` uses mock projects. Private link preview: `/full/demo`.
