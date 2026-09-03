import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Alquilar",
};

export default function AlquilarPage() {
  return (
    <>
      <PageHero
        title="Alquilar"
        subtitle="Ya seas propietario o inquilino, gestionamos el alquiler de forma integral y profesional."
      />
      <PageContent narrow>
        <ContactForm
          title="Servicios de alquiler"
          description="Cuéntanos si buscas alquilar un inmueble o quieres poner el tuyo en alquiler."
          submitLabel="Contactar"
        />
      </PageContent>
    </>
  );
}
