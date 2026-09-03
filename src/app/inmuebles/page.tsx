import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { PropertyListing } from "@/components/property/PropertyListing";
import { getAllProperties } from "@/lib/storage/properties";

export const metadata: Metadata = {
  title: "Inmuebles",
};

export const revalidate = 60;

export default async function InmueblesPage() {
  const properties = await getAllProperties();

  return (
    <>
      <PageHero
        title="Inmuebles"
        subtitle="Descubre nuestra selección de propiedades en venta, alquiler y oportunidades de rehabilitación."
      />
      <PageContent>
        <PropertyListing properties={properties} />
      </PageContent>
    </>
  );
}
