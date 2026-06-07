import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import CookieBanner from '@/components/CookieBanner/CookieBanner';
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";

export const metadata = {
  title: 'Llanuras Nueva Generación',
  description: 'Llanuras Nueva Generación',
  icons: {
    icon: '/logo/logosintitulo.png',
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Navbar />
        <main>
          {children}
        </main>

        <CookieBanner />
        <WhatsAppButton />
      </body>
    </html>
  );
}
