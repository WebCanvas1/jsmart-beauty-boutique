import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/lib/shop/store";

export function SiteFooter() {
  const { data } = useShop();
  const { content } = data;
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-20 border-t bg-sand">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo size="md" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{content.newsletterBody}</p>
          <form
            className="mt-4 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast.error("Please enter a valid email address.");
                return;
              }
              setEmail("");
              toast.success("Thanks for joining the Jsmart Beauty community!");
            }}
          >
            <Input
              type="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
            />
            <Button type="submit">Join</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {content.newsletterTitle} · Prices in AUD · We ship within Australia only.
          </p>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              { label: "Makeup", slug: "makeup" },
              { label: "Skincare", slug: "skincare" },
              { label: "Hair Care", slug: "hair-care" },
              { label: "Nails", slug: "nails" },
              { label: "New Arrivals", slug: "new-arrivals" },
              { label: "Sale", slug: "sale" },
            ].map((item) => (
              <li key={item.slug}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: item.slug }}
                  className="hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/policies/$slug"
                params={{ slug: "shipping-policy" }}
                className="hover:text-primary"
              >
                Shipping
              </Link>
            </li>
            <li>
              <Link
                to="/policies/$slug"
                params={{ slug: "returns-refund-policy" }}
                className="hover:text-primary"
              >
                Returns
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-primary">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">About</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Jsmart Beauty
              </Link>
            </li>
            <li>
              <Link
                to="/policies/$slug"
                params={{ slug: "privacy-policy" }}
                className="hover:text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/policies/$slug"
                params={{ slug: "terms-conditions" }}
                className="hover:text-primary"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
          <h3 className="eyebrow mb-4 mt-8">Follow Us</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={content.instagram} className="hover:text-primary">
                Instagram
              </a>
            </li>
            <li>
              <a href={content.facebook} className="hover:text-primary">
                Facebook
              </a>
            </li>
            <li>
              <a href={content.tiktok} className="hover:text-primary">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Jsmart Beauty. All prices in AUD.</p>
          <p>
            {content.supportEmail} · {content.supportPhone} · {content.businessHours}
          </p>
        </div>
      </div>
    </footer>
  );
}