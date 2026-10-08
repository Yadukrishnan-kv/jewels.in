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
    <div className="relative surface-card-hover overflow-hidden">
      <motion.button
        onClick={() => onRemove(item.productId)}
        whileTap={{ scale: 0.8 }}
        aria-label="Remove from wishlist"
        className="absolute top-3 right-3 z-10 w-[34px] h-[34px] rounded-full bg-white/95 shadow-soft flex items-center justify-center text-[#c00002] transition-all duration-300 hover:bg-[#c00002] hover:text-white hover:scale-110"
      >
        <i className="fa-solid fa-xmark" />
      </motion.button>
      <Link to={`/product/${item.slug}`} className="block aspect-square bg-[#f5f2ed] overflow-hidden">
        <img
          src={imageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 ease-premium hover:scale-105"
        />
      </Link>
      <div className="p-[15px] md:p-5">
        <Link
          to={`/product/${item.slug}`}
          className="block text-[0.8rem] md:text-[0.9rem] font-medium leading-[1.3] min-h-[2.75em] md:min-h-[2.9em] mb-2 hover:text-accent transition-colors"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-2.5 flex-wrap mb-5">
          <span className="text-[0.9rem] md:text-[1rem] font-semibold text-accent">{formatPrice(item.price)}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 bg-accent text-white rounded-full py-2 px-3 text-[0.75rem] font-semibold transition-colors duration-300 hover:bg-accent-light disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin mr-1.5" : "fa-solid fa-bag-shopping mr-1.5"} />
            Add to Cart
          </button>
          <Link
            to={`/product/${item.slug}`}
            className="flex-1 text-center border border-border rounded-full py-2 px-3 text-[0.75rem] font-semibold transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            View Details
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
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <Reveal className="text-center mb-10">
          <span className="eyebrow">Saved for later</span>
          <h1 className="section-title mt-2 mb-0">{settings.sectionTitles?.wishlistPageTitle || "My Wishlist"}</h1>
        </Reveal>

        {items.length === 0 ? (
          <Reveal className="text-center surface-card py-16 md:py-20 px-5">
            <div className="w-20 h-20 xs:w-24 xs:h-24 mx-auto mb-6 rounded-full bg-accent/[0.07] text-accent flex items-center justify-center text-3xl xs:text-4xl">
              <i className="fa-regular fa-heart" />
            </div>
            <h3 className="font-serif text-xl xs:text-2xl mb-3">Your wishlist is empty</h3>
            <p className="text-primary/45 mb-8 max-w-md mx-auto">
              You haven&apos;t added any items to your wishlist yet. Start exploring our collection and save your
              favorite items for later!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/search" className="btn-accent">
                <i className="fa-solid fa-bag-shopping" /> Start Shopping
              </Link>
              <Link to="/" className="btn-soft">
                <i className="fa-solid fa-house" /> Back to Home
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <RevealGroup
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-[30px] mb-10 md:mb-[50px]"
              stagger={0.06}
            >
              {items.map((item) => (
                <RevealItem key={item.productId}>
                  <WishlistCard item={item} onRemove={remove} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="surface-card p-6 md:p-7">
              <h3 className="font-serif text-[1.2rem] pb-3 mb-5 border-b border-border">Good to know</h3>
              <ul className="space-y-3">
                {INFO_ITEMS.map((text) => (
                  <li key={text} className="flex gap-2.5 text-primary/55 text-[0.85rem]">
                    <i className="fa-solid fa-circle-check text-accent/70 shrink-0 mt-0.5" />
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
