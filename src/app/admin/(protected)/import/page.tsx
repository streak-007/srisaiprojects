import { redirect } from "next/navigation";

export const metadata = {
  title: "CSV import",
};

export default function ImportPage() {
  redirect("/admin/projects");
}
