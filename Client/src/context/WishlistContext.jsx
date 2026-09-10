import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastContext.jsx";

const WishlistContext = createContext(null);
const STORAGE_KEY = "hala_wishlist_v1";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = useCallback((productId) => items.some((i) => i.productId === productId), [items]);

  const toggle = useCallback(
    (product) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.productId === product._id);
        if (exists) {
          showToast("Item removed from wishlist!");
          return prev.filter((i) => i.productId !== product._id);
        }
        showToast("Added to wishlist");
        return [
          ...prev,
          {
            productId: product._id,
            slug: product.slug,
            name: product.name,
            image: product.images?.[0] || product.image || "",
            price: product.minPrice ?? product.price,
          },
        ];
      });
    },
    [showToast]
  );

  const remove = useCallback(
    (productId) => {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast("Item removed from wishlist!");
    },
    [showToast]
  );

  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, isWishlisted, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
