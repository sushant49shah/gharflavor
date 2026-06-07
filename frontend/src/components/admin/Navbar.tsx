import { Bell, Search, ChevronDown, CalendarDays } from "lucide-react";

// Purpose: Top navigation bar for the admin dashboard.
// Props:
//   title - main page title shown in the header.
//   subtitle - supporting subtitle text.
// Usage: Add to the AdminLayout so every admin page has a consistent top bar.
const Navbar = () => {
  return (
    <header className="border-b sticky top-0 z-10 border-border/60 bg-bg-dark/70 px-4 py-4 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-bg-surface/60 px-5 py-2 text-md font-semibold uppercase tracking-[0.2em] text-primary">
              Admin dashboard
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-bg-surface/90 px-4 py-3 text-text-base border border-border/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search products, orders, customers..."
              className="w-62.5 bg-transparent text-sm text-white placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bg-surface/60 text-text-base hover:bg-bg-surface/80 transition-colors cursor-not-allowed   ">
            <Bell className="h-5 w-5" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-bg-surface/60 hover:bg-bg-surface/80 px-4 py-3 text-sm text-text-base transition-colors">
            <CalendarDays className="h-4 w-4 text-text-muted" />
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
