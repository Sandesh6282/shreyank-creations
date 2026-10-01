import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shreyankcreations.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SHREYANK CREATION | Handmade Bags, Pouches & Custom Creations",
    template: "%s | SHREYANK CREATION",
  },
  description:
    "SHREYANK CREATION offers handmade fabric bags, pouches, organizers, traditional creations, gift sets, and customized handmade products, with delivery across India and direct WhatsApp ordering.",
  keywords: [
    "SHREYANK CREATION",
    "Handmade Bags",
    "Pouches & Organizers",
    "Traditional & Festive",
    "Gift Sets",
    "Customized Creations",
    "Handmade Fabric Bags",
    "WhatsApp Ordering",
    "Handmade India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SHREYANK CREATION | Handmade Bags, Pouches & Custom Creations",
    description:
      "SHREYANK CREATION offers handmade fabric bags, pouches, organizers, traditional creations, gift sets, and customized handmade products, with delivery across India and direct WhatsApp ordering.",
    url: baseUrl,
    siteName: "SHREYANK CREATION",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHREYANK CREATION | Handmade Bags, Pouches & Custom Creations",
    description:
      "SHREYANK CREATION offers handmade fabric bags, pouches, organizers, traditional creations, gift sets, and customized handmade products, with delivery across India and direct WhatsApp ordering.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-espresso antialiased min-h-screen flex flex-col selection:bg-terracotta/20 selection:text-terracotta">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
