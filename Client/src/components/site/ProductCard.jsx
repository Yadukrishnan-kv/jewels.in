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
    <Link
      to={`/product/${product.slug}`}
      className="group relative block bg-white rounded-[22px] overflow-hidden border border-border/70 shadow-soft transition-all duration-500 ease-premium hover:shadow-card-hover hover:-translate-y-1.5"
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-white text-[0.65rem] font-semibold tracking-wide uppercase px-3 py-1 rounded-full shadow-soft">
          {product.badge}
        </span>
      )}
      <motion.button
        onClick={handleWishlistClick}
        whileTap={{ scale: 0.8 }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 w-[30px] h-[30px] xs:w-[34px] xs:h-[34px] rounded-full bg-white/95 backdrop-blur shadow-soft flex items-center justify-center text-[0.8rem] transition-all duration-300 hover:scale-110 ${
          wishlisted ? "text-[#c00002]" : "text-primary/60 hover:text-[#c00002]"
        }`}
      >
        <i className={wishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
      </motion.button>
      <div className="relative aspect-square overflow-hidden bg-[#f5f2ed]">
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/f5f2ed/1a1a1a?text=No+Image")}
          className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-3.5 xs:p-4">
        <h3 className="text-[0.75rem] xs:text-[0.8rem] md:text-[0.9rem] font-medium leading-[1.35] mb-2 text-primary line-clamp-2 min-h-[2.4em]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-2 min-w-0">
            <span className="text-[0.92rem] md:text-[1.05rem] font-semibold text-accent">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[0.75rem] text-primary/35 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <motion.button
            onClick={handleQuickAdd}
            whileTap={{ scale: 0.85 }}
            aria-label="Add to cart"
            disabled={adding}
            className="shrink-0 w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-primary text-white flex items-center justify-center text-[0.7rem] xs:text-[0.75rem] transition-all duration-300 hover:bg-accent disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-bag-shopping"} />
          </motion.button>
        </div>
      </div>
    </Link>
  );
}
