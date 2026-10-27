import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";

const QTY_BTN =
  "w-9 h-9 border border-border/70 bg-white flex items-center justify-center text-primary/60 transition-colors duration-200 hover:border-primary/40 hover:text-accent disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-border/70";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, count } = useCart();
  const { settings } = useSiteData();

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]} />

      <div className="border-y border-border/60 bg-white/50">
        <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14 flex items-end justify-between gap-5">
          <div>
            <span className="eyebrow">Your selection</span>
            <h1 className="section-title mt-4">{settings.sectionTitles?.cartPageTitle || "Your Shopping Cart"}</h1>
          </div>
          {items.length > 0 && (
            <p className="micro text-primary/40 tabular-nums shrink-0 pb-2">
              {count} {count === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-container mx-auto px-5 md:px-8 py-10 md:py-14">
        {items.length === 0 ? (
          <Reveal className="text-center border border-border/60 bg-white py-16 md:py-24 px-6 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 border border-border/70 text-primary/25 flex items-center justify-center text-xl">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <p className="micro text-primary/35 mb-3">Empty bag</p>
            <h3 className="font-serif text-2xl mb-3">Your cart is empty</h3>
            <p className="text-[0.9rem] text-primary/50 mb-8">Looks like you haven&apos;t added any items yet.</p>
            <Link to="/search" className="btn-accent">
              Start shopping <i className="fa-solid fa-arrow-right text-[0.6rem]" />
            </Link>
          </Reveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Items */}
            <div className="flex-[1.9] min-w-0">
              <div className="border-t border-border/60">
                {items.map((item) => (
                  <div key={item.key} className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 py-6 border-b border-border/60">
                    <Link
                      to={`/product/${item.slug}`}
                      className="w-[84px] h-[110px] md:w-24 md:h-32 shrink-0 overflow-hidden bg-[#ebe6dc] block"
                    >
                      <img
                        src={imageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover md:grayscale-[15%] hover:grayscale-0 transition-[filter] duration-500"
                      />
                    </Link>

                    <div className="flex-1 min-w-[150px]">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-[0.95rem] font-medium leading-snug hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="micro text-primary/35 mt-1.5">{item.variantLabel}</p>
                      <p className="text-[0.85rem] text-primary/55 mt-1 md:hidden tabular-nums">
                        {formatPrice(item.price)} · <span className="font-semibold text-primary">Total {formatPrice(item.price * item.qty)}</span>
                      </p>
                    </div>

                    <div className="hidden md:block w-24 text-[0.9rem] font-semibold tabular-nums text-primary/70">
                      {formatPrice(item.price)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className={QTY_BTN}
                        aria-label="Decrease quantity"
                      >
                        <i className="fa-solid fa-minus text-[0.6rem]" />
                      </button>
                      <span className="w-9 text-center text-[0.9rem] font-semibold tabular-nums">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className={QTY_BTN}
                        aria-label="Increase quantity"
                      >
                        <i className="fa-solid fa-plus text-[0.6rem]" />
                      </button>
                    </div>

                    <div className="hidden md:block w-24 text-right text-[0.95rem] font-semibold tabular-nums">
                      {formatPrice(item.price * item.qty)}
                    </div>

                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label="Remove item"
                      className="w-9 h-9 flex items-center justify-center text-primary/30 hover:text-[#c00002] transition-colors md:ml-1"
                    >
                      <i className="fa-solid fa-trash-can text-[0.8rem]" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between flex-wrap gap-4 mt-8">
                <Link
                  to="/search"
                  className="micro inline-flex items-center gap-2.5 text-primary/55 hover:text-accent transition-colors group"
                >
                  <i className="fa-solid fa-arrow-left text-[0.6rem] transition-transform duration-300 group-hover:-translate-x-1" />
                  Continue shopping
                </Link>
                <Link to="/wishlist" className="micro text-primary/55 hover:text-accent transition-colors">
                  View wishlist
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="flex-1 min-w-[280px]">
              <div className="surface-card p-6 md:p-7 lg:sticky lg:top-[92px]">
                <h3 className="micro text-primary pb-4 border-b border-primary/15">Order summary</h3>
                <div className="flex justify-between py-4 border-b border-border/60 text-[0.9rem]">
                  <span className="text-primary/55">Subtotal</span>
                  <span className="font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-4 border-b border-border/60 text-[0.9rem]">
                  <span className="text-primary/55">Shipping</span>
                  <span className="text-primary/45">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-baseline pt-5">
                  <span className="micro text-primary/55">Total</span>
                  <span className="text-[1.3rem] font-semibold text-primary tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/checkout" className="btn-accent w-full justify-center mt-7">
                  Proceed to checkout
                </Link>
                <p className="text-[0.75rem] text-primary/40 text-center mt-4 leading-relaxed">
                  Orders are confirmed over WhatsApp · COD &amp; UPI available
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
