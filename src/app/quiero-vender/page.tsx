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
        subtitle="Te ayudamos a vender tu propiedad al mejor precio con un proceso transparente y personalizado."
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
