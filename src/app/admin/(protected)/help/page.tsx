import Link from "next/link";

export const metadata = {
  title: "Admin help",
};

const sections = [
  {
    id: "login",
    title: "Sign in",
    body: (
      <>
        <p>
          Open <Link href="/admin/login">Admin login</Link> (or <strong>Login</strong> on the public
          site). Use the email and password created in Supabase Auth. Student accounts are not enabled
          yet — Login is for admins only.
        </p>
      </>
    ),
  },
  {
    id: "dashboard",
    title: "Dashboard",
    body: (
      <>
        <p>
          The home of the panel. You will see total projects, how many are published, and how many
          detail requests are still pending. Use it as a daily checklist: add projects, then clear the
          inbox.
        </p>
      </>
    ),
  },
  {
    id: "projects",
    title: "Projects (add, edit, delete)",
    body: (
      <>
        <p>
          <Link href="/admin/projects">Projects</Link> lists everything in the catalog.{" "}
          <strong>New project</strong> opens a full form.
        </p>
        <ul>
          <li>
            <strong>Status:</strong> Draft stays off the public site. Published appears in Browse.
            Sold out still shows if published rules allow — use it when a batch is closed.
          </li>
          <li>
            <strong>Category & year:</strong> Final year vs minor, and target year 2 / 3 / 4. These
            drive catalog filters.
          </li>
          <li>
            <strong>Tags:</strong> Branch (ECE, CSE, …) and domain (IoT, ML/AI, …). Students filter
            with these.
          </li>
          <li>
            <strong>Featured:</strong> Puts the project on the home page “this season” row (max a few
            at a time works best).
          </li>
          <li>
            <strong>Images:</strong> Upload a cover and gallery from your computer. Files go to
            Supabase Storage. Do not paste random URLs unless you already host the image.
          </li>
          <li>
            <strong>Estimate calculator:</strong> Add hardware rows (name, qty, unit cost) plus
            add-ons as a flat rupee amount or a percent of hardware. The public card only shows
            “Starting from ₹…”. The full table is on the private link.
          </li>
          <li>
            <strong>Delete:</strong> Removes the project and related components. Confirm before you
            click — this cannot be undone.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "share",
    title: "Share project details (private link)",
    body: (
      <>
        <p>
          On the project list or edit page, click <strong>Share project details</strong>. The app
          creates a hard-to-guess link like <code>/full/…</code>, copies a WhatsApp-ready message
          (title, starting estimate, URL), and opens share / WhatsApp.
        </p>
        <p>
          Anyone with that link sees the full cost breakdown, deliverables, and a book-on-WhatsApp
          button. The public project page never shows the line-item estimate.
        </p>
        <p>
          You can also approve a student request in the inbox — that creates a link tied to that
          student and opens WhatsApp to send it.
        </p>
      </>
    ),
  },
  {
    id: "requests",
    title: "Requests inbox",
    body: (
      <>
        <p>
          When a student clicks <strong>Request full details</strong> on a project page, the form
          lands in <Link href="/admin/requests">Requests</Link>. Review name, college, year, and
          contact.
        </p>
        <ul>
          <li>
            <strong>Approve & link:</strong> Marks the request approved, generates a private link,
            copies it, and opens WhatsApp with a message to that student.
          </li>
          <li>
            <strong>Reject:</strong> Closes the request if it is spam or a duplicate.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "reviews",
    title: "Reviews (moderation)",
    body: (
      <>
        <p>
          Students submit reviews at{" "}
          <Link href="/feedback">/feedback</Link>. Those land in{" "}
          <Link href="/admin/reviews">Reviews</Link> as <strong>Pending</strong> and never show on
          Stories until you click <strong>Approve</strong>.
        </p>
        <ul>
          <li>
            <strong>Approve:</strong> Publishes the review on the public Stories page.
          </li>
          <li>
            <strong>Unpublish:</strong> Takes a live review down without deleting it.
          </li>
          <li>
            <strong>Edit / Add:</strong> Fix typos or add a review you collected in person. Tick
            Published if it should go live immediately.
          </li>
          <li>
            <strong>Delete:</strong> Removes the review permanently.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "import",
    title: "CSV import",
    body: (
      <>
        <p>
          Use <Link href="/admin/import">CSV import</Link> for a new semester batch. Download the
          sample CSV so the header row matches exactly.
        </p>
        <p>
          Tags and lists (branches, domains, features, tech stack, deliverables) use a pipe{" "}
          <code>|</code>, for example <code>ECE|EEE</code>.
        </p>
        <p>
          <strong>Images are not imported from the spreadsheet.</strong> After the upload succeeds,
          open each project and upload cover + gallery photos. You may fill{" "}
          <code>cover_image_url</code> only if the image is already on a public URL.
        </p>
        <p>
          Leave new rows as <code>draft</code>, review them, add estimates and photos, then switch
          status to <code>published</code>.
        </p>
      </>
    ),
  },
  {
    id: "public",
    title: "What students see",
    body: (
      <>
        <ul>
          <li>
            <strong>Home:</strong> Brand hero, featured projects, domain shortcuts.
          </li>
          <li>
            <strong>Browse:</strong> Search plus year / branch / domain filters (the URL is
            shareable).
          </li>
          <li>
            <strong>Project page:</strong> Description, gallery, public “starting from” price, and
            the request form.
          </li>
          <li>
            <strong>How it works / Stories:</strong> Explains the flow and shows approved reviews only.
          </li>
          <li>
            <strong>Leave a review:</strong> After delivery, students submit feedback at{" "}
            <code>/feedback</code>. It stays hidden until you approve it in Admin → Reviews.
          </li>
          <li>
            <strong>WhatsApp:</strong> Floating button on public pages uses the number in{" "}
            <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "tips",
    title: "Effective daily workflow",
    body: (
      <>
        <ol>
          <li>Import or create drafts for the new batch.</li>
          <li>Edit each draft: photos, component list, add-ons, public starting price.</li>
          <li>Publish only when the summary looks good on a phone.</li>
          <li>Check Requests and Reviews every day; approve genuine student feedback.</li>
          <li>
            Use <Link href="/admin/analytics">Analytics</Link> plus the inbox to see which domains
            get interest, then build the next set of kits around that.
          </li>
        </ol>
      </>
    ),
  },
];

export default function AdminHelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">How to use this admin panel</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Short guide for anyone who will add projects, answer student requests, or share private
        estimates. Bookmark this page.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="chip !no-underline">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6 [&_a]:font-semibold [&_a]:text-teal [&_code]:rounded [&_code]:bg-paper [&_code]:px-1 [&_code]:text-xs [&_li]:mt-2 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-ink-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
          >
            <h2 className="font-display text-xl font-bold text-ink">{s.title}</h2>
            <div className="mt-3">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
