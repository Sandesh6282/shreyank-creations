import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Shreyank Creations | Handmade Indian Handicrafts, Decor & Art",
  description:
    "Explore Shreyank Creations for handmade Indian handicrafts, folk art, blue pottery, wooden jharokhas, brass urlis, and unique home decor crafted with care.",
  openGraph: {
    title: "Shreyank Creations | Handmade Indian Handicrafts & Decor",
    description:
      "Timeless Indian handmade crafts, decor, gifts, and folk paintings created by artisan hands.",
    siteName: "Shreyank Creations",
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
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
