import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Nuevo inmueble
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Completa la información para publicar un nuevo inmueble.
      </p>
      <div className="mt-8">
        <PropertyForm mode="create" />
      </div>
    </div>
  );
}
