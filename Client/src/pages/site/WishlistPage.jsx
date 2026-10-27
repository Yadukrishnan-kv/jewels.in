import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api, imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal, { RevealGroup, RevealItem } from "../../components/site/Reveal.jsx";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";

const INFO_ITEMS = [
  "Move any item to your cart in one click",
  "Your wishlist is saved on this device — no account needed",
  "Stock and pricing always reflect the latest data",
];

function WishlistCard({ item, onRemove }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  async function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      const data = await api.get(`/products/${item.slug}`);
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
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe6dc]">
        <Link to={`/product/${item.slug}`} className="block w-full h-full">
          <img
            src={imageUrl(item.image)}
            alt={item.name}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/ebe6dc/1a1a1a?text=No+Image")}
            className="w-full h-full object-cover md:grayscale-[18%] transition-all duration-700 ease-premium group-hover:scale-[1.05] group-hover:grayscale-0"
          />
        </Link>
        <motion.button
          onClick={() => onRemove(item.productId)}
          whileTap={{ scale: 0.85 }}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 w-9 h-9 rounded-[2px] bg-white/90 backdrop-blur flex items-center justify-center text-primary/60 hover:text-[#c00002] transition-colors duration-300"
        >
          <i className="fa-solid fa-xmark text-[0.85rem]" />
        </motion.button>
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[420ms] ease-premium hidden md:block">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur border-t border-primary/10 micro text-primary py-3.5 hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin text-[0.7rem]" : "fa-solid fa-plus text-[0.65rem]"} />
            {adding ? "Adding" : "Move to bag"}
          </button>
        </div>
      </div>
      <div className="pt-4">
        <Link
          to={`/product/${item.slug}`}
          className="block text-[0.85rem] font-medium leading-snug min-h-[2.6em] hover:text-accent transition-colors line-clamp-2"
        >
          {item.name}
        </Link>
        <span className="block text-[0.9rem] font-semibold tabular-nums mt-1.5">{formatPrice(item.price)}</span>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 flex items-center justify-center gap-2 micro border border-primary/20 py-2.5 hover:bg-primary hover:text-secondary transition-colors duration-300 disabled:opacity-50"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-bag-shopping"} />
            Add to bag
          </button>
          <Link
            to={`/product/${item.slug}`}
            className="flex-1 flex items-center justify-center gap-2 micro border border-border/70 bg-white py-2.5 text-primary/60 hover:border-primary/40 transition-colors duration-300"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { settings } = useSiteData();

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Wishlist" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14 flex items-end justify-between gap-5">
          <div>
            <span className="eyebrow">Saved for later</span>
            <h1 className="section-title mt-4">{settings.sectionTitles?.wishlistPageTitle || "My Wishlist"}</h1>
          </div>
          {items.length > 0 && (
            <p className="micro text-primary/40 tabular-nums shrink-0 pb-2">
              {items.length} saved
            </p>
          )}
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
        {items.length === 0 ? (
          <Reveal className="text-center border border-border/60 bg-white py-16 md:py-24 px-6 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 border border-border/70 text-primary/25 flex items-center justify-center text-xl">
              <i className="fa-regular fa-heart" />
            </div>
            <p className="micro text-primary/35 mb-3">Nothing saved</p>
            <h3 className="font-serif text-2xl mb-3">Your wishlist is empty</h3>
            <p className="text-[0.9rem] text-primary/50 mb-8 max-w-md mx-auto">
              You haven&apos;t added any items to your wishlist yet. Start exploring our collection and save your
              favorite items for later.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/search" className="btn-accent">
                Start shopping
              </Link>
              <Link to="/" className="btn-soft">
                Back to home
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <RevealGroup
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14"
              stagger={0.06}
            >
              {items.map((item) => (
                <RevealItem key={item.productId}>
                  <WishlistCard item={item} onRemove={remove} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-14 md:mt-20 border-t border-border/60 pt-10 max-w-2xl">
              <h3 className="micro text-primary/40 mb-5">Good to know</h3>
              <ul className="space-y-3.5">
                {INFO_ITEMS.map((text) => (
                  <li key={text} className="flex gap-3 text-primary/60 text-[0.88rem]">
                    <i className="fa-solid fa-check text-accent/60 text-[0.65rem] mt-1.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
