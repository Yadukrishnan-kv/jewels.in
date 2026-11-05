import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";

const EMPTY_FORM = { name: "", email: "", phone: "", password: "" };

export default function SignupPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim());
      showToast("Account created — welcome!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Sign Up" }]} />

      <div className="max-w-container mx-auto px-5 md:px-8 pt-0 pb-10 md:pt-0 md:pb-20">
        <Reveal className="surface-card p-5 md:p-10 max-w-md mx-auto">
          <span className="eyebrow">Join us</span>
          <h1 className="section-title mt-3 mb-6 md:mt-4 md:mb-8">Create your account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="field-label">Full name</label>
              <input
                required
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Phone (optional)</label>
              <input
                placeholder="10-digit mobile number"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="field"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation text-[0.65rem]" />
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-accent w-full justify-center mt-2">
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Creating account...
                </>
              ) : (
                <>
                  Sign up <i className="fa-solid fa-arrow-right text-[0.6rem]" />
                </>
              )}
            </button>
          </form>

          <p className="text-[0.85rem] text-primary/55 text-center mt-7">
            Already have an account?{" "}
            <Link to="/login" state={location.state} className="text-accent font-medium hover:underline">
              Login
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
