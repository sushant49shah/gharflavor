import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  getUserDetails,
  updateUserProfile,
  resetProfileSuccess,
} from "../features/user/userSlice";
import { fetchOrders } from "../features/orders/orderSlice";
import { getOrderStatusClasses } from "../utils/orderStatusStyles";
import {
  User,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    userInfo,
    profileDetails,
    profileLoading,
    profileError,
    profileSuccess,
  } = useAppSelector((state) => state.user);

  const { orders, loading } = useAppSelector(
    (state) => state.orders,
  );

  useEffect(() => {
    // If not logged in, redirect to login
    if (!userInfo) {
      navigate("/login");
      return;
    }

    // Fetch details if not already loaded or if the user IDs don't match
    if (!profileDetails || profileDetails.id !== userInfo.id) {
      dispatch(resetProfileSuccess());
      dispatch(getUserDetails());
    } else {
      setName(profileDetails.name);
      setEmail(profileDetails.email);
    }
  }, [dispatch, navigate, userInfo, profileDetails]);

  useEffect(() => {
    if (profileSuccess) {
      setShowSuccessMsg(true);
      setPassword("");
      setConfirmPassword("");
      const timer = setTimeout(() => {
        setShowSuccessMsg(false);
        dispatch(resetProfileSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess, dispatch]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setShowSuccessMsg(false);

    if (!name || !email) {
      setValidationError("Name and Email cannot be empty.");
      return;
    }

    if (password && password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (password && password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    dispatch(
      updateUserProfile({
        name,
        email,
        password: password || undefined,
      }),
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Profile Update Section (Left Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface/40 border border-border/50 backdrop-blur-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              User Profile
            </h2>

            {/* Error alerts */}
            {(validationError || profileError) && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm mb-6">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{validationError || profileError}</span>
              </div>
            )}

            {/* Success alerts */}
            {showSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-sm mb-6">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {profileLoading && !name ? (
              <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <Loader className="h-8 w-8 animate-spin mb-2 text-accent" />
                <p className="text-sm">Loading details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                      placeholder="Leave blank to keep same"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 border border-border rounded-xl bg-bg-dark/50 text-white placeholder-text-muted/50 focus:outline-hidden focus:border-accent transition-all text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full mt-6 py-2.5 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {profileLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Orders Section (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface/40 border border-border/50 backdrop-blur-md min-h-100 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              My Orders
            </h2>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-accent/10 text-accent border border-accent/20 mb-4 animate-pulse">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No Orders Placed Yet
                </h3>
                <p className="text-sm text-text-muted max-w-sm mb-6">
                  When you make an order, you will see it listed here. Time to
                  explore Kathmandu's best home-style dishes!
                </p>
                <Link
                  to="/products"
                  className="py-2.5 px-6 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all inline-flex items-center gap-2 group"
                >
                  Browse Menu
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            )}

            {/* Order List */}
            {orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 rounded-xl bg-bg-dark/50 border border-border/50"
                  >
                    <div className="flex flex-col items-start justify-between">
                      <h3 className="text-lg font-bold text-white mb-2">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-text-muted">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} • {" "}
                        {new Date(order.created_at).toLocaleDateString()}{" - "}{order.created_at.slice(11, 16)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <p className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}>
                        {order.status.toUpperCase()}
                      </p>
                      <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-bg-surface/90 px-3 py-2 rounded-lg cursor-pointer"
                    >
                      View Details →
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
