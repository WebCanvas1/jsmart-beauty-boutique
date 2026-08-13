import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shop/StarRating";
import { formatAUD, percentOff } from "@/lib/shop/format";
import { useShop } from "@/lib/shop/store";
import { useUI } from "@/lib/shop/ui";
import type { Product } from "@/lib/shop/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { brandById, addToCart, toggleWishlist, session } = useShop();
  const { setCartOpen } = useUI();
  const brand = brandById(product.brandId);
  const price = product.salePrice ?? product.price;
  const wishlisted = session.wishlist.includes(product.id);
  const soldOut = product.stock <= 0 && !product.backordersEnabled;
  const hasVariants = product.variants.length > 0;

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-lg bg-blush">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          aria-label={product.name}
          className="block"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1100}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.salePrice != null && (
            <span className="eyebrow rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
              Save {percentOff(product.price, product.salePrice)}%
            </span>
          )}
          {product.newArrival && (
            <span className="eyebrow rounded-full bg-card px-2.5 py-1 text-foreground shadow-sm">
              New
            </span>
          )}
          {product.bestSeller && (
            <span className="eyebrow rounded-full bg-foreground px-2.5 py-1 text-background">
              Best Seller
            </span>
          )}
          {soldOut && (
            <span className="eyebrow rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              Sold Out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.id);
            toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-card/90 text-foreground shadow-sm transition hover:bg-card"
        >
          <Heart className={cn("size-4", wishlisted && "fill-primary text-primary")} />
        </button>

        <div className="absolute inset-x-2 bottom-2 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
          {hasVariants ? (
            <Button asChild size="sm" className="w-full">
              <Link to="/products/$slug" params={{ slug: product.slug }}>
                Choose options
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full"
              disabled={soldOut}
              onClick={() => {
                addToCart(product.id);
                setCartOpen(true);
              }}
            >
              <ShoppingBag className="size-4" /> Quick add
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {brand && (
          <Link
            to="/brands/$slug"
            params={{ slug: brand.slug }}
            className="eyebrow text-muted-foreground hover:text-primary"
          >
            {brand.name}
          </Link>
        )}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="text-sm font-medium leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} className="mt-0.5" />
        <div className="mt-1 flex items-baseline gap-2">
          <span className={cn("text-sm font-semibold", product.salePrice != null && "text-primary")}>
            {formatAUD(price)} AUD
          </span>
          {product.salePrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatAUD(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}