import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Breadcrumb from "../../components/site/Breadcrumb.jsx";
import Reveal from "../../components/site/Reveal.jsx";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast("Logged out");
    navigate("/");
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Account" }]} />

      <div className="max-w-container mx-auto px-5 md:px-8 pt-0 pb-10 md:pt-0 md:pb-20">
        <Reveal className="surface-card p-5 md:p-10 max-w-lg mx-auto">
          <span className="eyebrow">Your profile</span>
          <h1 className="section-title mt-3 mb-6 md:mt-4 md:mb-8">My Account</h1>

          <div className="space-y-4 text-[0.92rem]">
            <div className="flex justify-between py-3 border-b border-border/60">
              <span className="text-primary/50">Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border/60">
              <span className="text-primary/50">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex justify-between py-3 border-b border-border/60">
                <span className="text-primary/50">Phone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/track" className="btn-accent flex-1 justify-center">
              <i className="fa-solid fa-truck-fast text-[0.75rem]" /> My orders
            </Link>
            <button onClick={handleLogout} className="btn-soft flex-1 justify-center">
              <i className="fa-solid fa-right-from-bracket text-[0.75rem]" /> Logout
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
