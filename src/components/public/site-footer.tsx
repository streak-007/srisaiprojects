import Link from "next/link";
import { SITE_NAME, whatsappUrl } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/80 bg-[rgba(255,255,255,0.55)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">{SITE_NAME}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            Final-year and minor engineering projects with clear estimates, guided delivery, and viva-ready docs.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Explore</p>
          <ul className="mt-3 space-y-2 text-sm font-medium">
            <li><Link href="/projects" className="hover:text-teal">Project catalog</Link></li>
            <li><Link href="/how-it-works" className="hover:text-teal">How it works</Link></li>
            <li><Link href="/testimonials" className="hover:text-teal">Student stories</Link></li>
            <li><Link href="/feedback" className="hover:text-teal">Leave a review</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">Talk to us</p>
          <a
            href={whatsappUrl("Hi Sri Sai Projects — I want help choosing a project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-teal hover:text-teal-deep"
          >
            WhatsApp chat →
          </a>
          <p className="mt-6 text-xs text-ink-muted">© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
