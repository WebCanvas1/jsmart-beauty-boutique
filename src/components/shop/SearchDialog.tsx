import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatAUD } from "@/lib/shop/format";
import { searchProducts, suggestTerms } from "@/lib/shop/search";
import { useShop } from "@/lib/shop/store";
import { useUI } from "@/lib/shop/ui";

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUI();
  const { data, activeProducts, brandById } = useShop();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(
    () => searchProducts(activeProducts, data.brands, data.categories, query).slice(0, 6),
    [activeProducts, data.brands, data.categories, query],
  );
  const suggestions = useMemo(
    () => suggestTerms(data.categories, data.brands, query).slice(0, 6),
    [data.categories, data.brands, query],
  );

  const close = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={searchOpen} onOpenChange={(open) => (open ? setSearchOpen(true) : close())}>
      <DialogContent className="top-24 max-w-2xl translate-y-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Jsmart Beauty</DialogTitle>
        </DialogHeader>
        <form
          className="flex items-center gap-2 border-b px-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            close();
            void navigate({ to: "/search", search: { q: query.trim() } });
          }}
        >
          <Search className="size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands and categories"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim().length === 0 && (
            <p className="text-sm text-muted-foreground">
              Try &quot;lip&quot;, &quot;serum&quot; or a brand name.
            </p>
          )}

          {query.trim().length > 0 && suggestions.length > 0 && (
            <div className="mb-4">
              <p className="eyebrow mb-2 text-muted-foreground">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full bg-secondary px-3 py-1 text-xs hover:bg-accent"
                    onClick={() => {
                      close();
                      void navigate({ to: "/search", search: { q: s } });
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim().length > 0 && (
            <div className="space-y-1">
              <p className="eyebrow mb-2 text-muted-foreground">Products</p>
              {results.length === 0 && (
                <p className="text-sm text-muted-foreground">No matching products.</p>
              )}
              {results.map((p) => (
                <Link
                  key={p.id}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  onClick={close}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    width={56}
                    height={56}
                    className="size-12 rounded object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">
                      {brandById(p.brandId)?.name}
                    </span>
                    <span className="block truncate text-sm">{p.name}</span>
                  </span>
                  <span className="text-sm font-medium">{formatAUD(p.salePrice ?? p.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}