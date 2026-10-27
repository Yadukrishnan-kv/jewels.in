import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const NEXT_STEPS = [
  { icon: "fa-brands fa-whatsapp", text: "A WhatsApp chat was opened with your order summary — confirm payment (COD or UPI) there." },
  { icon: "fa-solid fa-clock", text: "Our team reviews every order manually and follows up shortly." },
  { icon: "fa-solid fa-truck-fast", text: "Track your delivery any time with your order number and phone." },
];

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-container mx-auto px-5 md:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto"
      >
        <div className="surface-card p-8 md:p-12 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.15 }}
            className="w-16 h-16 mx-auto mb-7 border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl"
          >
            <i className="fa-solid fa-check" />
          </motion.div>

          <span className="micro text-primary/40">Order confirmed</span>
          <h1 className="font-serif text-[2rem] md:text-[2.6rem] leading-[1.08] tracking-[-0.02em] mt-3 mb-4">
            Thank you for your order
          </h1>
          <p className="text-[0.95rem] text-primary/55 max-w-md mx-auto leading-relaxed">
            We&apos;ve received your order and opened a WhatsApp chat with the details.
          </p>

          <div className="inline-flex flex-col items-center border border-primary/15 bg-secondary/60 px-8 py-5 mt-8">
            <span className="micro text-primary/40 mb-1.5">Order number</span>
            <span className="font-serif text-[1.4rem] text-primary tabular-nums">{orderNumber}</span>
          </div>

          <ul className="text-left mt-10 space-y-4 border-t border-border/60 pt-8">
            {NEXT_STEPS.map((s) => (
              <li key={s.text} className="flex gap-3.5 text-[0.88rem] text-primary/60 leading-relaxed">
                <i className={`${s.icon} text-accent text-[0.85rem] mt-0.5 shrink-0 w-5 text-center`} />
                {s.text}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 justify-center flex-wrap mt-10">
            <Link to={`/track?orderNumber=${orderNumber}`} className="btn-accent">
              Track this order
            </Link>
            <Link to="/" className="btn-soft">
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
