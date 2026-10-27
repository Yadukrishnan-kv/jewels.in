import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api, imageUrl } from "../../api/client.js";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";
import Reveal from "../../components/site/Reveal.jsx";
import { PageSpinner } from "../../components/site/Skeletons.jsx";
import { formatPrice } from "../../utils/currency.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";

export default function ProductDetail() {
  const { settings } = useSiteData();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    setData(null);
    setVariantIdx(0);
    setQty(1);
    setImgIdx(0);
    setZoomIndex(null);
    api.get(`/products/${slug}`).then(setData).catch(() => setData(false));
    window.scrollTo(0, 0);
  }, [slug]);

  const product = data?.product;
  const variant = product?.variants?.[variantIdx];
  const wishlisted = product ? isWishlisted(product._id) : false;

  const stockState = useMemo(() => {
    if (!variant) return null;
    if (variant.stock <= 0) return "out";
    if (variant.stock <= 10) return "low";
    return "in";
  }, [variant]);

  if (data === false) {
    return (
      <div className="py-28 text-center text-primary/55">
        <div className="w-14 h-14 mx-auto mb-5 border border-border/70 flex items-center justify-center text-primary/30">
          <i className="fa-regular fa-face-dizzy" />
        </div>
        <p className="micro text-primary/40 mb-2">Not found</p>
        Product not found.
      </div>
    );
  }
  if (!data) {
    return <PageSpinner label="Fetching product details..." />;
  }

  function handleAddToCart(andBuyNow) {
    if (!variant || variant.stock <= 0) return;
    if (qty > variant.stock) {
      showToast(`Only ${variant.stock} units available in stock!`, "error");
      return;
    }
    addItem(product, variant, qty);
    if (andBuyNow) navigate("/cart");
  }

  function handleWishlist() {
    toggle(product);
  }

  const price = variant?.discountPrice || variant?.price || 0;
  const hasDiscount = variant?.discountPrice > 0;
  const subtotal = price * qty;
  const hasDetails = product.specs?.length > 0 || product.description;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          {
            label: product.category?.name || "Category",
            to: product.category ? `/category/${product.category.slug}` : undefined,
          },
          { label: product.name },
        ]}
      />

      <div className="max-w-container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 pb-14 md:pb-20">
          {/* Gallery */}
          <div className="lg:sticky lg:top-[92px] lg:self-start">
            {(() => {
              const images = product.images?.length ? product.images : [""];
              const safeIdx = Math.min(imgIdx, images.length - 1);
              return (
                <>
                  <div className="relative bg-[#ebe6dc] h-[min(88vw,460px)] md:h-[520px] lg:h-[min(36vw,580px)] overflow-hidden">
                    <img
                      src={imageUrl(images[safeIdx])}
                      alt={product.name}
                      onClick={() => setZoomIndex(safeIdx)}
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/800x800/ebe6dc/1a1a1a?text=No+Image")}
                      className="absolute inset-0 w-full h-full object-contain p-4 cursor-zoom-in animate-[fadeIn_0.3s_ease]"
                      key={safeIdx}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setImgIdx((safeIdx - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/94 backdrop-blur border border-border/70 rounded-[2px] flex items-center justify-center text-primary/70 hover:text-accent hover:bg-white transition-all shadow-soft"
                          aria-label="Previous image"
                        >
                          <i className="fa-solid fa-chevron-left text-[0.7rem]" />
                        </button>
                        <button
                          onClick={() => setImgIdx((safeIdx + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/94 backdrop-blur border border-border/70 rounded-[2px] flex items-center justify-center text-primary/70 hover:text-accent hover:bg-white transition-all shadow-soft"
                          aria-label="Next image"
                        >
                          <i className="fa-solid fa-chevron-right text-[0.7rem]" />
                        </button>
                        <span className="absolute bottom-3 right-3 micro bg-white/90 backdrop-blur px-2.5 py-1.5 text-primary/60 tabular-nums pointer-events-none">
                          {safeIdx + 1} / {images.length}
                        </span>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-0.5">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          aria-label={`View image ${i + 1}`}
                          className={`w-[62px] h-[62px] md:w-[72px] md:h-[72px] shrink-0 overflow-hidden border transition-all duration-300 ${
                            i === safeIdx ? "border-primary opacity-100" : "border-border/70 opacity-55 hover:opacity-90"
                          }`}
                        >
                          <img src={imageUrl(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Info */}
          <div className="lg:py-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                {product.category && (
                  <Link
                    to={`/category/${product.category.slug}`}
                    className="micro text-primary/40 hover:text-accent transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}
                <h1 className="font-serif text-[1.7rem] md:text-[2.3rem] leading-[1.08] tracking-[-0.02em] text-primary mt-2.5">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() =>
                  navigator.share
                    ? navigator.share({ title: product.name, url: window.location.href })
                    : navigator.clipboard.writeText(window.location.href).then(() => showToast("Link copied!"))
                }
                className="w-10 h-10 shrink-0 border border-border/70 bg-white flex items-center justify-center text-primary/55 transition-colors hover:border-primary/40 hover:text-accent"
                aria-label="Share"
              >
                <i className="fa-solid fa-share-nodes text-[0.8rem]" />
              </button>
            </div>

            {stockState && (
              <div
                className={`inline-flex items-center gap-2 micro mt-5 px-3 py-1.5 border ${
                  stockState === "out"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : stockState === "low"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {stockState === "out"
                  ? "Out of stock"
                  : stockState === "low"
                  ? `Only ${variant.stock} left`
                  : `In stock · ${variant.stock} available`}
              </div>
            )}

            <div className="flex items-baseline gap-3.5 flex-wrap mt-6 pb-6 border-b border-border/60">
              <span className="text-[1.7rem] md:text-[1.9rem] font-semibold text-primary tabular-nums">{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-[0.95rem] text-primary/30 line-through tabular-nums">{formatPrice(variant.price)}</span>
                  <span className="micro text-accent border border-accent/25 bg-accent/5 px-2.5 py-1">
                    Save {formatPrice(variant.price - variant.discountPrice)}
                  </span>
                </>
              )}
            </div>

            {product.variants?.length > 1 && (
              <div className="mt-6">
                <span className="micro text-primary/40 block mb-3.5">Select variant</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={v._id}
                      onClick={() => {
                        setVariantIdx(i);
                        setQty(1);
                      }}
                      className={`px-4 py-2.5 border text-[0.8rem] transition-all duration-300 ${
                        i === variantIdx
                          ? "border-primary bg-primary text-secondary"
                          : "border-border/70 bg-white text-primary/70 hover:border-primary/40"
                      } ${v.stock <= 0 ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                      disabled={v.stock <= 0}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stockState !== "out" && (
              <>
                <div className="mt-7 flex flex-wrap items-end gap-x-10 gap-y-4">
                  <div>
                    <span className="micro text-primary/40 block mb-3.5">Quantity</span>
                    <div className="inline-flex items-center border border-border/70 bg-white">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-11 h-11 flex items-center justify-center text-primary/60 hover:text-accent transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <i className="fa-solid fa-minus text-[0.65rem]" />
                      </button>
                      <span className="w-[56px] text-center text-[0.95rem] font-semibold tabular-nums">{qty}</span>
                      <button
                        onClick={() => {
                          if (qty < variant.stock) setQty((q) => q + 1);
                          else showToast(`Only ${variant.stock} units available in stock!`, "warning");
                        }}
                        className="w-11 h-11 flex items-center justify-center text-primary/60 hover:text-accent transition-colors"
                        aria-label="Increase quantity"
                      >
                        <i className="fa-solid fa-plus text-[0.65rem]" />
                      </button>
                    </div>
                  </div>
                  <div className="pb-1">
                    <span className="micro text-primary/40 block mb-2">Subtotal</span>
                    <span className="text-[1.05rem] font-semibold text-primary tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button onClick={() => handleAddToCart(false)} className="flex-1 btn-accent">
                    Add to bag
                  </button>
                  <button onClick={() => handleAddToCart(true)} className="flex-1 btn-ink">
                    Buy it now
                  </button>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <button
                onClick={handleWishlist}
                className={`flex-1 inline-flex items-center justify-center gap-2.5 micro py-4 px-7 rounded-[2px] border transition-colors duration-300 ${
                  wishlisted
                    ? "border-[#ffcdd2] text-[#c00002] bg-[#c00002]/[0.03] hover:border-[#c00002]"
                    : "border-border/70 bg-white text-primary/70 hover:border-primary/40"
                }`}
              >
                <i className={wishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
                {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${window.location.href})`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 micro py-4 px-7 rounded-[2px] border border-[#25D366]/40 text-[#128C7E] bg-[#25D366]/[0.06] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors duration-300"
              >
                <i className="fa-brands fa-whatsapp" /> Chat with us
              </a>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-px bg-border/60 border border-border/60 mt-8">
              {[
                { icon: "fa-solid fa-truck-fast", label: "Pan-India shipping" },
                { icon: "fa-solid fa-shield-halved", label: "Tarnish-resistant" },
                { icon: "fa-brands fa-whatsapp", label: "COD & UPI support" },
              ].map((t) => (
                <div key={t.label} className="bg-white px-3 py-4 text-center">
                  <i className={`${t.icon} text-accent text-[0.8rem] block mb-2`} />
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-primary/50 leading-tight block">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details accordion */}
        {hasDetails && (
          <Reveal className="border-t border-border/60 mb-16 md:mb-24">
            <button
              onClick={() => setDetailsOpen((v) => !v)}
              className="w-full flex items-center justify-between py-6 group"
              aria-expanded={detailsOpen}
            >
              <span className="micro text-primary group-hover:text-accent transition-colors">Product details</span>
              <i
                className={`fa-solid fa-chevron-down text-[0.7rem] text-primary/40 transition-transform duration-300 ${
                  detailsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-10 grid md:grid-cols-2 gap-8 md:gap-14 max-w-4xl">
                    {product.specs?.length > 0 && (
                      <ul className="space-y-3.5">
                        {product.specs.map((s, i) => (
                          <li key={i} className="flex gap-3 text-[0.9rem] text-primary/65 leading-relaxed">
                            <i className="fa-solid fa-check text-accent/60 text-[0.65rem] mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                    {product.description && (
                      <p className="text-[0.95rem] leading-[1.75] text-primary/65">{product.description}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        )}
      </div>

      {data.related?.length > 0 && (
        <div className="max-w-container mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <Reveal className="flex items-end justify-between gap-6 mb-8 md:mb-12">
            <div>
              <span className="eyebrow">Keep exploring</span>
              <h2 className="section-title mt-4">{settings.sectionTitles?.relatedProductsTitle || "You may also like"}</h2>
            </div>
          </Reveal>
          <ProductGrid products={data.related} />
        </div>
      )}

      <AnimatePresence>
        {zoomIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setZoomIndex(null)}
          >
            <button
              className="absolute top-5 right-5 w-11 h-11 text-white text-xl flex items-center justify-center border border-white/20 rounded-[2px] hover:bg-white/10 transition-colors"
              onClick={() => setZoomIndex(null)}
              aria-label="Close zoom"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={imageUrl(product.images[zoomIndex])}
              alt={product.name}
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
