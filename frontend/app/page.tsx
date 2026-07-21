import { CompareSection } from "../components/CompareSection";
import { ContactSection, SiteFooter } from "../components/ContactSection";
import { Hero } from "../components/Hero";
import { IntroSection } from "../components/IntroSection";
import { IsometricSection } from "../components/IsometricSection";
import { PageMotion } from "../components/PageMotion";
import { PlaceSection } from "../components/PlaceSection";
import { PlansSection } from "../components/PlansSection";
import { ProgressSection } from "../components/ProgressSection";
import { Renders360Section } from "../components/Renders360Section";
import { SiteHeader } from "../components/SiteHeader";

export default function Home() {
  return (
    <PageMotion>
      <SiteHeader />
      <main>
        <Hero />
        <IntroSection />
        <PlaceSection />
        <PlansSection />
        <ProgressSection />
        <IsometricSection />
        <Renders360Section />
        <CompareSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </PageMotion>
  );
}
