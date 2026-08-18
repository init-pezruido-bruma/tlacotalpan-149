import type { Metadata } from "next";
import { SiteFooter } from "../../components/ContactSection";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { privacy, site } from "../../content";

export const metadata: Metadata = {
  title: `${privacy.title} — ${site.brand}`,
  description: privacy.metaDescription,
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <PrivacyNotice />
      <SiteFooter />
    </div>
  );
}
