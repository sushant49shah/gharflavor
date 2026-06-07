import { type ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Grid,
  Package,
  ShoppingBag,
  Users,
  Truck,
  Star,
  Shield,
  Settings,
} from "lucide-react";
import Icon from "../../assets/icon.svg";

interface NavLink {
  label: string;
  href: string;
  icon: ComponentType<any>;
}

const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/admin", icon: Grid },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Chefs", href: "/admin/chefs", icon: Users },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Admin Users", href: "/admin/admin-users", icon: Shield },
  { label: "Roles", href: "/admin/roles", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

// Purpose: Sidebar navigation for the admin dashboard.
// Props: None.
// Usage: Display navigation links and active state for admin pages.
const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-border/60 bg-bg-dark p-6 md:flex sticky top-0 h-screen">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-bg-surface/60 px-4 py-3 shadow-md shadow-black/20">
          <Link to="/">
            <img
              src={Icon}
              alt="GharFlavour icon"
              className="h-12 w-12 bg-transparent"
            />
          </Link>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
              Admin panel
            </p>
            <Link to="/">
              <p className="text-lg font-semibold text-white">GharFlavour</p>
            </Link>
          </div>
        </div>
        <p className="text-sm leading-6 text-text-muted">
          Manage orders, reviews, inventory, coupons and growth metrics from one
          premium dashboard.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navLinks.map((link) => {
          const active = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10"
                  : "text-text-muted hover:bg-bg-surface/40 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
