import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { userApi } from "../api/client.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
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
      .get("/wishlist", token)
      .then((data) => active && setItems(data?.items || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !loaded) return;
    userApi.put("/wishlist", { items }, token).catch(() => {});
  }, [items, token, loaded]);

  const requireLogin = useCallback(() => {
    showToast("Please login to save items to your wishlist", "error");
    navigate("/login");
  }, [showToast, navigate]);

  const isWishlisted = useCallback((productId) => items.some((i) => i.productId === productId), [items]);

  const toggle = useCallback(
    (product) => {
      if (!token) return requireLogin();
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
    [token, requireLogin, showToast]
  );

  const remove = useCallback(
    (productId) => {
      if (!token) return requireLogin();
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast("Item removed from wishlist!");
    },
    [token, requireLogin, showToast]
  );

  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ items, loaded, toggle, remove, isWishlisted, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
