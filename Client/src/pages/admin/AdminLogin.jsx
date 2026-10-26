import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { imageUrl } from "../../api/client.js";

export default function AdminLogin() {
  const { login, token, user } = useAdminAuth();
  const { settings } = useSiteData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token && user) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center p-16">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-8">
            <i className="fa-solid fa-gem text-accent-light text-xl" />
          </div>
          <h1 className="font-serif text-white text-3xl leading-tight mb-4">
            Run the whole store from one calm place.
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Products, orders, homepage content, and settings — manage every part of {settings.siteName || "your store"} without touching code.
          </p>
          <div className="flex items-center gap-6 mt-10 pt-10 border-t border-white/10">
            <div>
              <p className="text-white text-xl font-semibold">24/7</p>
              <p className="text-white/40 text-xs mt-0.5">Always available</p>
            </div>
            <div>
              <p className="text-white text-xl font-semibold">Secure</p>
              <p className="text-white/40 text-xs mt-0.5">JWT-protected sessions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center lg:text-left">
            {settings.logo ? (
              <img src={imageUrl(settings.logo)} alt={settings.siteName || "Store"} className="h-9 w-auto object-contain mx-auto lg:mx-0 mb-4" />
            ) : (
              <h2 className="font-serif text-2xl mb-1">{settings.siteName || "Store"}</h2>
            )}
            <h3 className="text-xl font-semibold text-primary">Welcome back</h3>
            <p className="text-sm text-primary/50 mt-1">Sign in to the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="admin-label">Email address</label>
              <div className="relative">
                <i className="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 text-sm" />
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Password</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary/60 text-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <i className="fa-solid fa-circle-exclamation" /> {error}
              </motion.p>
            )}

            <button type="submit" disabled={submitting} className="admin-btn-primary w-full !py-3">
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <i className="fa-solid fa-arrow-right text-xs" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-primary/35 mt-8">Protected admin area &middot; authorized personnel only</p>
        </motion.div>
      </div>
    </div>
  );
}
