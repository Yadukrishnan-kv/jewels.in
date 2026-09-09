import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext(null);
const STORAGE_KEY = "hala_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // key = productId + variantId, keeps distinct variants as separate lines
  const addItem = useCallback(
    (product, variant, qty = 1) => {
      let outcome = "added";
      setItems((prev) => {
        const key = `${product._id}_${variant._id}`;
        const existing = prev.find((i) => i.key === key);
        const stock = variant.stock;
        if (existing) {
          const newQty = Math.min(existing.qty + qty, stock);
          if (newQty === existing.qty) {
            outcome = "maxed";
            return prev;
          }
          return prev.map((i) => (i.key === key ? { ...i, qty: newQty } : i));
        }
        return [
          ...prev,
          {
            key,
            productId: product._id,
            slug: product.slug,
            name: product.name,
            image: product.images?.[0] || "",
            variantId: variant._id,
            variantLabel: variant.label,
            price: variant.discountPrice || variant.price,
            stock,
            qty: Math.min(qty, stock),
          },
        ];
      });
      if (outcome === "maxed") showToast(`Only ${variant.stock} units available in stock!`, "warning");
      else showToast(`${product.name} added to cart`);
    },
    [showToast]
  );

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
        .filter(Boolean)
    );
  }, []);

  const removeItem = useCallback(
    (key) => {
      setItems((prev) => prev.filter((i) => i.key !== key));
      showToast("Item removed from cart");
    },
    [showToast]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = { items, addItem, updateQty, removeItem, clearCart, subtotal, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
