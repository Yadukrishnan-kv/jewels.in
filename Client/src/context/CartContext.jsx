import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { userApi } from "../api/client.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setItems([]);
      setLoaded(false);
      return;
    }
    let active = true;
    userApi
      .get("/cart", token)
      .then((data) => active && setItems(data?.items || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !loaded) return;
    userApi.put("/cart", { items }, token).catch(() => {});
  }, [items, token, loaded]);

  const requireLogin = useCallback(() => {
    showToast("Please login to add items to your cart", "error");
    navigate("/login");
  }, [showToast, navigate]);

  // key = productId + variantId, keeps distinct variants as separate lines
  const addItem = useCallback(
    (product, variant, qty = 1) => {
      if (!token) return requireLogin();
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
    [token, requireLogin, showToast]
  );

  const updateQty = useCallback(
    (key, qty) => {
      if (!token) return requireLogin();
      setItems((prev) =>
        prev
          .map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
          .filter(Boolean)
      );
    },
    [token, requireLogin]
  );

  const removeItem = useCallback(
    (key) => {
      if (!token) return requireLogin();
      setItems((prev) => prev.filter((i) => i.key !== key));
      showToast("Item removed from cart");
    },
    [token, requireLogin, showToast]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = { items, loaded, addItem, updateQty, removeItem, clearCart, subtotal, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
