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

  // Compute dynamic category counts from live database products
  const categoryCounts: Record<string, number> = {};
  for (const product of allProducts) {
    if (product.categorySlug) {
      categoryCounts[product.categorySlug] = (categoryCounts[product.categorySlug] || 0) + 1;
    }
  }

  return (
    <div className="space-y-0">
      <Hero />
      <FeaturedCategories categoryCounts={categoryCounts} />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory />
      <EditorialBanner />
      <BestSellers products={bestsellerProducts} />
      <WhyChooseUs />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}
