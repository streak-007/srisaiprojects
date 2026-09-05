# Sri Sai Projects — Website Specification

A showcase + inquiry platform for final-year major projects and 2nd/3rd-year minor projects, with an admin panel to add projects and generate cost estimates, and a student-facing catalog with shareable "full detail" links.

---

## 1. Goals

- Let students browse final-year and minor engineering projects by branch/domain.
- Let students see a public estimate and request full details.
- Let the admin (you) add new projects, configure/calculate estimates, and share a private link per project (or per request) with full specs.
- **Zero hosting/database cost** at your current scale (a few hundred students, a few hundred projects).

---

## 2. Recommended Free Tech Stack

| Layer | Tool | Why | Free-tier reality (verified Aug 2026) |
|---|---|---|---|
| Frontend | **Next.js** (React) | SSR/SEO-friendly, huge free-tier support on Vercel, easy to learn | — |
| Hosting | **Vercel (Hobby plan)** | One-click deploy from GitHub, free SSL, custom domain support | 100 GB bandwidth/mo, ~100k function calls/mo, unlimited personal projects — **but Hobby's terms restrict it to non-commercial personal use.** Since this site represents a paid service (students pay for projects), technically you should be on a paid plan. In practice, small local-business sites run on Hobby all the time without issue, but if you want to be fully compliant, use **Cloudflare Pages** (free tier, no such non-commercial restriction) or **Netlify** instead — both work near-identically with Next.js. |
| Database | **Supabase (Free tier)** | Real Postgres DB + built-in Auth + file Storage + auto-generated APIs, generous free tier | 500 MB database, 1 GB file storage, 5 GB bandwidth/mo, 50,000 monthly active users, 2 active projects. **Catch:** a free project auto-pauses after 7 days of no API traffic — fine for a live site with regular visits, but if the site goes quiet (e.g. summer break), you may need to manually "resume" it once. A free cron ping (see §8) avoids this entirely. |
| Auth (admin login) | **Supabase Auth** | Built into the same free project, no extra service needed | Included in Supabase free tier |
| Image/file storage | **Supabase Storage** | For project photos, circuit diagrams, PPTs, sample reports | 1 GB included — enough for hundreds of compressed images |
| Domain | Free `yourapp.vercel.app` / `yourapp.pages.dev` subdomain to start; a proper `.com`/`.in` domain later (~₹500–800/yr, only paid cost) | — | — |
| Forms/notifications | **Supabase + Resend (free tier: 100 emails/day)** or a WhatsApp Business "click to chat" link | Notify you when a student requests full project details | — |
| Analytics (optional) | **Vercel Analytics free tier** or **Plausible/Umami self-host-free** | See which projects get the most interest | — |

**Bottom line:** Next.js + Supabase + Vercel/Cloudflare Pages gets you a production-grade site for **₹0/month**, with the only realistic future cost being a custom domain name.

---

## 3. User Roles

1. **Admin (you / your team)** — logged in via Supabase Auth, full CRUD on projects, categories, estimate components, and detail-access requests.
2. **Visitor / Student (public)** — no login required to browse; can view project cards, public summary, and public estimate range; can submit a "request full details" form.
3. **(Optional, Phase 2) Verified Student** — logs in with college email to save favorites / track their own requests.

---

## 4. Core Features

### 4.1 Admin Panel

- **Secure login** (Supabase Auth — email/password, or magic link).
- **Add / Edit / Delete Project**
  - Title, short description, full description
  - Category: *Final Year Major Project* / *Minor Project*
  - Target year: 2nd / 3rd / 4th year
  - Branch/domain tags: e.g. ECE, EEE, CSE, Mechanical, IoT, Embedded, ML/AI, Robotics, Web/App Dev
  - Cover image + gallery (multiple images)
  - Attachments: abstract PDF, block diagram, sample report, demo video link (YouTube/Drive)
  - Components/hardware list (used for estimate calculation, see §4.2)
  - Status: Draft / Published / Sold-out-for-batch
- **Estimate Calculator** (see §4.2 below — flexible, config-driven so you can define your own formula later)
- **Shareable Link Generator**
  - Every project gets a unique public slug (`/projects/smart-irrigation-system-iot`) for the *summary* page.
  - A separate **unique, hard-to-guess token link** (`/full/8f2c1a9d...`) is generated per approved request, showing the **full details** (complete cost breakdown, source code availability, report access, contact terms). This link can be set to expire after N days or after first open, if you want it locked to one student.
- **Requests Inbox**
  - See all "request full details" submissions (student name, phone/email, project, year, branch, timestamp).
  - One click to **Approve & generate link**, then send it via WhatsApp/email directly from the panel.
- **Dashboard**
  - Total projects, most-viewed projects, pending requests, this month's requests.

### 4.2 Estimate Calculator (flexible framework — refine once you share your exact formula)

Since components/costs vary per project, the cleanest approach is a **component-based costing engine** rather than hardcoding one formula:

