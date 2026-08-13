import type { Category, Product } from "./types";

export interface CollectionMeta {
  slug: string;
  title: string;
  description: string;
  image?: string | undefined;
  category?: Category | undefined;
}

export const VIRTUAL_COLLECTIONS: Record<string, { title: string; description: string }> = {
  all: { title: "Shop All", description: "Every beauty product available at Jsmart Beauty." },
  "new-arrivals": {
    title: "New Arrivals",
    description: "The latest beauty products to land at Jsmart Beauty.",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "The products our customers reach for again and again.",
  },
  sale: { title: "Sale", description: "Your favourite beauty products for less." },
};

export function resolveCollection(slug: string, categories: Category[]): CollectionMeta | null {
  const category = categories.find((c) => c.slug === slug);
  if (category) {
    return {
      slug,
      title: category.name,
      description: `Shop ${category.name.toLowerCase()} at Jsmart Beauty. Delivered Australia-wide.`,
      image: category.image,
      category,
    };
  }
  const virtual = VIRTUAL_COLLECTIONS[slug];
  if (virtual) return { slug, title: virtual.title, description: virtual.description };
  return null;
}

export function collectionProducts(slug: string, products: Product[]): Product[] {
  const active = products.filter((p) => p.status === "active");
  switch (slug) {
    case "all":
      return active;
    case "new-arrivals":
      return active.filter((p) => p.newArrival);
    case "best-sellers":
      return active.filter((p) => p.bestSeller);
    case "sale":
      return active.filter((p) => p.salePrice != null);
    default:
      return active.filter((p) => p.categorySlug === slug);
  }
}

export type SortKey = "featured" | "best-selling" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const price = (p: Product) => p.salePrice ?? p.price;
  const copy = [...products];
  switch (sort) {
    case "best-selling":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return copy.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "price-asc":
      return copy.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return copy.sort((a, b) => price(b) - price(a));
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export const inStock = (p: Product) => p.stock > 0 || p.backordersEnabled;