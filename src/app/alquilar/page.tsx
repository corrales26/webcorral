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
        subtitle="Encontramos el Alquiler que necesitas. Nos ocupamos de todo el proceso."
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
