export type ID = string;

export interface Brand {
  id: ID;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Subcategory {
  id: ID;
  name: string;
  slug: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  image?: string;
  position: number;
  featured: boolean;
  subcategories: Subcategory[];
}

export interface ProductVariant {
  id: ID;
  /** e.g. "Shade", "Size", "Colour", "Volume" */
  optionName: string;
  value: string;
  /** hex swatch for shade/colour selectors */
  swatch?: string;
  stock: number;
  priceDelta?: number;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  sku: string;
  brandId: ID;
  categorySlug: string;
  subcategorySlug?: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: number;
  salePrice?: number;
  stock: number;
  backordersEnabled: boolean;
  images: string[];
  variants: ProductVariant[];
  status: "active" | "draft";
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartLine {
  id: string;
  productId: ID;
  variantId?: ID;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  suburb: string;
  state: AustralianState;
  postcode: string;
  phone: string;
  country: "Australia";
}

export type AustralianState = "VIC" | "NSW" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

export const AU_STATES: { code: AustralianState; name: string }[] = [
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NSW", name: "New South Wales" },
  { code: "NT", name: "Northern Territory" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "VIC", name: "Victoria" },
  { code: "WA", name: "Western Australia" },
];

export type OrderStatus =
  | "Pending"
  | "Paid"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export interface OrderItem {
  productId: ID;
  name: string;
  brand: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface Order {
  id: ID;
  number: string;
  email: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  address: Address;
  createdAt: string;
  promoCode?: string;
}

export interface Review {
  id: ID;
  productId: ID;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
  approved: boolean;
}

export interface Promotion {
  id: ID;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  used: number;
  active: boolean;
}

export interface Customer {
  id: ID;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
}

export interface PromoBanner {
  id: ID;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  align: "left" | "right";
}

export interface FaqItem {
  id: ID;
  category: string;
  question: string;
  answer: string;
}

export interface PolicyPage {
  slug: string;
  title: string;
  body: string;
}

export interface Settings {
  announcementEnabled: boolean;
  announcementText: string;
  freeShippingThreshold: number;
  standardShippingRate: number;
  shippingDescription: string;
  currency: "AUD";
  lowStockThreshold: number;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  banners: PromoBanner[];
}

export interface SiteContent {
  aboutTitle: string;
  aboutBody: string;
  supportEmail: string;
  supportPhone: string;
  businessHours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  newsletterTitle: string;
  newsletterBody: string;
  faqs: FaqItem[];
  policies: PolicyPage[];
}

export interface ShopData {
  settings: Settings;
  homepage: HomepageContent;
  content: SiteContent;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  promotions: Promotion[];
  customers: Customer[];
}