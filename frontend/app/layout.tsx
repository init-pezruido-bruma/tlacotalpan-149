import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { site } from "../content";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plexMono.variable} page-booting h-full antialiased`}
      aria-busy="true"
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <noscript>
          <style>{`
            html.page-booting, html.page-booting body {
              overflow: auto !important;
              touch-action: auto;
            }
            .hero-brand, .hero-headline, .hero-support, .hero-cta, .hero-plan, .reveal {
              opacity: 1 !important;
              transform: none !important;
              visibility: visible !important;
            }
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
