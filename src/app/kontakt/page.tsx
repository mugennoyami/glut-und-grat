import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt zu Glut & Grat: allgemeine Fragen, Schärfservice und individuelle Anfertigungen.",
};

export default function ContactPage() {
  return <ContactSection heading="h1" />;
}
