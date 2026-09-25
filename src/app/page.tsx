import { fetchStorefrontProducts } from "@/services/productService";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { SocialGallery } from "@/components/home/SocialGallery";
import { Newsletter } from "@/components/home/Newsletter";

export const revalidate = 60; // Revalidate database cache every 60 seconds

export default async function HomePage() {
  const featuredProducts = await fetchStorefrontProducts({ featuredOnly: true });
  const bestsellerProducts = await fetchStorefrontProducts({ bestsellerOnly: true });

  return (
    <div className="space-y-0">
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory />
      <EditorialBanner />
      <BestSellers products={bestsellerProducts} />
      <WhyChooseUs />
      <Testimonials />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}
