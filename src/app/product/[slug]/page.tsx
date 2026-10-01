import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchStorefrontProductBySlug, fetchStorefrontProducts } from "@/services/productService";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested handmade creation could not be found.",
    };
  }

  const title = `${product.name} | SHREYANK CREATION`;
  const description =
    product.shortDescription ||
    product.description ||
    `Shop ${product.name} from SHREYANK CREATION. Handmade with care and delivered across India.`;
  const mainImage = product.images.length > 0 ? product.images[0] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: mainImage ? [{ url: mainImage, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    fetchStorefrontProductBySlug(slug),
    fetchStorefrontProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} allProducts={allProducts} />;
}
