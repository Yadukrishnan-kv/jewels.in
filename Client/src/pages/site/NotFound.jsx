import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="max-w-container mx-auto px-4 py-24 md:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/[0.08] text-accent flex items-center justify-center text-3xl">
          <i className="fa-solid fa-gem" />
        </div>
        <h1 className="font-serif text-5xl md:text-6xl mb-4 text-primary">404</h1>
        <p className="text-primary/55 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="btn-accent">
          <i className="fa-solid fa-house" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
