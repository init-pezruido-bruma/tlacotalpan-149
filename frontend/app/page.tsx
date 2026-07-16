import { ContactSection, SiteFooter } from "../components/ContactSection";
import { Hero } from "../components/Hero";
import { PageMotion } from "../components/PageMotion";
import { PlaceSection } from "../components/PlaceSection";
import { SiteHeader } from "../components/SiteHeader";
import { SpacesSection } from "../components/SpacesSection";

export default function Home() {
  return (
    <PageMotion>
      <SiteHeader />
      <main>
        <Hero />
        <PlaceSection />
        <SpacesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </PageMotion>
  );
}
