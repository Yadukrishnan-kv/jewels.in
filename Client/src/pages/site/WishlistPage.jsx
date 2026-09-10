import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api, imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

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
    <div className="relative bg-white border border-border rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:-translate-y-[5px] transition-all overflow-hidden">
      <button
        onClick={() => onRemove(item.productId)}
        aria-label="Remove from wishlist"
        className="absolute top-3 right-3 z-10 w-[34px] h-[34px] rounded-full bg-white/95 shadow-[0_2px_6px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#c00002] transition-all hover:bg-[#c00002] hover:text-white hover:scale-110"
      >
        <i className="fa-solid fa-xmark" />
      </button>
      <Link to={`/product/${item.slug}`} className="block aspect-square bg-[#f5f2ed] flex items-center justify-center overflow-hidden">
        <img src={imageUrl(item.image)} alt={item.name} className="w-4/5 h-4/5 object-contain transition-transform duration-300 hover:scale-105" />
      </Link>
      <div className="p-[15px] md:p-5">
        <Link
          to={`/product/${item.slug}`}
          className="block text-[0.8rem] md:text-[0.9rem] font-semibold leading-[1.3] min-h-[2.75em] md:min-h-[2.9em] mb-2 hover:text-accent"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-2.5 flex-wrap mb-5">
          <span className="text-[0.9rem] md:text-[1rem] font-bold text-accent">{formatPrice(item.price)}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 bg-accent text-white rounded-full py-2 px-3 text-[0.75rem] font-semibold transition-colors hover:bg-accent-light disabled:opacity-60"
          >
            <i className={adding ? "fa-solid fa-spinner fa-spin mr-1.5" : "fa-solid fa-bag-shopping mr-1.5"} />
            Add to Cart
          </button>
          <Link
            to={`/product/${item.slug}`}
            className="flex-1 text-center border border-border rounded-full py-2 px-3 text-[0.75rem] font-semibold transition-colors hover:border-accent hover:text-accent"
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

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Wishlist" }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h1 className="relative inline-block font-serif text-2xl md:text-[1.8rem] font-normal tracking-[3px] pb-4">
            My Wishlist
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[60px] h-[2px] bg-accent" />
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center bg-white border border-border rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] py-16 md:py-20 px-5">
            <i className="fa-regular fa-heart text-[60px] xs:text-[80px] text-border mb-5 block" />
            <h3 className="font-serif text-xl xs:text-2xl mb-3">Your wishlist is empty</h3>
            <p className="text-[#888] mb-8 max-w-md mx-auto">
              You haven&apos;t added any items to your wishlist yet. Start exploring our collection and save your
              favorite items for later!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 bg-accent text-white rounded-full px-8 py-3.5 font-semibold hover:bg-accent-light transition-colors"
              >
                <i className="fa-solid fa-bag-shopping" /> Start Shopping
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-border rounded-full px-8 py-3.5 font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                <i className="fa-solid fa-house" /> Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-[30px] mb-10 md:mb-[50px]">
              {items.map((item) => (
                <WishlistCard key={item.productId} item={item} onRemove={remove} />
              ))}
            </div>

            <div className="bg-white border border-border rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] p-6 md:p-7">
              <h3 className="font-serif text-[1.2rem] pb-3 mb-5 border-b border-border">Good to know</h3>
              <ul className="space-y-3">
                {INFO_ITEMS.map((text) => (
                  <li key={text} className="flex gap-2.5 text-[#777] text-[0.85rem]">
                    <span className="text-accent font-bold shrink-0">✓</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
