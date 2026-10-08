import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  return (
    <div className="max-w-container mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl"
      >
        <i className="fa-solid fa-check" />
      </motion.div>
      <h1 className="font-serif text-2xl md:text-3xl mb-3">Order Placed!</h1>
      <p className="text-primary/55 mb-2">
        Your order number is{" "}
        <strong className="text-primary bg-accent/10 text-accent px-2.5 py-1 rounded-full">{orderNumber}</strong>
      </p>
      <p className="text-primary/45 mb-8 max-w-md mx-auto">
        We&apos;ve opened a WhatsApp chat with your order details. Confirm payment and delivery details there — our
        team will follow up shortly. You can also track this order any time using your order number and phone.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to={`/track?orderNumber=${orderNumber}`} className="btn-accent">
          Track This Order
        </Link>
        <Link to="/" className="btn-soft">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
