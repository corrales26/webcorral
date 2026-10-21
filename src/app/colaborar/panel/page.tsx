import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CollaboratorForm } from "@/components/colaborar/CollaboratorForm";
import { CollaboratorLogoutButton } from "@/components/colaborar/CollaboratorLogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { findCollaboratorById } from "@/lib/access";
import { getCollaboratorId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel de colaboración",
  robots: { index: false, follow: false },
};

export default async function CollaboratorPanelPage() {
  const collaboratorId = await getCollaboratorId();
  if (!collaboratorId) redirect("/colaborar");

  const collaborator = await findCollaboratorById(collaboratorId);
  if (!collaborator) redirect("/colaborar");

  return (
    <div className="min-h-screen bg-[var(--color-paper)] px-4 py-10">
      <div className="absolute right-4 top-4 flex items-center gap-4">
        <CollaboratorLogoutButton />
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-xl">
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Corral Business
        </p>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-ink)]">
          {collaborator.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{collaborator.email}</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Sube fotos, vídeos y texto. Solo el administrador puede verlos.
        </p>
        <section className="mt-8 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6">
          <CollaboratorForm />
        </section>
      </div>
    </div>
  );
}
