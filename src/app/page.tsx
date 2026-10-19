import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Investors } from "@/components/Investors";
import { Properties } from "@/components/Properties";

export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Properties />
      <Investors />
      <Services />
    </>
  );
}
