import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api, imageUrl } from "../../api/client.js";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPrice } from "../../utils/currency.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product._id);

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  async function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      const data = await api.get(`/products/${product.slug}`);
      const variant = data.product?.variants?.[0];
      if (!variant || variant.stock <= 0) {
        showToast("Out of stock", "error");
        return;
      }
      addItem(data.product, variant, 1);
    } catch {
      showToast("Could not add to cart", "error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe6dc]">
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/ebe6dc/1a1a1a?text=No+Image")}
          className="w-full h-full object-cover md:grayscale-[18%] transition-all duration-700 ease-premium group-hover:scale-[1.05] group-hover:grayscale-0"
        />
        {product.badge && (
          <span className="absolute top-0 left-0 z-10 micro bg-secondary/95 backdrop-blur text-primary px-3 py-1.5">
            {product.badge}
          </span>
        )}
        <motion.button
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.85 }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 z-10 w-9 h-9 rounded-[2px] bg-white/90 backdrop-blur flex items-center justify-center text-[0.8rem] transition-all duration-300 hover:bg-white md:opacity-0 md:group-hover:opacity-100 ${
            wishlisted ? "text-[#c00002] opacity-100" : "text-primary/70"
          }`}
        >
          <i className={wishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
        </motion.button>
        <motion.button
          onClick={handleQuickAdd}
          whileTap={{ scale: 0.85 }}
          disabled={adding}
          aria-label="Add to bag"
          className="md:hidden absolute bottom-2 right-2 z-10 w-9 h-9 rounded-[2px] bg-white/95 backdrop-blur flex items-center justify-center text-primary text-[0.7rem] transition-colors active:bg-primary active:text-white disabled:opacity-60"
        >
          <i className={adding ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-plus"} />
        </motion.button>
        <div className="absolute inset-x-0 bottom-0 hidden md:block translate-y-full group-hover:translate-y-0 transition-transform duration-[420ms] ease-premium">
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            aria-label="Add to bag"
            className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur border-t border-primary/10 micro text-primary py-3.5 hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin text-[0.7rem]" : "fa-solid fa-plus text-[0.65rem]"} />
            {adding ? "Adding" : "Add to bag"}
          </button>
        </div>
      </div>
      <div className="pt-4 pr-2">
        <h3 className="text-[0.85rem] font-medium leading-snug text-primary/90 line-clamp-2 min-h-[2.6em] group-hover:text-accent transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2.5 mt-1.5">
          <span className="text-[0.9rem] font-semibold text-primary tabular-nums">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[0.75rem] text-primary/30 line-through tabular-nums">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
