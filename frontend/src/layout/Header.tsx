import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectTotalQuantity } from "../features/cart/cartSelectors";
import { logoutUser } from "../features/user/userSlice";
import Logo from '../assets/gharflavour.svg'
import { API_BASE_URL } from "../app/axios";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get cart count from Redux
  const cartCount = useAppSelector(selectTotalQuantity);
  const { userInfo } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    const searchPath = trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products';
    navigate(searchPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full py-2 border-b border-border/60 bg-bg-dark/70 backdrop-blur-md transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4 md:justify-center md:space-x-12">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <img
              src={Logo}
              alt="GharFlavour Logo"
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,83,42,0.15)]"
            />
          </Link>

          {/* Search bar — desktop */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full group">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit(searchValue);
                  }
                }}
                placeholder="Search home food & groceries..."
                className="w-full rounded-full bg-bg-surface/90 py-2 pl-10 pr-12 text-sm text-white placeholder-text-muted/50 border border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => handleSearchSubmit(searchValue)}
                className="text-sm absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                Search
              </button>
            </div>
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 group ${active
                    ? "text-primary"
                    : "text-text-muted hover:text-white"
                    }`}
                >
                  {link.label}
                  {/* Active indicator line */}
                  <span
                    className={`absolute -bottom-px left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-300 ${active ? "w-5" : "w-0 group-hover:w-4 group-hover:bg-text-muted"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2.5 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:rotate-3 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/25 border-2 border-bg-dark animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User — hidden on small mobile */}
            {userInfo ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    aria-label="Account Menu"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-text-muted hover:text-primary hover:bg-primary/10 border border-border/80 hover:border-primary/20 transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenu.Trigger>
                
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={5}
                    className="min-w-40 bg-bg-surface border border-border rounded-xl p-1.5 shadow-2xl z-50 text-left animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/profile"
                        className="flex items-center w-full px-3 py-2 text-xs font-semibold text-text-muted hover:text-white hover:bg-primary/10 rounded-lg outline-none cursor-pointer transition-colors"
                      >
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    {userInfo.isAdmin && (
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/admin"
                          rel="noopener noreferrer"
                          className="flex items-center w-full px-3 py-2 text-xs font-semibold text-text-muted hover:text-white hover:bg-primary/10 rounded-lg outline-none cursor-pointer transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Separator className="h-px bg-border my-1" />
                    <DropdownMenu.Item
                      onSelect={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg outline-none cursor-pointer transition-colors"
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-accent text-white text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <User className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger asChild>
                <button
                  aria-label="Open menu"
                  className="md:hidden p-2.5 rounded-full text-text-muted hover:text-white hover:bg-bg-surface transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
                <Dialog.Content
                  className="fixed top-0 right-0 h-full w-72 bg-bg-dark border-l border-border z-50 flex flex-col p-6 focus:outline-none backdrop-blur-md shadow-2xl"
                  aria-describedby={undefined}
                >
                  <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>

                  {/* Mobile header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span className="font-bold text-white tracking-tight">GharFlavour</span>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="Close menu"
                        className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-bg-surface transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Mobile search */}
                  <div className="relative mb-6">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      value={mobileSearchValue}
                      onChange={(e) => setMobileSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchSubmit(mobileSearchValue);
                        }
                      }}
                      placeholder="Search items..."
                      className="w-full rounded-lg bg-bg-surface py-2 pl-9 pr-4 text-sm text-white placeholder-text-muted/60 border border-border focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Mobile nav links */}
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Dialog.Close key={link.href} asChild>
                        <Link
                          to={link.href}
                          className={`flex items-center px-3 py-3 rounded-md text-sm font-semibold transition-colors ${isActive(link.href)
                            ? "text-primary bg-bg-surface"
                            : "text-text-muted hover:text-white hover:bg-bg-surface"
                            }`}
                        >
                          {link.label}
                        </Link>
                      </Dialog.Close>
                    ))}
                  </nav>

                  {/* Mobile bottom — user account */}
                  <div className="mt-auto pt-6 border-t border-border space-y-3">
                    {userInfo ? (
                      <>
                        <div className="flex items-center gap-3 px-3 py-1 text-sm font-semibold text-white">
                          <User className="h-5 w-5 text-primary animate-pulse" />
                          <span className="truncate">{userInfo.name}</span>
                        </div>
                        <Dialog.Close asChild>
                          <Link
                            to="/profile"
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-text-muted hover:text-white hover:bg-bg-surface transition-colors"
                          >
                            Profile
                          </Link>
                        </Dialog.Close>
                        {userInfo.isAdmin && (
                          <a
                            href={`${API_BASE_URL}/admin/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-text-muted hover:text-white hover:bg-bg-surface transition-colors"
                          >
                            Admin Panel
                          </a>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Dialog.Close asChild>
                        <Link
                          to="/login"
                          className="flex w-full items-center justify-center gap-2 px-3 py-3 rounded-xl bg-linear-to-r from-primary to-accent text-sm font-semibold text-white shadow-lg hover:shadow-primary/20 transition-all text-center"
                        >
                          <User className="h-4 w-4" />
                          Sign In
                        </Link>
                      </Dialog.Close>
                    )}
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
