export const SITE_NAME = "Sri Sai Projects";

export const BRANCH_TAGS = [
  "ECE",
  "EEE",
  "CSE",
  "Mechanical",
] as const;

export const DOMAIN_TAGS = [
  "IoT",
  "Embedded",
  "ML/AI",
  "Robotics",
  "Web/App Dev",
] as const;

export const TARGET_YEARS = [2, 3, 4] as const;

export const PROJECT_CATEGORIES = [
  { value: "final_year", label: "Final Year Major Project" },
  { value: "minor", label: "Minor Project" },
] as const;

export const PROJECT_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "sold_out", label: "Sold out for batch" },
] as const;

export function whatsappUrl(message?: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";
  return `https://wa.me/${number}${text}`;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
