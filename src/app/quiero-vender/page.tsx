import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Quiero vender",
};

export default function QuieroVenderPage() {
  return (
    <>
      <PageHero
        title="Quiero vender"
        subtitle="Convertimos tu vivienda en una Oportunidad."
      />
      <PageContent narrow>
        <ContactForm
          title="Vende tu inmueble con nosotros"
          description="Cuéntanos sobre tu propiedad y te prepararemos una estrategia de venta adaptada a tus necesidades."
          submitLabel="Solicitar valoración"
        />
      </PageContent>
    </>
  );
}
