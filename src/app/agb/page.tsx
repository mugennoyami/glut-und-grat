import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { legalPages } from "@/content/pages";

const page = legalPages.agb;

export const metadata: Metadata = { title: page.title, description: page.description };

export default function Page() {
  return <LegalPage title={page.title} needed={page.needed} facts={page.facts} />;
}
