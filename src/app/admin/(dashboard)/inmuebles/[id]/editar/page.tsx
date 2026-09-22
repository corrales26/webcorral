import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { getPropertyById } from "@/lib/storage/properties";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Editar inmueble
      </h1>
      <p className="mt-2 break-words text-[var(--color-muted)]">
        {property.reference} — {property.title}
      </p>
      <div className="mt-8">
        <PropertyForm mode="edit" initialData={property} />
      </div>
    </div>
  );
}
