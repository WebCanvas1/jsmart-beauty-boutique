import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { seedData, slugify } from "./seed";
import type {
  Address,
  Brand,
  CartLine,
  Category,
  Customer,
  Order,
  OrderStatus,
  Product,
  Promotion,
  Review,
  ShopData,
} from "./types";

const DATA_KEY = "jsmart.shop.data.v1";
const SESSION_KEY = "jsmart.shop.session.v1";

interface SessionState {
  cart: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  customerId: string | null;
  adminSignedIn: boolean;
}

const emptySession: SessionState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  customerId: null,
  adminSignedIn: false,
};

/**
 * Demo administrator credentials.
 * Replace with a server-verified session (Cloudflare Worker + D1/KV) before launch.
 */
export const DEMO_ADMIN = {
  email: "admin@jsmartbeauty.com.au",
  password: "jsmart-admin",
};

interface ShopContextValue {
  data: ShopData;
  session: SessionState;
  ready: boolean;
  /* storefront */
  brandById: (id: string) => Brand | undefined;
  productBySlug: (slug: string) => Product | undefined;
  categoryBySlug: (slug: string) => Category | undefined;
  activeProducts: Product[];
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateLine: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  markViewed: (productId: string) => void;
  /* auth */
  customer: Customer | null;
  register: (input: Omit<Customer, "id">) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  saveAddress: (address: Address) => void;
  updateCustomer: (patch: Partial<Customer>) => void;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  /* mutations */
  update: (patch: (draft: ShopData) => ShopData) => void;
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  upsertCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  upsertBrand: (brand: Brand) => void;
  deleteBrand: (id: string) => void;
  upsertPromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
  setReviewApproval: (id: string, approved: boolean) => void;
  addReview: (review: Omit<Review, "id" | "createdAt" | "approved">) => void;
  placeOrder: (order: Omit<Order, "id" | "number" | "createdAt">) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  resetDemoData: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ShopData>(seedData);
  const [session, setSession] = useState<SessionState>(emptySession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(read<ShopData>(DATA_KEY, seedData));
    setSession(read<SessionState>(SESSION_KEY, emptySession));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, ready]);

  const update = useCallback((patch: (draft: ShopData) => ShopData) => {
    setData((current) => patch(structuredClone(current)));
  }, []);

  const brandById = useCallback((id: string) => data.brands.find((b) => b.id === id), [data.brands]);
  const productBySlug = useCallback(
    (slug: string) => data.products.find((p) => p.slug === slug),
    [data.products],
  );
  const categoryBySlug = useCallback(
    (slug: string) => data.categories.find((c) => c.slug === slug),
    [data.categories],
  );

  const activeProducts = useMemo(
    () => data.products.filter((p) => p.status === "active"),
    [data.products],
  );

  const addToCart = useCallback((productId: string, variantId?: string, quantity = 1) => {
    setSession((s) => {
      const id = variantId ? `${productId}:${variantId}` : productId;
      const existing = s.cart.find((l) => l.id === id);
      const cart = existing
        ? s.cart.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity } : l))
        : [...s.cart, { id, productId, variantId, quantity }];
      return { ...s, cart };
    });
  }, []);

  const updateLine = useCallback((lineId: string, quantity: number) => {
    setSession((s) => ({
      ...s,
      cart:
        quantity <= 0
          ? s.cart.filter((l) => l.id !== lineId)
          : s.cart.map((l) => (l.id === lineId ? { ...l, quantity } : l)),
    }));
  }, []);

  const removeLine = useCallback(
    (lineId: string) => setSession((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== lineId) })),
    [],
  );

  const clearCart = useCallback(() => setSession((s) => ({ ...s, cart: [] })), []);

  const cartCount = session.cart.reduce((sum, l) => sum + l.quantity, 0);

  const cartSubtotal = useMemo(() => {
    return session.cart.reduce((sum, line) => {
      const product = data.products.find((p) => p.id === line.productId);
      if (!product) return sum;
      const variant = product.variants.find((v) => v.id === line.variantId);
      const base = product.salePrice ?? product.price;
      return sum + (base + (variant?.priceDelta ?? 0)) * line.quantity;
    }, 0);
  }, [session.cart, data.products]);

  const toggleWishlist = useCallback((productId: string) => {
    setSession((s) => ({
      ...s,
      wishlist: s.wishlist.includes(productId)
        ? s.wishlist.filter((id) => id !== productId)
        : [...s.wishlist, productId],
    }));
  }, []);

  const markViewed = useCallback((productId: string) => {
    setSession((s) => ({
      ...s,
      recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 8),
    }));
  }, []);

  const customer = useMemo(
    () => data.customers.find((c) => c.id === session.customerId) ?? null,
    [data.customers, session.customerId],
  );

  const register = useCallback<ShopContextValue["register"]>(
    (input) => {
      const email = input.email.trim().toLowerCase();
      if (data.customers.some((c) => c.email === email)) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const id = `c-${Date.now()}`;
      update((draft) => {
        draft.customers.push({ ...input, email, id });
        return draft;
      });
      setSession((s) => ({ ...s, customerId: id }));
      return { ok: true };
    },
    [data.customers, update],
  );

  const login = useCallback<ShopContextValue["login"]>(
    (email, password) => {
      const found = data.customers.find(
        (c) => c.email === email.trim().toLowerCase() && c.password === password,
      );
      if (!found) return { ok: false, error: "Incorrect email or password." };
      setSession((s) => ({ ...s, customerId: found.id }));
      return { ok: true };
    },
    [data.customers],
  );

  const logout = useCallback(() => setSession((s) => ({ ...s, customerId: null })), []);

  const updateCustomer = useCallback<ShopContextValue["updateCustomer"]>(
    (patch) => {
      if (!session.customerId) return;
      update((draft) => {
        draft.customers = draft.customers.map((c) =>
          c.id === session.customerId ? { ...c, ...patch } : c,
        );
        return draft;
      });
    },
    [session.customerId, update],
  );

  const saveAddress = useCallback(
    (address: Address) => updateCustomer({ address }),
    [updateCustomer],
  );

  const adminLogin = useCallback((email: string, password: string) => {
    const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
    if (ok) setSession((s) => ({ ...s, adminSignedIn: true }));
    return ok;
  }, []);

  const adminLogout = useCallback(() => setSession((s) => ({ ...s, adminSignedIn: false })), []);

  const upsertProduct = useCallback<ShopContextValue["upsertProduct"]>(
    (product) => {
      update((draft) => {
        const index = draft.products.findIndex((p) => p.id === product.id);
        const next = { ...product, onSale: product.salePrice != null && product.salePrice > 0 };
        if (index >= 0) draft.products[index] = next;
        else draft.products.unshift(next);
        return draft;
      });
    },
    [update],
  );

  const deleteProduct = useCallback(
    (id: string) =>
      update((draft) => {
        draft.products = draft.products.filter((p) => p.id !== id);
        return draft;
      }),
    [update],
  );

  const duplicateProduct = useCallback(
    (id: string) =>
      update((draft) => {
        const source = draft.products.find((p) => p.id === id);
        if (!source) return draft;
        const copy: Product = {
          ...structuredClone(source),
          id: `p-${Date.now()}`,
          name: `${source.name} (Copy)`,
          slug: slugify(`${source.name}-copy-${Date.now().toString().slice(-4)}`),
          sku: `${source.sku}-C`,
          status: "draft",
          createdAt: new Date().toISOString(),
        };
        draft.products.unshift(copy);
        return draft;
      }),
    [update],
  );

  const upsertCategory = useCallback<ShopContextValue["upsertCategory"]>(
    (category) =>
      update((draft) => {
        const index = draft.categories.findIndex((c) => c.id === category.id);
        if (index >= 0) draft.categories[index] = category;
        else draft.categories.push(category);
        draft.categories.sort((a, b) => a.position - b.position);
        return draft;
      }),
    [update],
  );

  const deleteCategory = useCallback(
    (id: string) =>
      update((draft) => {
        draft.categories = draft.categories.filter((c) => c.id !== id);
        return draft;
      }),
    [update],
  );

  const upsertBrand = useCallback<ShopContextValue["upsertBrand"]>(
    (brand) =>
      update((draft) => {
        const index = draft.brands.findIndex((b) => b.id === brand.id);
        if (index >= 0) draft.brands[index] = brand;
        else draft.brands.push(brand);
        return draft;
      }),
    [update],
  );

  const deleteBrand = useCallback(
    (id: string) =>
      update((draft) => {
        draft.brands = draft.brands.filter((b) => b.id !== id);
        return draft;
      }),
    [update],
  );

  const upsertPromotion = useCallback<ShopContextValue["upsertPromotion"]>(
    (promotion) =>
      update((draft) => {
        const index = draft.promotions.findIndex((p) => p.id === promotion.id);
        if (index >= 0) draft.promotions[index] = promotion;
        else draft.promotions.push(promotion);
        return draft;
      }),
    [update],
  );

  const deletePromotion = useCallback(
    (id: string) =>
      update((draft) => {
        draft.promotions = draft.promotions.filter((p) => p.id !== id);
        return draft;
      }),
    [update],
  );

  const setReviewApproval = useCallback(
    (id: string, approved: boolean) =>
      update((draft) => {
        draft.reviews = draft.reviews.map((r) => (r.id === id ? { ...r, approved } : r));
        return draft;
      }),
    [update],
  );

  const addReview = useCallback<ShopContextValue["addReview"]>(
    (review) =>
      update((draft) => {
        draft.reviews.push({
          ...review,
          id: `r-${Date.now()}`,
          createdAt: new Date().toISOString(),
          approved: false,
        });
        return draft;
      }),
    [update],
  );

  const placeOrder = useCallback<ShopContextValue["placeOrder"]>(
    (input) => {
      const order: Order = {
        ...input,
        id: `o-${Date.now()}`,
        number: `JSB${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      };
      update((draft) => {
        draft.orders.unshift(order);
        // Reserve inventory for the pending order.
        for (const item of order.items) {
          draft.products = draft.products.map((p) =>
            p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p,
          );
        }
        if (order.promoCode) {
          draft.promotions = draft.promotions.map((p) =>
            p.code === order.promoCode ? { ...p, used: p.used + 1 } : p,
          );
        }
        return draft;
      });
      return order;
    },
    [update],
  );

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) =>
      update((draft) => {
        draft.orders = draft.orders.map((o) =>
          o.id === id
            ? {
                ...o,
                status,
                paymentStatus:
                  status === "Refunded" ? "Refunded" : status === "Pending" ? "Unpaid" : "Paid",
              }
            : o,
        );
        return draft;
      }),
    [update],
  );

  const resetDemoData = useCallback(() => {
    setData(structuredClone(seedData));
    setSession(emptySession);
  }, []);

  const value: ShopContextValue = {
    data,
    session,
    ready,
    brandById,
    productBySlug,
    categoryBySlug,
    activeProducts,
    addToCart,
    updateLine,
    removeLine,
    clearCart,
    cartCount,
    cartSubtotal,
    toggleWishlist,
    markViewed,
    customer,
    register,
    login,
    logout,
    saveAddress,
    updateCustomer,
    adminLogin,
    adminLogout,
    update,
    upsertProduct,
    deleteProduct,
    duplicateProduct,
    upsertCategory,
    deleteCategory,
    upsertBrand,
    deleteBrand,
    upsertPromotion,
    deletePromotion,
    setReviewApproval,
    addReview,
    placeOrder,
    setOrderStatus,
    resetDemoData,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}