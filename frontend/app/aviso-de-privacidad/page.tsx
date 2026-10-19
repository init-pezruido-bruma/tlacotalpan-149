import type { Metadata } from "next";
import { SiteFooter } from "../../components/ContactSection";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { ReleasePageBoot } from "../../components/ReleasePageBoot";
import { privacy, site } from "../../content";

export const metadata: Metadata = {
  title: `${privacy.title} — ${site.brand}`,
  description: privacy.metaDescription,
};

export default function PrivacyPage() {
  return (
    <div className="page-static flex min-h-full flex-col">
      <ReleasePageBoot />
      <PrivacyNotice />
      <SiteFooter />
    </div>
  );
}
