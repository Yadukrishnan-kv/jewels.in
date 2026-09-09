import { Routes, Route } from "react-router-dom";
import SiteLayout from "./components/site/SiteLayout.jsx";
import Home from "./pages/site/Home.jsx";
import CategoryPage from "./pages/site/CategoryPage.jsx";
import SearchPage from "./pages/site/SearchPage.jsx";
import ProductDetail from "./pages/site/ProductDetail.jsx";
import CartPage from "./pages/site/CartPage.jsx";
import WishlistPage from "./pages/site/WishlistPage.jsx";
import CheckoutPage from "./pages/site/CheckoutPage.jsx";
import OrderConfirmation from "./pages/site/OrderConfirmation.jsx";
import TrackOrder from "./pages/site/TrackOrder.jsx";
import ContactUs from "./pages/site/ContactUs.jsx";
import AboutUs from "./pages/site/AboutUs.jsx";
import StaticPage from "./pages/site/StaticPage.jsx";
import NotFound from "./pages/site/NotFound.jsx";

import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductsList from "./pages/admin/ProductsList.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin.jsx";
import BannersAdmin from "./pages/admin/BannersAdmin.jsx";
import PagesAdmin from "./pages/admin/PagesAdmin.jsx";
import OrdersAdmin from "./pages/admin/OrdersAdmin.jsx";
import SettingsAdmin from "./pages/admin/SettingsAdmin.jsx";
import UsersAdmin from "./pages/admin/UsersAdmin.jsx";
import InquiriesAdmin from "./pages/admin/InquiriesAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<StaticPage slug="terms" />} />
        <Route path="/shipping" element={<StaticPage slug="shipping" />} />
        <Route path="/privacy" element={<StaticPage slug="privacy" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="banners" element={<BannersAdmin />} />
        <Route path="pages" element={<PagesAdmin />} />
        <Route path="orders" element={<OrdersAdmin />} />
        <Route path="inquiries" element={<InquiriesAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
      </Route>
    </Routes>
  );
}
