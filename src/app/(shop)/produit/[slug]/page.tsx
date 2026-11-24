import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, relatedProducts } from "@/lib/products";
import { ProductView } from "./ProductView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProduct(slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage(props: PageProps<"/produit/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} related={relatedProducts(product)} />;
}
