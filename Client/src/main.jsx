import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";
import { ConfirmProvider } from "./components/admin/ConfirmDialog.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <AdminAuthProvider>
            <SiteDataProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </SiteDataProvider>
          </AdminAuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
