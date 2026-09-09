import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";

function formatPrice(n) {
  return `₹ ${Number(n).toFixed(2)}`;
}

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]} />
      <div className="max-w-container mx-auto px-4 md:px-8 pb-16">
        <h1 className="section-title">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-bag-shopping text-4xl text-primary/30 mb-4 block" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-primary/60 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link to="/search" className="btn-primary">
              <i className="fa-solid fa-arrow-right" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-[2] space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 border border-border rounded-xl p-4 bg-white">
                  <Link to={`/product/${item.slug}`} className="w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="font-medium hover:text-accent truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs text-primary/50">{item.variantLabel}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-secondary text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.key)} className="text-xs text-red-600 hover:underline">
                        <i className="fa-solid fa-trash" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-sm shrink-0">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div className="flex-1">
              <div className="border border-border rounded-xl p-5 bg-white sticky top-24">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-primary/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-primary/60">Shipping</span>
                  <span className="text-accent">Calculated at checkout</span>
                </div>
                <div className="flex justify-between py-3 font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <Link to="/checkout" className="btn-primary w-full justify-center mt-2">
                  Proceed to Checkout
                </Link>
                <Link to="/search" className="block text-center text-sm text-accent mt-4 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
