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
        title="Convertimos tu vivienda en una oportunidad"
        subtitle="Te acompañamos en todo el proceso de venta, con una estrategia y adaptada a tu inmueble sin complicaciones ni ataduras."
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
