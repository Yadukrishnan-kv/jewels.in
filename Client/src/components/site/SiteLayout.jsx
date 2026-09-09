import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
    <div className="min-h-screen flex flex-col">
      <OfferBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
