import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Valoración gratuita",
  description:
    "Conoce el valor real de tu inmueble sin compromiso. Te asesoramos con transparencia y un análisis del mercado.",
};

export default function ValoracionPage() {
  return (
    <>
      <PageHero
        title="Valoración gratuita"
        subtitle="Conoce el valor real de tu inmueble sin compromiso. Nuestros expertos te asesorarán con total transparencia."
      />
      <PageContent narrow>
        <ContactForm
          title="Solicita tu valoración"
          description="Indícanos los datos de tu propiedad y te contactaremos para concertar una valoración profesional gratuita."
          submitLabel="Solicitar valoración"
        />
      </PageContent>
    </>
  );
}
