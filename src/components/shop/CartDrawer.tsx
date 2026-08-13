import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatAUD } from "@/lib/shop/format";
import { useShop } from "@/lib/shop/store";
import { useUI } from "@/lib/shop/ui";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const { data } = useShop();
  const threshold = data.settings.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  return (
    <div className="rounded-md bg-blush p-3">
      <p className="text-xs font-medium">
        {remaining > 0 ? (
          <>
            You&apos;re <span className="text-primary">{formatAUD(remaining)}</span> away from FREE
            shipping!
          </>
        ) : (
          <>You&apos;ve unlocked FREE shipping!</>
        )}
      </p>
      <Progress
        value={Math.min(100, threshold === 0 ? 100 : (subtotal / threshold) * 100)}
        className="mt-2 h-1.5"
      />
    </div>
  );
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { session, data, updateLine, removeLine, brandById } = useShop();

  if (session.cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {session.cart.map((line) => {
        const product = data.products.find((p) => p.id === line.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === line.variantId);
        const unit = (product.salePrice ?? product.price) + (variant?.priceDelta ?? 0);
        return (
          <li key={line.id} className="flex gap-3 py-4">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              width={90}
              height={110}
              className="size-20 shrink-0 rounded-md object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="eyebrow text-muted-foreground">{brandById(product.brandId)?.name}</p>
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="truncate text-sm font-medium hover:text-primary"
              >
                {product.name}
              </Link>
              {variant && (
                <p className="text-xs text-muted-foreground">
                  {variant.optionName}: {variant.value}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-md border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="grid size-8 place-items-center"
                    onClick={() => updateLine(line.id, line.quantity - 1)}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="grid size-8 place-items-center"
                    onClick={() => updateLine(line.id, line.quantity + 1)}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="text-sm font-semibold">{formatAUD(unit * line.quantity)}</span>
              </div>
            </div>
            {!compact && (
              <button
                type="button"
                aria-label={`Remove ${product.name}`}
                onClick={() => removeLine(line.id)}
                className="self-start text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { cartSubtotal, cartCount } = useShop();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-left text-lg">Your Bag ({cartCount})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5">
          {cartCount > 0 && (
            <div className="pt-4">
              <FreeShippingMeter subtotal={cartSubtotal} />
            </div>
          )}
          <CartLines />
        </div>
        {cartCount > 0 && (
          <div className="space-y-3 border-t px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatAUD(cartSubtotal)} AUD</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping calculated at checkout. Australian delivery only.
            </p>
            <Button asChild className="w-full" size="lg" onClick={() => setCartOpen(false)}>
              <Link to="/checkout">Checkout</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
              onClick={() => setCartOpen(false)}
            >
              <Link to="/cart">View bag</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}