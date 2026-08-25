# Deploy checklist (Vercel + Supabase)

1. Create a free Supabase project.
2. In SQL Editor, run `supabase/migrations/001_initial.sql`, then `002_seed.sql`, then `003_testimonials_moderation.sql`.
3. Auth → Users → Add user (email/password). That user is your admin login.
4. Set environment variables locally (`.env.local`) and in Vercel:

   **Safe to expose in the browser (`NEXT_PUBLIC_`):**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` **or** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     (this is the public client key; Row Level Security is what keeps data private)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL` (no trailing slash, e.g. `https://srisaiprojects.vercel.app`)

   **Server-only (do not use `NEXT_PUBLIC_`):**
   - `SUPABASE_SERVICE_ROLE_KEY`

5. After changing Vercel env vars, click **Redeploy**.
6. Set GitHub Actions repository variable `SITE_URL` for the keep-alive workflow.

Admin → Projects → **Share project details** generates a private `/full/<token>` link, copies it, and opens WhatsApp with the estimate + link.
