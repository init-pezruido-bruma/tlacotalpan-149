import { CompareSection } from "../components/CompareSection";
import { SiteFooter } from "../components/ContactSection";
import { FacadeSection } from "../components/FacadeSection";
import { Hero } from "../components/Hero";
import { IntroSection } from "../components/IntroSection";
import { UnitExploreSection } from "../components/UnitExploreSection";
import { PageMotion } from "../components/PageMotion";
import { PlaceSection } from "../components/PlaceSection";
import { PlansSection } from "../components/PlansSection";
import { ProgressSection } from "../components/ProgressSection";
import { SiteHeader } from "../components/SiteHeader";

export default function Home() {
  return (
    <PageMotion>
      <SiteHeader />
      <main id="contenido-principal">
        <Hero />
        <IntroSection />
        <PlaceSection />
        <PlansSection />
        <FacadeSection />
        <UnitExploreSection />
        <CompareSection />
        <ProgressSection />
        {/* <ContactSection /> */}
      </main>
      <SiteFooter />
    </PageMotion>
  );
}
