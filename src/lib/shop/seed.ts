import heroImage from "@/assets/hero.jpg";
import catMakeup from "@/assets/cat-makeup.jpg";
import catSkincare from "@/assets/cat-skincare.jpg";
import catHaircare from "@/assets/cat-haircare.jpg";
import catNails from "@/assets/cat-nails.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import promoGlow from "@/assets/promo-glow.jpg";
import promoMakeup from "@/assets/promo-makeup.jpg";

import type { Category, Brand, Product, ShopData, ProductVariant } from "./types";

export const CATEGORY_IMAGES: Record<string, string> = {
  makeup: catMakeup,
  skincare: catSkincare,
  "hair-care": catHaircare,
  nails: catNails,
  "beauty-accessories": catAccessories,
  "new-arrivals": promoMakeup,
  "best-sellers": catMakeup,
  sale: promoGlow,
};

const sub = (name: string) => ({
  id: `sc-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
});

const categories: Category[] = [
  {
    id: "cat-makeup",
    name: "Makeup",
    slug: "makeup",
    image: catMakeup,
    position: 1,
    featured: true,
    subcategories: [
      "Foundation",
      "Concealer",
      "Blush",
      "Bronzer",
      "Highlighter",
      "Primer",
      "Setting Spray",
      "Mascara",
      "Eyeliner",
      "Eyeshadow",
      "Brows",
      "Lashes",
      "Lipstick",
      "Lip Gloss",
      "Lip Balm",
      "Lip Liner",
      "Lip Oil",
    ].map(sub),
  },
  {
    id: "cat-skincare",
    name: "Skincare",
    slug: "skincare",
    image: catSkincare,
    position: 2,
    featured: true,
    subcategories: [
      "Cleansers",
      "Moisturisers",
      "Serums",
      "Toners",
      "Masks",
      "Eye Care",
      "Sun Care",
    ].map(sub),
  },
  {
    id: "cat-haircare",
    name: "Hair Care",
    slug: "hair-care",
    image: catHaircare,
    position: 3,
    featured: true,
    subcategories: ["Shampoo", "Conditioner", "Hair Masks", "Styling", "Hair Accessories"].map(sub),
  },
  {
    id: "cat-nails",
    name: "Nails",
    slug: "nails",
    image: catNails,
    position: 4,
    featured: true,
    subcategories: ["Nail Polish", "False Nails", "Nail Care", "Nail Accessories"].map(sub),
  },
  {
    id: "cat-accessories",
    name: "Beauty Accessories",
    slug: "beauty-accessories",
    image: catAccessories,
    position: 5,
    featured: true,
    subcategories: ["Brushes", "Sponges", "Tools", "Bags & Cases"].map(sub),
  },
];

const brands: Brand[] = [
  { id: "b-lumira", name: "Lumira Beauty", slug: "lumira-beauty" },
  { id: "b-velvette", name: "Velvette", slug: "velvette" },
  { id: "b-bondi", name: "Bondi Glow", slug: "bondi-glow" },
  { id: "b-marlo", name: "Marlo Skin", slug: "marlo-skin" },
  { id: "b-halo", name: "Halo Cosmetics", slug: "halo-cosmetics" },
  { id: "b-saltbush", name: "Saltbush Botanicals", slug: "saltbush-botanicals" },
  { id: "b-nine", name: "Nine Lane", slug: "nine-lane" },
  { id: "b-atelier", name: "Atelier Nails", slug: "atelier-nails" },
];

const shade = (value: string, swatch: string, stock = 12): ProductVariant => ({
  id: `v-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${swatch.slice(1)}`,
  optionName: "Shade",
  value,
  swatch,
  stock,
});

const size = (value: string, stock = 20, priceDelta = 0): ProductVariant => ({
  id: `v-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  optionName: "Size",
  value,
  stock,
  priceDelta,
});

type Seed = Partial<Product> & {
  name: string;
  brandId: string;
  categorySlug: string;
  price: number;
};

const daysAgo = (n: number) => new Date(Date.UTC(2026, 6, 1) - n * 86400000).toISOString();

