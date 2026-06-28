import { Hero } from "@/components/Hero";
import { Awareness } from "@/components/Awareness";
import { HipoksiaDanger } from "@/components/HipoksiaDanger";
import { NanoBubbleExplainer } from "@/components/NanoBubbleExplainer";
import { FiveXModule } from "@/components/FiveXModule";
import { Benefits } from "@/components/Benefits";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Credibility } from "@/components/Credibility";
import { Testimonials } from "@/components/Testimonials";
import { ResellerStrip } from "@/components/ResellerStrip";
import { Kemitraan } from "@/components/Kemitraan";
import { Footer } from "@/components/Footer";
import { StickyNav } from "@/components/StickyNav";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SectionTracker } from "@/components/ui/SectionTracker";
import { WHATSAPP_NUMBER, PRINCIPAL, TERRITORY } from "@/lib/config";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "anana Super Oksigen",
      description:
        "Air minum berkadar oksigen tinggi dengan teknologi Nano Oxy Bubble™. Partikel oksigen 60-100nm untuk absorpsi selular yang optimal.",
      brand: { "@type": "Brand", name: "anana Super Oksigen" },
      manufacturer: { "@type": "Organization", name: PRINCIPAL.entity, url: PRINCIPAL.site },
    },
    {
      "@type": "Organization",
      name: PRINCIPAL.entity,
      url: PRINCIPAL.site,
    },
    {
      "@type": "LocalBusiness",
      name: "Distributor Resmi anana Super Oksigen",
      description: `Distributor Resmi anana Super Oksigen melayani ${TERRITORY}`,
      telephone: `+${WHATSAPP_NUMBER}`,
      areaServed: TERRITORY,
      sameAs: [
        "https://instagram.com/anana.superoksigen_distributor",
        "https://www.tiktok.com/@anana.superoksigen_distributor",
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Funnel section trackers */}
      <SectionTracker sectionId="awareness" source="awareness" />
      <SectionTracker sectionId="manfaat" source="manfaat" />
      <SectionTracker sectionId="testimoni" source="testimoni" />
      <SectionTracker sectionId="kemitraan" source="kemitraan" />
      <StickyNav />
      <main id="main-content">
        <Hero />
        <Awareness />
        <HipoksiaDanger />
        <NanoBubbleExplainer />
        <FiveXModule />
        <Benefits />
        <FeatureGrid />
        <Credibility />
        <Testimonials />
        <ResellerStrip />
        <Kemitraan />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
