import { PropertyMedia } from "@/components/media/PropertyMedia";
import { getCollaboratorFeed } from "@/lib/storage/submissions";
import { formatDate } from "@/lib/property-utils";

export default async function AdminCollaborationsPage() {
  let feed: Awaited<ReturnType<typeof getCollaboratorFeed>> = [];
  let loadError = "";

  try {
    feed = await getCollaboratorFeed();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar las colaboraciones";
  }

  const withSubmissions = feed.filter((item) => item.submissions.length > 0);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Colaboraciones
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Fotos, vídeos y textos enviados por los colaboradores.
      </p>

      {loadError ? (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {loadError.includes("access_grants") || loadError.includes("collaborator_submissions")
            ? "Falta la configuración de accesos. Ejecuta supabase/access.sql en el SQL Editor de Supabase."
            : loadError}
        </p>
      ) : withSubmissions.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-muted)]">
          Todavía no hay envíos.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {withSubmissions.map(({ collaborator, submissions }) => (
            <section
              key={collaborator.id}
              className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
                {collaborator.name}
              </h2>
              <p className="mt-1 break-all text-sm text-[var(--color-muted)]">{collaborator.email}</p>
              <div className="mt-4 space-y-6">
                {submissions.map((submission) => (
                  <article key={submission.id} className="border-t border-[var(--color-rule)] pt-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                      {formatDate(submission.createdAt)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--color-ink-2)]">
                      {submission.body}
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
                      {submission.images.map((image) => (
                        <PropertyMedia
                          key={image.id}
                          src={`/api/colaboraciones/imagen/${image.id}`}
                          alt=""
                          contentType={image.contentType}
                          controls
                          className="aspect-[4/3] w-full rounded-md object-cover"
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
