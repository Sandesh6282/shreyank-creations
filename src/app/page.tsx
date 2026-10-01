import { fetchStorefrontProducts } from "@/services/productService";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SocialGallery } from "@/components/home/SocialGallery";
import { Newsletter } from "@/components/home/Newsletter";

export const revalidate = 60; // Revalidate database cache every 60 seconds

export default async function HomePage() {
  const [allProducts, featuredProducts, bestsellerProducts] = await Promise.all([
    fetchStorefrontProducts(),
    fetchStorefrontProducts({ featuredOnly: true }),
    fetchStorefrontProducts({ bestsellerOnly: true }),
  ]);

  return (
    <div className="space-y-0">
      <Hero products={allProducts} />
      <FeaturedCategories />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory products={allProducts} />
      <EditorialBanner products={allProducts} />
      <BestSellers products={bestsellerProducts} />
      <WhyChooseUs />
      <SocialGallery products={allProducts} />
      <Newsletter />
    </div>
  );
}
