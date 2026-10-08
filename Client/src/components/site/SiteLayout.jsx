import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OfferBar from "./OfferBar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import WhatsAppFloat from "./WhatsAppFloat.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="site-shell min-h-screen flex flex-col">
      <OfferBar />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
