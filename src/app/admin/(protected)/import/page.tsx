import { CsvImportForm } from "@/components/admin/csv-import-form";

export const metadata = {
  title: "CSV import",
};

export default function ImportPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-extrabold">CSV bulk import</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Add a semester of projects in one upload. Photos and the component-level estimate are added on
        each project’s edit page afterward.
      </p>
      <div className="mt-6">
        <CsvImportForm />
      </div>
    </div>
  );
}
