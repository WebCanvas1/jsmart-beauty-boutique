import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useShop } from "@/lib/shop/store";
import { useUI } from "@/lib/shop/ui";

export function SiteHeader() {
  const { data, cartCount, session } = useShop();
  const { setCartOpen, setSearchOpen } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = [...data.categories].sort((a, b) => a.position - b.position);

  const staticLinks = [
    { label: "Brands", to: "/brands" as const },
    { label: "Sale", to: "/collections/$slug" as const, params: { slug: "sale" } },
    { label: "About Us", to: "/about" as const },
    { label: "Contact", to: "/contact" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {data.settings.announcementEnabled && (
        <div className="bg-primary py-2 text-center text-primary-foreground">
          <p className="eyebrow px-4">{data.settings.announcementText}</p>
        </div>
      )}

      <div className="container-x flex h-16 items-center gap-3 lg:h-20">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] overflow-y-auto p-0 sm:max-w-sm">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle className="text-left">
                <Logo size="sm" asLink={false} />
              </SheetTitle>
            </SheetHeader>
            <nav className="px-5 py-2">
              <Link
                to="/collections"
                onClick={() => setMenuOpen(false)}
                className="block border-b py-3 text-sm font-medium"
              >
                Shop All
              </Link>
              <Accordion type="single" collapsible>
                {categories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-sm font-medium">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Link
                        to="/collections/$slug"
                        params={{ slug: category.slug }}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-sm text-primary"
                      >
                        Shop all {category.name}
                      </Link>
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to="/collections/$slug"
                          params={{ slug: category.slug }}
                          search={{ sub: sub.slug }}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 text-sm text-muted-foreground"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {staticLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  params={link.params as never}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b py-3 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium"
              >
                My Account
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav className="mx-auto hidden items-center gap-6 lg:flex">
          <Link
            to="/collections"
            className="text-sm transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Shop
          </Link>
          {categories.map((category) => (
            <div key={category.id} className="group relative">
              <Link
                to="/collections/$slug"
                params={{ slug: category.slug }}
                className="text-sm transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
              {category.subcategories.length > 0 && (
                <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="max-h-96 overflow-y-auto rounded-lg border bg-card p-2 shadow-lg">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to="/collections/$slug"
                        params={{ slug: category.slug }}
                        search={{ sub: sub.slug }}
                        className="block rounded px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link to="/brands" className="text-sm transition-colors hover:text-primary">
            Brands
          </Link>
          <Link
            to="/collections/$slug"
            params={{ slug: "sale" }}
            className="text-sm font-medium text-primary"
          >
            Sale
          </Link>
          <Link to="/about" className="text-sm transition-colors hover:text-primary">
            About Us
          </Link>
          <Link to="/contact" className="text-sm transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="ml-auto flex items-center lg:ml-0">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="My account">
            <Link to="/account">
              <User className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="relative">
            <Link to="/wishlist">
              <Heart className="size-5" />
              {session.wishlist.length > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open bag"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4.5 min-w-[1.125rem] place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}