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
import { PageSpinner } from "../../components/site/Skeletons.jsx";

function bannersOf(banners, section) {
  return (banners || []).filter((b) => b.section === section).sort((a, b) => a.sortOrder - b.sortOrder);
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
      <div className="py-28 text-center text-primary/60">
        <i className="fa-regular fa-face-dizzy text-3xl mb-4 block text-primary/30" />
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

  return (
    <div>
      {hero && (
        <section className="relative w-full overflow-hidden bg-[#e8dfcf]">
          <motion.img
            src={imageUrl(hero.image)}
            alt={hero.title}
            initial={{ scale: 1.08, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="w-full max-h-[70vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent pointer-events-none" />
        </section>
      )}

      {/* Collections */}
      <div className="max-w-container mx-auto px-4 md:px-8">
        <Reveal className="text-center mt-14 mb-10">
          <span className="eyebrow">Shop by category</span>
          <h2 className="section-title mt-2">{titles.collectionsTitle || "Collections"}</h2>
        </Reveal>
        <RevealGroup
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:[column-gap:16px] xs:[row-gap:24px] md:[column-gap:24px] md:[row-gap:40px]"
          stagger={0.06}
        >
          {data.categories.map((c) => (
            <RevealItem key={c._id}>
              <Link to={`/category/${c.slug}`} className="group text-center block">
                <div className="aspect-square rounded-[24px] overflow-hidden bg-[#e3d9cb] shadow-soft transition-all duration-500 ease-premium group-hover:shadow-card-hover group-hover:-translate-y-1.5">
                  <img
                    src={imageUrl(c.image)}
                    alt={c.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/300x300/e3d9cb/1a1a1a?text=" + encodeURIComponent(c.name))}
                    className="w-full h-full object-cover grayscale-[15%] transition-transform duration-700 ease-premium group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-3.5 text-[0.9rem] font-medium tracking-[0.5px] text-primary/85 uppercase group-hover:text-accent transition-colors">
                  {c.name}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* Viral products */}
      {data.viralProducts?.length > 0 && (
        <div className="max-w-container mx-auto px-6 md:px-8 mt-20">
          <Reveal className="flex items-end justify-between mb-6">
            <div>
              <span className="eyebrow">Trending now</span>
              <h2 className="font-serif text-xl md:text-2xl mt-1 text-primary">{titles.viralsTitle || "Virals You searching for"}</h2>
            </div>
          </Reveal>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView="auto"
            spaceBetween={18}
            loop
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {data.viralProducts.map((p) => (
              <SwiperSlide key={p._id} className="!w-[220px]">
                <Link to={`/product/${p.slug}`} className="group block text-center">
                  <div className="aspect-square rounded-[22px] overflow-hidden bg-[#e2d8c8] shadow-soft transition-all duration-500 ease-premium group-hover:shadow-card-hover">
                    <img
                      src={imageUrl(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover grayscale-[15%] transition-transform duration-500 ease-premium group-hover:scale-110 group-hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-primary/85 group-hover:text-accent transition-colors">{p.name}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Promo grid */}
      {(promoLarge || promoSmall.length > 0) && (
        <section className="max-w-container mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoLarge && (
            <Reveal direction="left" className="relative rounded-[28px] overflow-hidden aspect-[3/4] md:aspect-auto group">
              <img
                src={imageUrl(promoLarge.image)}
                alt={promoLarge.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex flex-col justify-end p-7">
                <span className="text-white text-xl md:text-2xl font-serif mb-4">{promoLarge.title}</span>
                <Link to={promoLarge.linkUrl || "/search"} className="pill-button w-fit">
                  {promoLarge.ctaLabel || "Shop now"} <i className="fa-solid fa-arrow-right text-[0.65rem]" />
                </Link>
              </div>
            </Reveal>
          )}
          <div className="grid grid-rows-2 gap-4">
            {promoSmall.map((b, i) => (
              <Reveal key={b._id} direction="right" delay={i * 0.08} className="relative rounded-[28px] overflow-hidden aspect-[4/3] group">
                <img
                  src={imageUrl(b.image)}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex flex-col justify-end p-5">
                  <span className="text-white font-serif text-lg mb-3">{b.title}</span>
                  <Link to={b.linkUrl || "/search"} className="pill-button text-xs w-fit px-4 py-1.5">
                    {b.ctaLabel || "Shop now"}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* For Minimal Girlies — heading only; the original site's grid here is empty
          (no products tagged) and the two promo boxes follow immediately */}
      <div className="max-w-container mx-auto px-6 md:px-8 mt-20">
        <h2 className="section-title mb-0">{titles.minimalGirliesTitle || "For Minimal Girlies"}</h2>
      </div>

      {/* Mid promo: Elegance / Soft Sensual Stunning */}
      {midPromo.length > 0 && (
        <section className="max-w-container mx-auto px-6 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-[30px]">
          {midPromo.map((b, i) => (
            <Reveal
              key={b._id}
              delay={i * 0.1}
              className="group relative rounded-[28px] overflow-hidden min-h-[240px] md:min-h-[300px] flex flex-col items-start justify-end text-left p-6 md:p-[38px]"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-premium group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url(${imageUrl(b.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h3 className="relative text-white font-serif text-xl md:text-2xl mb-4">{b.title}</h3>
              <Link to={b.linkUrl || "/search"} className="relative pill-button">
                {b.ctaLabel || "Discover More"} <i className="fa-solid fa-arrow-right text-[0.65rem]" />
              </Link>
            </Reveal>
          ))}
        </section>
      )}

      {/* Testimonials */}
      {data.testimonials?.length > 0 && (
        <div className="max-w-container mx-auto px-4 md:px-8 mt-20">
          <Reveal className="surface-card rounded-[36px] p-6 md:p-10">
            <span className="eyebrow block text-center mb-2">Loved by our customers</span>
            <h2 className="section-title">{titles.testimonialsTitle || "Our DMs Say It All"}</h2>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={20}
              loop
              autoplay={{ delay: 4000 }}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="testimonial-swiper pb-12"
            >
              {data.testimonials.map((t) => (
                <SwiperSlide key={t._id}>
                  <div className="bg-[#fefaf3] border border-border/70 rounded-[26px] p-4 shadow-soft">
                    <img
                      src={imageUrl(t.image)}
                      alt="Testimonial"
                      className="w-full aspect-[1/0.9] object-cover rounded-2xl grayscale-[25%] transition-[filter] duration-500 hover:grayscale-0"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="text-center mt-4">
              <a href="https://instagram.com/halajewells" target="_blank" rel="noreferrer" className="btn-soft">
                <i className="fa-brands fa-instagram" /> Visit our Instagram
              </a>
            </div>
          </Reveal>
        </div>
      )}

      {/* Story grid */}
      {story.length > 0 && (
        <div className="max-w-container mx-auto px-6 md:px-8 mt-20 pb-6">
          <Reveal className="text-center mb-7">
            <p className="font-serif italic text-[1.6rem] font-medium text-accent tracking-[-0.5px]">
              {titles.storyTitle || "Slaying in the Style"}
            </p>
          </Reveal>
          <RevealGroup className="flex flex-wrap justify-center gap-5" stagger={0.08}>
            {story.map((s) => (
              <RevealItem key={s._id}>
                <div className="flex-none w-[150px] bg-secondary border border-border/70 rounded-[26px] overflow-hidden shadow-soft transition-transform duration-500 ease-premium hover:-translate-y-1">
                  <img
                    src={imageUrl(s.image)}
                    alt={s.title || ""}
                    className="w-full aspect-square object-cover grayscale-[25%] transition-[filter] duration-500 hover:grayscale-0"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
    </div>
  );
}
