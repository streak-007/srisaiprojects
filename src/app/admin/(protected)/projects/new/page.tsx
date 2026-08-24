import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">New project</h1>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
