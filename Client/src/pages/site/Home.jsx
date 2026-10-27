import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { api, imageUrl } from "../../api/client.js";
import Reveal, { RevealGroup, RevealItem } from "../../components/site/Reveal.jsx";
import ProductCard from "../../components/site/ProductCard.jsx";
import ProductGrid from "../../components/site/ProductGrid.jsx";
import { PageSpinner } from "../../components/site/Skeletons.jsx";

function bannersOf(banners, section) {
  return (banners || []).filter((b) => b.section === section).sort((a, b) => a.sortOrder - b.sortOrder);
}

function SectionHead({ eyebrow, title, href, linkLabel = "View all", light = false }) {
  const isExternal = href?.startsWith("http");
  return (
    <Reveal className="flex items-end justify-between gap-6 mb-8 md:mb-12">
      <div>
        <span className={`eyebrow ${light ? "text-secondary/60" : ""}`}>{eyebrow}</span>
        <h2 className={`section-title mt-4 ${light ? "text-secondary" : ""}`}>{title}</h2>
      </div>
      {href &&
        (isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`micro hidden md:inline-flex items-center gap-2.5 group ${
              light ? "text-secondary/50 hover:text-white" : "text-primary/45 hover:text-accent"
            } transition-colors`}
          >
            {linkLabel}
            <i className="fa-solid fa-arrow-right text-[0.6rem] transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        ) : (
          <Link
            to={href}
            className={`micro hidden md:inline-flex items-center gap-2.5 group ${
              light ? "text-secondary/50 hover:text-white" : "text-primary/45 hover:text-accent"
            } transition-colors`}
          >
            {linkLabel}
            <i className="fa-solid fa-arrow-right text-[0.6rem] transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        ))}
    </Reveal>
  );
}

function PromoPanel({ banner, className = "", size = "lg", delay = 0 }) {
  return (
    <Reveal delay={delay} className={`relative group overflow-hidden bg-[#ebe6dc] ${className}`}>
      <img
        src={imageUrl(banner.image)}
        alt={banner.title}
        loading="lazy"
        onError={(e) => (e.currentTarget.style.opacity = "0")}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className={`font-serif text-white leading-tight tracking-[-0.01em] ${size === "lg" ? "text-2xl md:text-[2rem]" : "text-lg md:text-xl"}`}>
          {banner.title}
        </h3>
        <Link to={banner.linkUrl || "/search"} className={`pill-button mt-5 ${size === "lg" ? "" : "!px-5 !py-2.5"}`}>
          {banner.ctaLabel || "Shop now"} <i className="fa-solid fa-arrow-right text-[0.6rem]" />
        </Link>
      </div>
    </Reveal>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/homepage")
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="py-28 text-center text-primary/55">
        <div className="w-14 h-14 mx-auto mb-5 border border-border/70 flex items-center justify-center text-primary/30">
          <i className="fa-regular fa-face-dizzy" />
        </div>
        <p className="micro text-primary/40 mb-2">Connection error</p>
        Could not load homepage content. Is the API running?
      </div>
    );
  }
  if (!data) {
    return <PageSpinner label="Curating your collection..." />;
  }

  const titles = data.settings?.sectionTitles || {};
  const hero = bannersOf(data.banners, "hero")[0];
  const promoLarge = bannersOf(data.banners, "promo-large")[0];
  const promoSmall = bannersOf(data.banners, "promo-small");
  const midPromo = bannersOf(data.banners, "mid-promo");
  const story = bannersOf(data.banners, "story");
  const marqueeItems = data.categories?.length ? [...data.categories, ...data.categories] : [];

  return (
    <div>
      {/* ============ Hero ============ */}
      {hero && (
        <section className="relative w-full h-[min(42vh,360px)] md:h-[min(74vh,720px)] overflow-hidden bg-[#ebe6dc]">
          <motion.img
            src={imageUrl(hero.image)}
            alt={hero.title}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </section>
      )}

      {/* ============ Category marquee ============ */}
      {marqueeItems.length > 0 && (
        <div className="border-b border-border/60 bg-white/50 overflow-hidden py-4">
          <div className="flex w-max animate-marquee">
            {marqueeItems.map((c, i) => (
              <span key={`${c._id}-${i}`} className="micro text-primary/45 whitespace-nowrap flex items-center">
                <span className="px-7">{c.name}</span>
                <span className="w-1 h-1 bg-accent/50 rotate-45" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ============ Collections ============ */}
      <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24">
        <SectionHead
          eyebrow="Shop by category"
          title={titles.collectionsTitle || "Collections"}
          href="/search"
        />
        <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-14" stagger={0.06}>
          {data.categories.map((c, i) => (
            <RevealItem key={c._id}>
              <Link to={`/category/${c.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe6dc]">
                  <img
                    src={imageUrl(c.image)}
                    alt={c.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x560/ebe6dc/1a1a1a?text=" + encodeURIComponent(c.name))}
                    className="w-full h-full object-cover md:grayscale-[25%] transition-all duration-700 ease-premium group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <span className="absolute top-3 left-3 micro text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-border/70 group-hover:border-primary/40 transition-colors duration-300">
                  <p className="text-[0.88rem] font-medium text-primary">{c.name}</p>
                  <i className="fa-solid fa-arrow-right text-[0.6rem] text-primary/30 -translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ Virals ============ */}
      {data.viralProducts?.length > 0 && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24">
          <SectionHead
            eyebrow="Trending now"
            title={titles.viralsTitle || "Virals You searching for"}
            href="/search"
          />
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView="auto"
            spaceBetween={20}
            loop
            autoplay={{ delay: 3400, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12 -mx-1 px-1"
          >
            {data.viralProducts.map((p) => (
              <SwiperSlide key={p._id} className="!w-[210px] sm:!w-[240px] md:!w-[280px]">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* ============ Promo composition ============ */}
      {(promoLarge || promoSmall.length > 0) && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-8 md:pt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {promoLarge && <PromoPanel banner={promoLarge} className="aspect-[4/5] md:aspect-auto md:min-h-[560px]" size="lg" />}
          <div className="grid grid-rows-2 gap-4 md:gap-6">
            {promoSmall.map((b, i) => (
              <PromoPanel key={b._id} banner={b} className="aspect-[4/3] md:aspect-auto md:min-h-[268px]" size="sm" delay={i * 0.08} />
            ))}
          </div>
        </section>
      )}

      {/* ============ Minimal Girlies (real products) ============ */}
      {data.minimalGirlies?.length > 0 && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24">
          <SectionHead
            eyebrow="Fresh drops"
            title={titles.minimalGirliesTitle || "For Minimal Girlies"}
            href="/search"
          />
          <ProductGrid products={data.minimalGirlies} variant="home" />
        </section>
      )}

      {/* ============ Mid promos ============ */}
      {midPromo.length > 0 && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {midPromo.map((b, i) => (
            <PromoPanel key={b._id} banner={b} className="min-h-[300px] md:min-h-[380px]" size="lg" delay={i * 0.1} />
          ))}
        </section>
      )}

      {/* ============ Testimonials ============ */}
      {data.testimonials?.length > 0 && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24">
          <SectionHead
            eyebrow="Loved by our customers"
            title={titles.testimonialsTitle || "Our DMs Say It All"}
          />
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1.15}
            spaceBetween={16}
            loop
            autoplay={{ delay: 4200 }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3.2, spaceBetween: 24 },
              1440: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="testimonial-swiper pb-12"
          >
            {data.testimonials.map((t) => (
              <SwiperSlide key={t._id}>
                <div className="bg-white border border-border/60 p-3 group">
                  <div className="overflow-hidden">
                    <img
                      src={imageUrl(t.image)}
                      alt="Customer testimonial"
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover md:grayscale-[30%] transition-[filter,transform] duration-700 ease-premium group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  </div>
                  {t.caption && (
                    <p className="text-[0.8rem] text-primary/55 leading-relaxed pt-3 pb-1 px-0.5">{t.caption}</p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Reveal className="mt-6">
            <a href="https://instagram.com/halajewells" target="_blank" rel="noreferrer" className="btn-soft">
              <i className="fa-brands fa-instagram" /> Visit our Instagram
            </a>
          </Reveal>
        </section>
      )}

      {/* ============ Story ============ */}
      {story.length > 0 && (
        <section className="max-w-container mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-4">
          <SectionHead eyebrow="As seen on" title={titles.storyTitle || "Slaying in the Style"} />
          <RevealGroup className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4" stagger={0.05}>
            {story.map((s) => (
              <RevealItem key={s._id}>
                <div className="relative aspect-square overflow-hidden bg-[#ebe6dc] border border-border/60 group">
                  <img
                    src={imageUrl(s.image)}
                    alt={s.title || ""}
                    loading="lazy"
                    className="w-full h-full object-cover md:grayscale-[30%] transition-all duration-700 ease-premium group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

    </div>
  );
}
