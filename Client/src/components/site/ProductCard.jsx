import { useState } from "react";
import { Link } from "react-router-dom";
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
      className="group relative block bg-white rounded-[20px] overflow-hidden border border-border shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-[5px] transition-all duration-300"
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-accent text-white text-[0.7rem] font-semibold px-3 py-1 rounded-full">
          {product.badge}
        </span>
      )}
      <button
        onClick={handleWishlistClick}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 w-[30px] h-[30px] xs:w-[34px] xs:h-[34px] rounded-full bg-white/95 shadow-[0_2px_6px_rgba(0,0,0,0.1)] flex items-center justify-center text-[0.8rem] transition-all hover:scale-110 ${
          wishlisted ? "text-[#c00002]" : "text-primary/70 hover:text-[#c00002]"
        }`}
      >
        <i className={wishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
      </button>
      <div className="relative aspect-square overflow-hidden bg-[#f5f2ed] flex items-center justify-center">
        <img
          src={imageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/f5f2ed/1a1a1a?text=No+Image")}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 xs:p-4">
        <h3 className="text-[0.75rem] xs:text-[0.8rem] md:text-[0.9rem] font-semibold leading-[1.3] mb-2 text-primary">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-2 min-w-0">
            <span className="text-[0.9rem] md:text-[1rem] font-bold text-accent">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[0.8rem] text-[#999] line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            disabled={adding}
            className="shrink-0 w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-accent text-white flex items-center justify-center text-[0.7rem] xs:text-[0.75rem] transition-colors hover:bg-accent-light disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-bag-shopping"} />
          </button>
        </div>
      </div>
    </Link>
  );
}
