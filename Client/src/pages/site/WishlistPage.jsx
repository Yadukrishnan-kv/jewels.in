import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function WishlistPage() {
  const { items, remove } = useWishlist();

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <h1 className="section-title">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-regular fa-heart text-4xl text-primary/30 mb-4 block" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-primary/60 mb-6 max-w-md mx-auto">
              You haven&apos;t added any items to your wishlist yet. Start exploring our collection and save your
              favorite items for later!
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/search" className="btn-primary">
                <i className="fa-solid fa-bag-shopping" /> Start Shopping
              </Link>
              <Link to="/" className="btn-outline">
                <i className="fa-solid fa-house" /> Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div key={item.productId} className="relative bg-white border border-border rounded-2xl overflow-hidden group">
                <button
                  onClick={() => remove(item.productId)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red-600 shadow"
                  aria-label="Remove"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
                <Link to={`/product/${item.slug}`} className="block aspect-square overflow-hidden bg-secondary">
                  <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </Link>
                <div className="p-3">
                  <Link to={`/product/${item.slug}`} className="text-sm font-medium hover:text-accent truncate block">
                    {item.name}
                  </Link>
                  <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
