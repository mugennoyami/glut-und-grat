import { ContactSection } from "@/components/sections/ContactSection";
import { CustomSection } from "@/components/sections/CustomSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { KnivesSection } from "@/components/sections/KnivesSection";
import { SharpeningSection } from "@/components/sections/SharpeningSection";
import { WorkshopSection } from "@/components/sections/WorkshopSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <KnivesSection />
      <SharpeningSection />
      <CustomSection />
      <WorkshopSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
