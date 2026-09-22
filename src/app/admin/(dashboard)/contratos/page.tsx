import { ContractForm } from "@/components/admin/ContractForm";
import { DeleteContractButton } from "@/components/admin/DeleteContractButton";
import { getAllContracts } from "@/lib/storage/contracts";
import { getAllProperties } from "@/lib/storage/properties";
import { CONTRACT_TYPES } from "@/lib/types/contract";
import { formatDate } from "@/lib/property-utils";

export default async function AdminContractsPage() {
  const properties = await getAllProperties(true);

  let contracts: Awaited<ReturnType<typeof getAllContracts>> = [];
  let loadError = "";

  try {
    contracts = await getAllContracts();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar los contratos";
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Contratos
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Guarda los contratos de la agencia. El PDF y los datos del cliente se cifran antes de almacenarse.
      </p>

      <section className="mt-8 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Nuevo contrato
        </h2>
        <ContractForm
          properties={properties.map((property) => ({
            reference: property.reference,
            title: property.title,
          }))}
        />
      </section>

      {loadError ? (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {loadError.includes("contracts")
            ? "Falta la tabla de contratos en Supabase. Ejecuta el archivo supabase/contracts.sql en el SQL Editor."
            : loadError}
        </p>
      ) : (
        <>
        <ul className="mt-8 space-y-3 md:hidden">
          {contracts.length === 0 ? (
            <li className="rounded-lg border border-[var(--color-rule)] px-4 py-6 text-sm text-[var(--color-muted)]">
              Todavía no hay contratos guardados.
            </li>
          ) : (
            contracts.map((contract) => (
              <li key={contract.id} className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
                <p className="font-medium text-[var(--color-ink)]">{contract.title}</p>
                <p className="mt-1 text-sm text-[var(--color-ink-2)]">{CONTRACT_TYPES[contract.type]}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{contract.clientName}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {contract.propertyReference ?? "Sin inmueble"}
                  {contract.signedAt ? ` · ${formatDate(contract.signedAt)}` : ""}
                </p>
                <div className="mt-3 flex gap-4">
                  <a href={`/api/contracts/${contract.id}/file`} className="text-sm text-[var(--color-accent)]">
                    Descargar
                  </a>
                  <DeleteContractButton id={contract.id} />
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="mt-8 hidden overflow-x-auto rounded-lg border border-[var(--color-rule)] md:block">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[var(--color-paper-2)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Inmueble</th>
                <th className="px-4 py-3">Firma</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-[var(--color-muted)]">
                    Todavía no hay contratos guardados.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="border-t border-[var(--color-rule)]">
                    <td className="px-4 py-3 font-medium">{contract.title}</td>
                    <td className="px-4 py-3">{CONTRACT_TYPES[contract.type]}</td>
                    <td className="px-4 py-3">{contract.clientName}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {contract.propertyReference ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {contract.signedAt ? formatDate(contract.signedAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <a
                          href={`/api/contracts/${contract.id}/file`}
                          className="text-[var(--color-accent)] hover:underline"
                        >
                          Descargar
                        </a>
                        <DeleteContractButton id={contract.id} />
                      </div>
                    </td>
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
