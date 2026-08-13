import type { Brand, Category, Product } from "./types";

export function searchProducts(
  products: Product[],
  brands: Brand[],
  categories: Category[],
  query: string,
): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((product) => {
      const brand = brands.find((b) => b.id === product.brandId)?.name ?? "";
      const category = categories.find((c) => c.slug === product.categorySlug)?.name ?? "";
      const haystack = [
        product.name,
        brand,
        category,
        product.subcategorySlug?.replace(/-/g, " ") ?? "",
        product.description,
        product.sku,
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((sum, term) => (haystack.includes(term) ? sum + 1 : sum), 0);
      return { product, score };
    })
    .filter((r) => r.score === terms.length)
    .sort((a, b) => b.product.rating - a.product.rating)
    .map((r) => r.product);
}

export function suggestTerms(categories: Category[], brands: Brand[], query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pool = [
    ...categories.flatMap((c) => [c.name, ...c.subcategories.map((s) => s.name)]),
    ...brands.map((b) => b.name),
  ];
  return Array.from(new Set(pool.filter((term) => term.toLowerCase().includes(q))));
}