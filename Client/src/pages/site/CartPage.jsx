import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { imageUrl } from "../../api/client.js";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";

const QTY_BTN =
  "w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:hover:text-primary";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const { settings } = useSiteData();

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]} />
      <div className="max-w-container mx-auto px-6 lg:px-8 pb-16">
        <h1 className="section-title">{settings.sectionTitles?.cartPageTitle || "Your Shopping Cart"}</h1>

        {items.length === 0 ? (
          <Reveal className="text-center surface-card py-16 md:py-20 px-5">
            <div className="w-20 h-20 xs:w-24 xs:h-24 mx-auto mb-6 rounded-full bg-accent/[0.07] text-accent flex items-center justify-center text-3xl xs:text-4xl">
              <i className="fa-solid fa-bag-shopping" />
            </div>
            <h3 className="font-serif text-xl xs:text-2xl mb-3">Your cart is empty</h3>
            <p className="text-primary/45 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link to="/search" className="btn-accent">
              <i className="fa-solid fa-arrow-right" /> Start Shopping
            </Link>
          </Reveal>
        ) : (
          <div className="flex flex-col md:flex-row flex-wrap gap-10">
            <Reveal direction="left" className="flex-[2] min-w-[300px]">
              {/* Desktop / tablet: full table, matches the original site */}
              <div className="hidden md:block surface-card overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead className="bg-accent text-white">
                    <tr>
                      <th className="text-left font-semibold text-[0.85rem] tracking-wide px-5 py-[18px]">Product</th>
                      <th className="text-left font-semibold text-[0.85rem] tracking-wide px-5 py-[18px]">Price</th>
                      <th className="text-left font-semibold text-[0.85rem] tracking-wide px-5 py-[18px]">Quantity</th>
                      <th className="text-left font-semibold text-[0.85rem] tracking-wide px-5 py-[18px]">Total</th>
                      <th className="px-5 py-[18px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.key} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/40">
                        <td className="p-5">
                          <div className="flex items-center gap-5">
                            <Link
                              to={`/product/${item.slug}`}
                              className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#f5f2ed] flex items-center justify-center"
                            >
                              <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                            </Link>
                            <div>
                              <Link to={`/product/${item.slug}`} className="font-semibold text-[1rem] hover:text-accent transition-colors">
                                {item.name}
                              </Link>
                              <p className="text-[0.75rem] text-primary/40">{item.variantLabel}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-semibold text-accent">{formatPrice(item.price)}</span>
                        </td>
                        <td className="p-5">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => updateQty(item.key, item.qty - 1)} disabled={item.qty <= 1} className={QTY_BTN}>
                              -
                            </button>
                            <input
                              value={item.qty}
                              readOnly
                              className="w-[60px] text-center border border-border rounded-xl py-2 text-[0.9rem] font-medium"
                            />
                            <button
                              onClick={() => updateQty(item.key, item.qty + 1)}
                              disabled={item.qty >= item.stock}
                              className={QTY_BTN}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-5 font-semibold">{formatPrice(item.price * item.qty)}</td>
                        <td className="p-5">
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove item"
                            className="text-[#c00002] text-[1.1rem] transition-transform duration-200 hover:text-[#ff0000] hover:scale-110"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: stacked cards — a table can't lay out legibly at phone widths */}
              <div className="md:hidden space-y-4">
                {items.map((item) => (
                  <div key={item.key} className="surface-card p-4">
                    <div className="flex gap-3">
                      <Link
                        to={`/product/${item.slug}`}
                        className="w-[70px] h-[70px] shrink-0 rounded-2xl overflow-hidden bg-[#f5f2ed] flex items-center justify-center"
                      >
                        <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/product/${item.slug}`} className="font-semibold text-[0.95rem] leading-snug hover:text-accent transition-colors">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove item"
                            className="shrink-0 text-[#c00002] text-[1rem] transition-transform duration-200 hover:text-[#ff0000] hover:scale-110"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                        <p className="text-[0.75rem] text-primary/40">{item.variantLabel}</p>
                        <span className="font-semibold text-accent text-[0.9rem]">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => updateQty(item.key, item.qty - 1)} disabled={item.qty <= 1} className={QTY_BTN}>
                          -
                        </button>
                        <input
                          value={item.qty}
                          readOnly
                          className="w-12 text-center border border-border rounded-xl py-1.5 text-[0.9rem] font-medium"
                        />
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className={QTY_BTN}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-[0.95rem]">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between flex-wrap gap-4 mt-8">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2.5 bg-white text-accent font-semibold rounded-full px-6 py-3 shadow-soft transition-all duration-300 ease-premium hover:gap-3.5 hover:shadow-card"
                >
                  <i className="fa-solid fa-arrow-left" /> Continue Shopping
                </Link>
              </div>
            </Reveal>

            <Reveal direction="right" className="flex-1 min-w-[280px]">
              <div className="surface-card p-5 xs:p-[30px] md:sticky md:top-[140px]">
                <h3 className="font-serif text-[1.3rem] text-center mb-6">Order Summary</h3>
                <div className="flex justify-between py-[15px] border-b border-border">
                  <span className="text-primary/55">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-[15px] border-b border-border">
                  <span className="text-primary/55">Shipping</span>
                  <span className="font-semibold text-accent">Calculated at checkout</span>
                </div>
                <div className="flex justify-between pt-5 font-bold text-[1.1rem]">
                  <span>Total</span>
                  <span className="text-accent text-[1.3rem]">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/checkout" className="btn-accent w-full justify-center mt-[30px]">
                  Proceed to Checkout
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
