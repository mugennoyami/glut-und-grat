import { WorkshopServices } from "@/components/sections/WorkshopServices";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { ArmorySection, AdventureSection } from "@/components/sections/ArmorySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ArmorySection />
      <AdventureSection />
      <WorkshopServices />
      <FaqSection />
      <ContactSection />
    </>
  );
}
