import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, PageContent } from "@/components/PageLayout";
import { PropertyListing } from "@/components/property/PropertyListing";
import { getAllProperties } from "@/lib/storage/properties";

export const metadata: Metadata = {
  title: "Inmuebles",
  description:
    "Viviendas en venta, alquiler y para rehabilitar. Selección actual de Corral Business en Cantabria.",
};

export const revalidate = 0;

export default async function InmueblesPage() {
  const properties = await getAllProperties();

  return (
    <>
      <PageHero
        title="Inmuebles"
        subtitle="Descubre nuestra selección de propiedades en venta, alquiler y oportunidades de rehabilitación."
      />
      <PageContent>
        <Suspense>
          <PropertyListing properties={properties} />
        </Suspense>
      </PageContent>
    </>
  );
}
