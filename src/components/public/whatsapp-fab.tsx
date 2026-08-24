import { whatsappUrl } from "@/lib/constants";

export function WhatsappFab() {
  return (
    <a
      href={whatsappUrl("Hi! I found Sri Sai Projects online and have a quick question.")}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-float fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(18,140,126,0.45)] transition hover:scale-[1.03]"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c4.52 0 8.24 3.72 8.24 8.24 0 4.52-3.72 8.24-8.24 8.24-1.44 0-2.84-.37-4.07-1.07l-.29-.17-3.11.82.83-3.04-.19-.31a8.2 8.2 0 0 1-1.26-4.47c0-4.52 3.72-8.24 8.09-8.24zm4.52 11.77c-.25-.12-1.47-.72-1.7-.8-.22-.09-.39-.12-.55.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74 1.49.64 2.08.7 2.82.59.43-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
      </svg>
      WhatsApp
    </a>
  );
}
