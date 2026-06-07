import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Star, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

import { AddToCartButton } from "../features/cart/components";
import { useAppDispatch, useAppSelector } from "../hooks";
import DropDownMenu, { type DropDownOption } from "../components/common/DropDownMenu";
import { setCurrentPage } from "../features/productSlice";
import { fetchProducts as fetchProductsAction } from "../features/productSlice";

const CATEGORIES = [
  ["All", "all"],
  ["Homemade Foods", "homemade_foods"],
  ["Fresh Groceries", "fresh_groceries"],
  ["Traditional Snacks", "traditional_snacks"],
  ["Kitchen Essentials", "kitchen_essentials"]
];

const SORT_OPTIONS: DropDownOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, currentPage, totalPages, totalCount } = useAppSelector(
    (state) => state.products,
  );

  const location = useLocation();
  const urlSearchQuery = new URLSearchParams(location.search).get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [priceRange, setPriceRange] = useState<number>(350);
  const [sortOrder, setSortOrder] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getReviewCount = (reviews: unknown) => {
    if (Array.isArray(reviews)) return reviews.length;
    if (typeof reviews === "number") return reviews;
    return 0;
  };

  const sortedProducts = useMemo(() => {
    const list = [...(products ?? [])];
    switch (sortOrder) {
      case "price-low":
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case "rating":
        return list.sort((a, b) => Number(b.rating) - Number(a.rating));
      default:
        return list;
    }
  }, [products, sortOrder]);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    const categoryParam = selectedCategory === "all" ? "" : selectedCategory;
    dispatch(
      fetchProductsAction({
        page: currentPage,
        category: categoryParam,
        search: searchQuery,
        sort: sortOrder,
      }),
    );
  }, [currentPage, selectedCategory, searchQuery, sortOrder, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange(350);
    setSortOrder("featured");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-left space-y-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Our Collection
        </h1>
        <p className="text-sm text-text-muted">
          Discover a curated list of premium accessories, state-of-the-art
          office products, and high-quality electronics tailored to augment your
          productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 p-6 rounded-2xl bg-bg-surface/60 border border-border/80 backdrop-blur-md text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h2 className="font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-accent hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          {/* Search Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Search Products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Type keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-bg-dark py-2 pl-9 pr-4 text-xs text-white border border-border/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Category
            </label>
            <nav className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat[1]}
                  onClick={() => setSelectedCategory(cat[1])}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat[1]
                      ? "text-white bg-primary shadow-md"
                      : "text-text-muted hover:text-white hover:bg-border/50"
                  }`}
                >
                  {cat[0]}
                </button>
              ))}
            </nav>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold uppercase tracking-wider text-text-muted">
                Max Price
              </label>
              <span className="font-mono text-accent font-bold">
                ₹ {priceRange}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="350"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-mono">
              <span>₹ 20</span>
              <span>₹ 350</span>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Toggle Button & Search (LG:Hidden) */}
        <div className="lg:hidden col-span-1 flex gap-3 items-center w-full">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-bg-surface/60 py-2 pl-9 pr-4 text-xs text-white border border-border focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bg-surface border border-border text-xs font-semibold text-white hover:text-accent"
          >
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            Filters
          </button>
        </div>

        {/* Mobile Filter Panel (Drawer-like overlay) */}
        {showMobileFilters && (
          <div className="lg:hidden col-span-1 p-6 rounded-2xl bg-bg-surface border border-border text-left space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-bold text-white text-sm">Filters</h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-accent flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Categories
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat[1]}
                    onClick={() => setSelectedCategory(cat[1])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat[1] 
                        ? "bg-primary text-white"
                        : "bg-border/50 text-text-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Max Price</span>
                <span className="font-mono text-accent font-bold">
                  ₹ {priceRange}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="350"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none accent-accent"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-accent"
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Products Grid Section (9 Cols) */}
        <section className="lg:col-span-9 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-bg-surface/30 px-4 py-3 rounded-xl border border-border/80 backdrop-blur-xs">
            <p className="text-xs text-text-muted text-left w-full sm:w-auto">
              Showing <span className="text-white font-bold">{(sortedProducts ?? []).length}</span> of {totalCount ?? 0} products
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-text-muted whitespace-nowrap">Sort by</span>
              <div className="w-full sm:w-auto">
                <DropDownMenu
                  options={SORT_OPTIONS}
                  value={sortOrder}
                  onChange={setSortOrder}
                  buttonClassName="bg-bg-dark text-white text-xs px-3 py-2.5 rounded-lg border border-border/50 focus:outline-none focus:border-accent"
                  className="w-full sm:w-auto"
                  placeholder="Sort products"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col rounded-2xl bg-bg-surface/20 border border-border/50 p-4"
                >
                  <div className="h-44 w-full rounded-xl bg-bg-surface/40 mb-4" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-bg-surface/40" />
                    <div className="h-4 w-1/2 rounded bg-bg-surface/40" />
                    <div className="h-8 w-full rounded bg-bg-surface/40 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (products ?? []).length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-bg-surface/30 border border-border/80">
              <SlidersHorizontal className="h-10 w-10 text-text-muted opacity-60 mx-auto mb-4" />
              <h3 className="font-bold text-white text-base">No Products Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                We couldn't find any items matching your selected criteria. Try adjusting your sliders or keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-border hover:bg-border/80 text-xs font-semibold text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(sortedProducts ?? []).map((prod) => (
                  <div
                    key={prod.id}
                    className="glow-card flex flex-col rounded-2xl bg-bg-surface/40 border border-border/50 hover:border-accent/30 p-4 relative overflow-hidden text-left"
                  >
                    <div className="relative h-44 w-full rounded-xl flex items-center justify-center border border-border/60 overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="h-full w-full object-contain" />
                      {prod.badge && (
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            prod.badge === "Best Seller"
                              ? "bg-accent text-white"
                              : prod.badge === "New"
                                ? "bg-primary text-white"
                                : "bg-accent text-white"
                          }`}
                        >
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between pt-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
                          {prod.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-1 text-text-muted text-xs">
                          <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                          <span className="font-semibold text-white">{prod.rating}</span>
                          <span className="text-text-muted">({getReviewCount(prod.reviews)})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-auto">
                        <span className="text-sm font-extrabold text-white">
                          ₹ {Number(prod.price).toFixed(2)}
                        </span>
                        <AddToCartButton
                          product={{
                            id: prod.id,
                            name: prod.name,
                            price: Number(prod.price),
                            image: prod.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSk4WOybfG_FgAq3fJh3dhl-DxD4fTlf8glw&s",
                            stock: 50,
                            category: prod.category || "",
                            rating: prod.rating,
                            reviews: getReviewCount(prod.reviews),
                          }}
                          className="px-3 py-1.5 text-xs"
                          showSuccessFeedback={true}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg-surface px-4 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-border/80"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-semibold transition-colors ${
                        page === currentPage
                          ? "border-accent bg-accent text-black"
                          : "border-border/60 bg-bg-surface text-white hover:border-accent hover:bg-border/80"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg-surface px-4 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-border/80"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
