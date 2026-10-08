import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Quiero comprar",
};

export default function QuieroComprarPage() {
  return (
    <>
      <PageHero
        title="Quiero comprar"
        subtitle="Encontramos la vivienda que necesitas. Te acompañamos hasta encontrarla."
      />
      <PageContent narrow>
        <ContactForm
          title="Busca tu próximo hogar"
          description="Indícanos qué estás buscando y te ayudaremos a encontrar la propiedad ideal."
          submitLabel="Empezar búsqueda"
        />
      </PageContent>
    </>
  );
}
