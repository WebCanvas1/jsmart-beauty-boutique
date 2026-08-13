import { createFileRoute, Link } from "@tanstack/react-router";

import { CATEGORY_IMAGES } from "@/lib/shop/seed";
import { useShop } from "@/lib/shop/store";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Shop All Beauty Collections | Jsmart Beauty" },
      {
        name: "description",
        content:
          "Browse every Jsmart Beauty collection — makeup, skincare, hair care, nails, accessories, new arrivals and sale.",
      },
      { property: "og:title", content: "Shop All Beauty Collections | Jsmart Beauty" },
      {
        property: "og:description",
        content: "Browse every Jsmart Beauty collection, shipped Australia-wide.",
      },
    ],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const { data } = useShop();
  const cards = [
    ...[...data.categories]
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image ?? CATEGORY_IMAGES[c.slug],
        subs: c.subcategories,
      })),
    { name: "New Arrivals", slug: "new-arrivals", image: CATEGORY_IMAGES["new-arrivals"], subs: [] },
    { name: "Best Sellers", slug: "best-sellers", image: CATEGORY_IMAGES["best-sellers"], subs: [] },
    { name: "Sale", slug: "sale", image: CATEGORY_IMAGES["sale"], subs: [] },
  ];

  return (
    <div className="container-x py-12">
      <p className="eyebrow text-primary">Shop</p>
      <h1 className="mt-2 text-4xl md:text-5xl">All Collections</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Explore the full Jsmart Beauty range. All prices in AUD, shipped Australia-wide.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.slug}>
            <Link to="/collections/$slug" params={{ slug: card.slug }} className="group block">
              <div className="overflow-hidden rounded-lg bg-blush">
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="mt-3 text-xl">{card.name}</h2>
            </Link>
            {card.subs.length > 0 && (
              <ul className="mt-2 space-y-1">
                {card.subs.slice(0, 6).map((sub) => (
                  <li key={sub.id}>
                    <Link
                      to="/collections/$slug"
                      params={{ slug: card.slug }}
                      search={{ sub: sub.slug }}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}