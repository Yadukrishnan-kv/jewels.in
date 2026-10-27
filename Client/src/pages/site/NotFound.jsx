import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-5 md:px-8 py-24 md:py-36 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="micro text-primary/40">Error 404</span>
        <h1 className="font-serif text-[clamp(4rem,12vw,9rem)] leading-none tracking-[-0.04em] text-primary/12 my-6 select-none">
          404
        </h1>
        <p className="font-serif text-2xl md:text-3xl text-primary tracking-[-0.02em] mb-4">
          This page doesn&apos;t exist
        </p>
        <p className="text-primary/50 mb-10 max-w-sm mx-auto text-[0.95rem] leading-relaxed">
          The piece you&apos;re looking for may have been moved or sold out. Let&apos;s get you back to the good stuff.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/" className="btn-accent">
            <i className="fa-solid fa-house text-[0.65rem]" /> Back to home
          </Link>
          <Link to="/search" className="btn-soft">
            Browse collection
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
