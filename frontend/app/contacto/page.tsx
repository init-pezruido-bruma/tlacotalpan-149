import type { Metadata } from "next";
import { ContactPage, SiteFooter } from "../../components/ContactSection";
import { contact, site } from "../../content";

export const metadata: Metadata = {
  title: `${contact.headline} — ${site.brand}`,
  description: contact.metaDescription,
};

export default function ContactRoute() {
  return (
    <div className="page-static flex min-h-full flex-col">
      <ContactPage />
      <SiteFooter />
    </div>
  );
}
