import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/ProductCard";
import { collectionProducts, sortProducts } from "@/lib/shop/collections";
import { CATEGORY_IMAGES } from "@/lib/shop/seed";
import { useShop } from "@/lib/shop/store";
import type { PromoBanner } from "@/lib/shop/types";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://jsmartbeauty.com.au/" }],
    meta: [
      { title: "Jsmart Beauty | Australian Cosmetics, Makeup & Skincare Online" },
      {
        name: "description",
        content:
          "Discover makeup, skincare, hair care and beauty essentials at Jsmart Beauty. Shipped Australia-wide, free over $75. Prices in AUD.",
      },
      { property: "og:title", content: "Jsmart Beauty | Australian Beauty Online" },
      {
        property: "og:description",
        content: "Makeup, skincare and beauty essentials selected for every style.",
      },
    ],
  }),
  component: Home,
});

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="eyebrow mb-2 text-primary">{eyebrow}</p>}
        <h2 className="text-3xl md:text-4xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link to={href} className="text-sm underline underline-offset-4 hover:text-primary">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function Banner({ banner }: { banner: PromoBanner }) {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <img
        src={banner.image}
        alt={banner.title}
        loading="lazy"
        width={1600}
        height={800}
        className="h-[280px] w-full object-cover md:h-[360px]"
      />
      <div
        className={`absolute inset-0 flex items-center ${
          banner.align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <div className="m-6 max-w-sm rounded-lg bg-background/85 p-6 backdrop-blur-sm md:m-12">
          <h3 className="text-2xl md:text-3xl">{banner.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{banner.subtitle}</p>
          <Button asChild className="mt-4">
            <a href={banner.ctaHref}>{banner.ctaLabel}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data, activeProducts } = useShop();
  const { homepage } = data;

  const featured = sortProducts(
    activeProducts.filter((p) => p.featured),
    "featured",
  ).slice(0, 10);
  const newArrivals = sortProducts(collectionProducts("new-arrivals", data.products), "newest").slice(
    0,
    5,
  );
  const bestSellers = sortProducts(
    collectionProducts("best-sellers", data.products),
    "best-selling",
  ).slice(0, 5);

  const categoryCards = [
    ...[...data.categories]
      .sort((a, b) => a.position - b.position)
      .map((c) => ({ name: c.name, slug: c.slug, image: c.image ?? CATEGORY_IMAGES[c.slug] })),
    { name: "New Arrivals", slug: "new-arrivals", image: CATEGORY_IMAGES["new-arrivals"] },
    { name: "Best Sellers", slug: "best-sellers", image: CATEGORY_IMAGES["best-sellers"] },
    { name: "Sale", slug: "sale", image: CATEGORY_IMAGES["sale"] },
  ];

  return (
    <>
      <section className="relative">
        <img
          src={homepage.heroImage}
          alt="Jsmart Beauty cosmetics collection"
          width={1600}
          height={1000}
          fetchPriority="high"
          className="h-[62vh] min-h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0">
          <div className="container-x flex h-full items-center">
            <div className="max-w-lg rounded-xl bg-background/80 p-8 backdrop-blur-sm md:p-10">
              <p className="eyebrow text-primary">Australian Beauty</p>
              <h1 className="mt-3 text-4xl leading-tight md:text-6xl">{homepage.heroTitle}</h1>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                {homepage.heroSubtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={homepage.heroPrimaryHref}>{homepage.heroPrimaryLabel}</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={homepage.heroSecondaryHref}>{homepage.heroSecondaryLabel}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Shop by category" title="Find your beauty edit" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {categoryCards.map((card) => (
            <Link
              key={card.slug}
              to="/collections/$slug"
              params={{ slug: card.slug }}
              className="group"
            >
              <div className="overflow-hidden rounded-lg bg-blush">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm font-medium">{card.name}</p>
              <p className="text-xs text-primary underline-offset-4 group-hover:underline">
                Shop Now
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <SectionHeading
          eyebrow="Loved right now"
          title="Trending at Jsmart Beauty"
          href="/collections/all"
          linkLabel="Shop all products"
        />
        <ProductGrid products={featured} />
      </section>

      {homepage.banners[0] && (
        <div className="container-x pb-16">
          <Banner banner={homepage.banners[0]} />
        </div>
      )}

      <section className="container-x pb-16">
        <SectionHeading eyebrow="New in" title="Just Landed" />
        <ProductGrid products={newArrivals} />
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/collections/$slug" params={{ slug: "new-arrivals" }}>
              View All New Arrivals
            </Link>
          </Button>
        </div>
      </section>

      {homepage.banners[1] && (
        <div className="container-x pb-16">
          <Banner banner={homepage.banners[1]} />
        </div>
      )}

      <section className="container-x pb-16">
        <SectionHeading
          eyebrow="Customer favourites"
          title="Jsmart Beauty Best Sellers"
          href="/collections/best-sellers"
          linkLabel="View all"
        />
        <ProductGrid products={bestSellers} />
      </section>

      <section className="container-x pb-16">
        <SectionHeading eyebrow="Shop by brand" title="Brands we stock" href="/brands" linkLabel="All brands" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          {data.brands.map((brand) => (
            <Link
              key={brand.id}
              to="/brands/$slug"
              params={{ slug: brand.slug }}
              className="grid h-24 place-items-center rounded-lg border bg-card px-3 text-center text-sm transition hover:border-primary hover:text-primary"
            >
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} loading="lazy" className="max-h-12" />
              ) : (
                <span className="wordmark text-base">{brand.name}</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {homepage.banners[2] && (
        <div className="container-x pb-8">
          <Banner banner={homepage.banners[2]} />
        </div>
      )}
    </>
  );
}
