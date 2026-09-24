import { InviteCollaboratorForm } from "@/components/admin/InviteCollaboratorForm";
import { listCollaborators } from "@/lib/access";

export default async function AdminInvitationsPage() {
  let collaborators: Awaited<ReturnType<typeof listCollaborators>> = [];
  let loadError = "";

  try {
    collaborators = await listCollaborators();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar las invitaciones";
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Invitaciones
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Invita colaboradores por correo. Ellos entran en /colaborar con ese correo y solo pueden subir fotos, vídeos y texto.
      </p>

      <section className="mt-8 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Invitar colaborador
        </h2>
        <InviteCollaboratorForm />
      </section>

      {loadError ? (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {loadError.includes("access_grants")
            ? "Falta la configuración de accesos. Ejecuta supabase/access.sql en el SQL Editor de Supabase."
            : loadError}
        </p>
      ) : (
        <>
        <ul className="mt-8 space-y-3 md:hidden">
          {collaborators.length === 0 ? (
            <li className="rounded-lg border border-[var(--color-rule)] px-4 py-6 text-sm text-[var(--color-muted)]">
              Todavía no hay invitaciones.
            </li>
          ) : (
            collaborators.map((collaborator) => (
              <li key={collaborator.id} className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
                <p className="font-medium text-[var(--color-ink)]">{collaborator.name}</p>
                <p className="mt-1 break-all text-sm text-[var(--color-muted)]">{collaborator.email}</p>
              </li>
            ))
          )}
        </ul>

        <div className="mt-8 hidden overflow-x-auto rounded-lg border border-[var(--color-rule)] md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-paper-2)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-[var(--color-muted)]">
                    Todavía no hay invitaciones.
                  </td>
                </tr>
              ) : (
                collaborators.map((collaborator) => (
                  <tr key={collaborator.id} className="border-t border-[var(--color-rule)]">
                    <td className="px-4 py-3 font-medium">{collaborator.name}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{collaborator.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