const raw: Seed[] = [
  {
    name: "Silk Veil Matte Liquid Lipstick",
    brandId: "b-velvette",
    categorySlug: "makeup",
    subcategorySlug: "lipstick",
    price: 29.95,
    salePrice: 24.95,
    rating: 4.7,
    reviewCount: 128,
    bestSeller: true,
    featured: true,
    variants: [
      shade("Rosewood", "#b6636a"),
      shade("Blush Nude", "#d29a92"),
      shade("Crimson", "#a81f37"),
      shade("Mauve Muse", "#9d6f84"),
    ],
  },
  {
    name: "Luminous Skin Tint Foundation",
    brandId: "b-lumira",
    categorySlug: "makeup",
    subcategorySlug: "foundation",
    price: 44.0,
    rating: 4.5,
    reviewCount: 86,
    featured: true,
    variants: [
      shade("Porcelain", "#f2ddcd"),
      shade("Sand", "#e6c3a5"),
      shade("Honey", "#cd9c74"),
      shade("Amber", "#a97048"),
    ],
  },
  {
    name: "Soft Focus Cream Blush",
    brandId: "b-halo",
    categorySlug: "makeup",
    subcategorySlug: "blush",
    price: 26.5,
    rating: 4.8,
    reviewCount: 212,
    bestSeller: true,
    variants: [shade("Peach Fizz", "#f0a186"), shade("Petal", "#eda2ad"), shade("Berry", "#b45b78")],
  },
  {
    name: "Volume Lift Mascara",
    brandId: "b-velvette",
    categorySlug: "makeup",
    subcategorySlug: "mascara",
    price: 32.0,
    salePrice: 25.6,
    rating: 4.4,
    reviewCount: 64,
    newArrival: true,
  },
  {
    name: "Everyday Nude Eyeshadow Palette",
    brandId: "b-halo",
    categorySlug: "makeup",
    subcategorySlug: "eyeshadow",
    price: 59.95,
    rating: 4.6,
    reviewCount: 41,
    featured: true,
    stock: 4,
  },
  {
    name: "Glass Shine Lip Oil",
    brandId: "b-nine",
    categorySlug: "makeup",
    subcategorySlug: "lip-oil",
    price: 21.95,
    rating: 4.9,
    reviewCount: 305,
    newArrival: true,
    bestSeller: true,
    variants: [shade("Clear", "#f6e7e4"), shade("Pink Sugar", "#eb9fb4"), shade("Cherry", "#c23a4d")],
  },
  {
    name: "Hydra Bounce Gel Moisturiser",
    brandId: "b-marlo",
    categorySlug: "skincare",
    subcategorySlug: "moisturisers",
    price: 48.0,
    rating: 4.7,
    reviewCount: 158,
    featured: true,
    variants: [size("50ml"), size("100ml", 14, 22)],
  },
  {
    name: "Vitamin C Brightening Serum",
    brandId: "b-marlo",
    categorySlug: "skincare",
    subcategorySlug: "serums",
    price: 65.0,
    salePrice: 52.0,
    rating: 4.8,
    reviewCount: 274,
    bestSeller: true,
  },
  {
    name: "Gentle Cream Cleanser",
    brandId: "b-saltbush",
    categorySlug: "skincare",
    subcategorySlug: "cleansers",
    price: 34.95,
    rating: 4.5,
    reviewCount: 92,
  },
  {
    name: "Overnight Repair Sleep Mask",
    brandId: "b-bondi",
    categorySlug: "skincare",
    subcategorySlug: "masks",
    price: 55.0,
    rating: 4.6,
    reviewCount: 47,
    newArrival: true,
  },
  {
    name: "Daily Defence SPF 50+ Face Fluid",
    brandId: "b-bondi",
    categorySlug: "skincare",
    subcategorySlug: "sun-care",
    price: 39.95,
    rating: 4.9,
    reviewCount: 411,
    bestSeller: true,
    featured: true,
  },
  {
    name: "Caffeine Eye Recovery Gel",
    brandId: "b-marlo",
    categorySlug: "skincare",
    subcategorySlug: "eye-care",
    price: 42.0,
    rating: 4.3,
    reviewCount: 38,
    stock: 0,
  },
  {
    name: "Repair & Shine Shampoo",
    brandId: "b-saltbush",
    categorySlug: "hair-care",
    subcategorySlug: "shampoo",
    price: 27.95,
    rating: 4.4,
    reviewCount: 73,
    variants: [size("300ml"), size("750ml", 9, 18)],
  },
  {
    name: "Silk Smooth Conditioner",
    brandId: "b-saltbush",
    categorySlug: "hair-care",
    subcategorySlug: "conditioner",
    price: 27.95,
    salePrice: 22.35,
    rating: 4.5,
    reviewCount: 66,
  },
  {
    name: "Deep Nourish Hair Mask",
    brandId: "b-nine",
    categorySlug: "hair-care",
    subcategorySlug: "hair-masks",
    price: 36.0,
    rating: 4.7,
    reviewCount: 119,
    newArrival: true,
  },
  {
    name: "Gel Effect Nail Polish",
    brandId: "b-atelier",
    categorySlug: "nails",
    subcategorySlug: "nail-polish",
    price: 18.95,
    rating: 4.6,
    reviewCount: 201,
    bestSeller: true,
    variants: [
      shade("Ballet Pink", "#f0c3ce"),
      shade("Nude Sand", "#e2c3ab"),
      shade("Scarlet", "#c02b3c"),
      shade("Midnight", "#2b2b3d"),
    ],
  },
  {
    name: "Strengthening Nail Care Oil",
    brandId: "b-atelier",
    categorySlug: "nails",
    subcategorySlug: "nail-care",
    price: 22.5,
    rating: 4.2,
    reviewCount: 29,
    newArrival: true,
  },
  {
    name: "Pro Blend Makeup Brush Set",
    brandId: "b-lumira",
    categorySlug: "beauty-accessories",
    subcategorySlug: "brushes",
    price: 89.0,
    salePrice: 69.0,
    rating: 4.8,
    reviewCount: 154,
    featured: true,
    bestSeller: true,
  },
  {
    name: "Precision Blending Sponge Duo",
    brandId: "b-lumira",
    categorySlug: "beauty-accessories",
    subcategorySlug: "sponges",
    price: 16.95,
    rating: 4.4,
    reviewCount: 88,
  },
  {
    name: "Travel Beauty Case",
    brandId: "b-nine",
    categorySlug: "beauty-accessories",
    subcategorySlug: "bags-cases",
    price: 49.95,
    rating: 4.1,
    reviewCount: 22,
    newArrival: true,
    stock: 3,
  },
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const products: Product[] = raw.map((p, i) => {
  const slug = slugify(p.name);
  const image = CATEGORY_IMAGES[p.categorySlug] ?? catMakeup;
  return {
    id: `p-${i + 1}`,
    slug,
    sku: `JSB-${String(i + 1).padStart(4, "0")}`,
    subcategorySlug: p.subcategorySlug,
    description:
      "A demo product created so you can preview the Jsmart Beauty storefront. Replace this description in the admin panel with your own product copy.",
    ingredients:
      "Sample ingredient list — Aqua, Glycerin, Butyrospermum Parkii (Shea) Butter, Tocopherol. Update this in the admin panel.",
    howToUse:
      "Sample usage instructions. Apply as needed and follow the directions supplied by the brand. Update this in the admin panel.",
    stock: p.stock ?? 25,
    backordersEnabled: false,
    images: [image, CATEGORY_IMAGES["new-arrivals"], promoGlow],
    variants: p.variants ?? [],
    status: "active",
    featured: p.featured ?? false,
    bestSeller: p.bestSeller ?? false,
    newArrival: p.newArrival ?? false,
    onSale: p.salePrice != null,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    createdAt: daysAgo(i * 3),
    ...p,
  } as Product;
});

export const seedData: ShopData = {
  settings: {
    announcementEnabled: true,
    announcementText: "FREE SHIPPING AUSTRALIA-WIDE ON ORDERS OVER $75",
    freeShippingThreshold: 75,
    standardShippingRate: 9.95,
    shippingDescription: "Standard Shipping — delivered Australia-wide in 3-7 business days.",
    currency: "AUD",
    lowStockThreshold: 5,
  },
  homepage: {
    heroTitle: "Beauty You'll Love",
    heroSubtitle:
      "Discover makeup, skincare and beauty essentials selected for every style. Shipped Australia-wide.",
    heroImage: heroImage,
    heroPrimaryLabel: "Shop New Arrivals",
    heroPrimaryHref: "/collections/new-arrivals",
    heroSecondaryLabel: "Shop Best Sellers",
    heroSecondaryHref: "/collections/best-sellers",
    banners: [
      {
        id: "pb-1",
        title: "Glow Starts Here",
        subtitle: "Discover skincare essentials for your everyday routine.",
        ctaLabel: "Shop Skincare",
        ctaHref: "/collections/skincare",
        image: promoGlow,
        align: "left",
      },
      {
        id: "pb-2",
        title: "Makeup Must-Haves",
        subtitle: "Everything you need for your everyday look.",
        ctaLabel: "Shop Makeup",
        ctaHref: "/collections/makeup",
        image: promoMakeup,
        align: "right",
      },
      {
        id: "pb-3",
        title: "Beauty Deals",
        subtitle: "Your favourite beauty products for less.",
        ctaLabel: "Shop Sale",
        ctaHref: "/collections/sale",
        image: promoGlow,
        align: "left",
      },
    ],
  },
  content: {
    aboutTitle: "Welcome to Jsmart Beauty",
    aboutBody:
      "Jsmart Beauty is an Australian online destination for cosmetics, skincare and beauty essentials.\n\nWe're passionate about helping our customers discover beauty products they love while making online beauty shopping simple, convenient and enjoyable.",
    supportEmail: "hello@jsmartbeauty.com.au",
    supportPhone: "(03) 0000 0000",
    businessHours: "Monday to Friday, 9am – 5pm AEST",
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
    newsletterTitle: "Join the Jsmart Beauty Community",
    newsletterBody: "Sign up for new arrivals, beauty offers and exclusive promotions.",
    faqs: [
      {
        id: "f1",
        category: "Shipping",
        question: "Where do you deliver?",
        answer: "We currently deliver to addresses within Australia only.",
      },
      {
        id: "f2",
        category: "Shipping",
        question: "How long does shipping take?",
        answer: "Standard shipping is typically delivered within 3-7 business days.",
      },
      {
        id: "f3",
        category: "Orders",
        question: "How can I track my order?",
        answer:
          "Once your order is shipped you will receive tracking details by email. You can also view your orders in your account.",
      },
      {
        id: "f4",
        category: "Orders",
        question: "Can I change my order?",
        answer:
          "Please contact us as soon as possible after ordering and we will help where the order has not yet been dispatched.",
      },
      {
        id: "f5",
        category: "Payments",
        question: "What payment methods do you accept?",
        answer:
          "Payment methods will be confirmed once the store's payment gateway is connected. All prices are in AUD.",
      },
      {
        id: "f6",
        category: "Returns",
        question: "What is your returns policy?",
        answer:
          "Our returns policy is being finalised by the business owner and will be published before launch.",
      },
      {
        id: "f7",
        category: "Products",
        question: "Are the products currently listed real?",
        answer:
          "The current catalogue contains demo products for preview purposes. They can be removed in the admin panel.",
      },
    ],
    policies: [
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        body: "This is a placeholder Privacy Policy for Jsmart Beauty.\n\nIt should describe what personal information is collected, how it is used, stored and disclosed, and how customers can access or correct their information.\n\nThis wording must be reviewed and approved by the business owner before launch.",
      },
      {
        slug: "terms-conditions",
        title: "Terms & Conditions",
        body: "This is a placeholder Terms & Conditions page for Jsmart Beauty.\n\nIt should cover ordering, pricing, availability, cancellations, liability and governing law.\n\nThis wording must be reviewed and approved by the business owner before launch.",
      },
      {
        slug: "shipping-policy",
        title: "Shipping Policy",
        body: "This is a placeholder Shipping Policy for Jsmart Beauty.\n\nOrders are shipped within Australia only. Standard shipping rates and the free shipping threshold are configured in the admin panel.\n\nThis wording must be reviewed and approved by the business owner before launch.",
      },
      {
        slug: "returns-refund-policy",
        title: "Returns & Refund Policy",
        body: "This is a placeholder Returns & Refund Policy for Jsmart Beauty.\n\nIt should set out return windows, condition requirements, refund methods and any exclusions for hygiene-sensitive beauty products, alongside Australian Consumer Law rights.\n\nThis wording must be reviewed and approved by the business owner before launch.",
      },
    ],
  },
  categories,
  brands,
  products,
  orders: [],
  reviews: [
    {
      id: "r1",
      productId: "p-1",
      name: "Amelia R.",
      rating: 5,
      body: "Demo review — lovely texture and the shade range is great.",
      createdAt: daysAgo(12),
      approved: true,
    },
    {
      id: "r2",
      productId: "p-1",
      name: "Chloe T.",
      rating: 4,
      body: "Demo review — nice colour payoff, wears well through the day.",
      createdAt: daysAgo(5),
      approved: false,
    },
  ],
  promotions: [
    {
      id: "promo-1",
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minSpend: 50,
      used: 0,
      active: true,
    },
  ],
  customers: [],
};