- Each project stores a list of **cost components**, e.g.:
  | Component | Qty | Unit Cost | Subtotal |
  |---|---|---|---|
  | Arduino Uno | 1 | ₹450 | ₹450 |
  | IoT Sensors | 3 | ₹150 | ₹450 |
  | PCB Fabrication | 1 | ₹800 | ₹800 |
  | Enclosure/Casing | 1 | ₹300 | ₹300 |
- Plus configurable **flat/percentage add-ons**, e.g.:
  - Development/labor charge (flat ₹ or % of hardware cost)
  - Documentation & report charge
  - Testing & demo charge
  - Miscellaneous/contingency %
- Admin enters components once → system auto-computes **Total Estimate**.
- You can define **multiple pricing tiers** per project if needed (e.g. "Basic build" vs "With extra features").
- **Public view** can show only a range or "Starting from ₹X" instead of the full breakdown — full breakdown only unlocks via the shareable token link.
- Because it's config-driven (components × rates + rules), once you tell me your actual formula (e.g. "labor = 20% of hardware cost + ₹500 documentation fee"), I just plug it into this same engine — no rebuild needed.

### 4.3 Student-Facing Site

- **Home page**: intro to Sri Sai Projects, featured/trending projects, quick category links.
- **Browse/Catalog page**: filter by year (2nd/3rd/4th), branch, domain (IoT/ML/Embedded/Web/App/Robotics), search bar.
- **Project card**: image, title, short description, branch tag, "Starting from ₹X" estimate.
- **Project summary page** (public, SEO-indexable): full description, features, tech stack used, image gallery, estimate range, a **"Request Full Details" button**.
- **Request form**: name, phone/WhatsApp, email, college, year, branch — submits to admin inbox.
- **Full detail page** (private, token-linked): complete cost breakdown, components list, deliverables (code, report, PPT, demo), timeline, contact-to-book CTA.
- **Contact / WhatsApp button** on every page for quick queries.
- **Responsive design** — most students will browse on mobile.

### 4.4 Suggested Extra Features (optional, add as needed)

- **Testimonials / past student reviews** with project photos.
- **"How it works" page**: Browse → Request → Get Estimate → Book → Delivery + Support.
- **Blog/updates section** for new project drops each semester (also helps SEO).
- **WhatsApp Business "Click to Chat" integration** for instant queries.
- **Booking status tracker** for students who've paid an advance (Phase 2).
- **Admin analytics**: which branches/domains get most interest, to guide what new projects to build.
- **Bulk import** (CSV) for adding many projects at once each semester.
- **Simple payment link integration** (Razorpay Payment Links — free to set up, small transaction fee only) if you want to collect advance booking amounts online later.

---

## 5. Suggested Database Schema (Supabase/Postgres)

```
projects
  id, slug, title, short_description, full_description,
  category (final_year | minor), target_year, branch_tags[],
  domain_tags[], cover_image_url, gallery[], status,
  created_at, updated_at

project_components
  id, project_id (FK), name, quantity, unit_cost

project_addons
  id, project_id (FK), name, type (flat | percent), value

detail_requests
  id, project_id (FK), student_name, phone, email, college,
  year, status (pending | approved | rejected), created_at

detail_links
  id, project_id (FK), request_id (FK, nullable), token,
  expires_at, opened_at, created_at

admin_users
  (handled by Supabase Auth)
```

---

## 6. Non-Functional Requirements

- **Security**: admin routes protected via Supabase Auth session; detail-link tokens are long random strings (UUID v4), not guessable/sequential.
- **SEO**: project summary pages should be server-rendered (Next.js) with proper titles/meta so they're discoverable on Google — free marketing.
- **Performance**: compress images before upload (keeps you well within Supabase's 1 GB storage).
- **Mobile-first**: majority of student traffic will be mobile.
- **Backups**: Supabase free tier has no automated backups — export your `projects` table to CSV monthly as a manual safety net (2 minutes of work).

---

## 7. Suggested Build Phases

1. **Phase 1 (MVP)**: Project catalog (public), project summary pages, request-details form, admin login + add/edit project, basic estimate (manual entry of total, no component engine yet).
2. **Phase 2**: Component-based estimate calculator, shareable token links, requests inbox with approve/send flow.
3. **Phase 3**: Testimonials, blog, WhatsApp integration, analytics dashboard, bulk CSV import.
4. **Phase 4 (optional)**: Student accounts, payment links, booking tracker.

---

## 8. Keeping Everything Free Long-Term

- Use a free uptime pinger (e.g. **UptimeRobot free tier**, or a scheduled **GitHub Actions** workflow) to ping your Supabase project every few days — keeps it from auto-pausing due to inactivity, at zero cost.
- Stay under Supabase's 500 MB DB / 1 GB storage by compressing images (a few hundred projects with optimized images fits easily).
- Buy only a domain name (~₹500–800/year) when ready to look fully professional — everything else stays free.

---

## 9. What I Need From You Next

- Your exact **estimate formula/logic** (component costs + labor % + documentation charges, etc.) so I configure the calculator engine precisely.
- Agent to send the notification when we receive a request
= Add delivery date in the projects public page for better expierience
- End goal, make the e-commerce space like expierience, browse -> order -> delivery 