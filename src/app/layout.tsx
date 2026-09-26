import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SHREYANK CREATION | Handmade Bags, Pouches & Custom Creations",
  description:
    "Discover SHREYANK CREATION for handmade fabric bags, utility pouches, organizers, bookmarks, and customized creations. Made with care and delivered across India.",
  openGraph: {
    title: "SHREYANK CREATION | Handmade Bags, Pouches & Custom Accessories",
    description:
      "Handmade fabric bags, utility pouches, organizers, bookmarks, and bespoke custom creations ordered directly via WhatsApp.",
    siteName: "SHREYANK CREATION",
    locale: "en_IN",
    type: "website",
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
