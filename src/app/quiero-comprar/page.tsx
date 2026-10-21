import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Quiero comprar",
  description:
    "Buscamos, negociamos. Tú decides. Localizamos oportunidades inmobiliarias y defendemos tus intereses para que compres con confianza.",
};

export default function QuieroComprarPage() {
  return (
    <>
      <PageHero
        title="Buscamos, negociamos. Tú decides."
        subtitle="Localizamos oportunidades inmobiliarias y defendemos tus intereses para que compres con confianza."
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
