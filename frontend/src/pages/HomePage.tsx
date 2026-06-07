import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ArrowDown } from "lucide-react";
import HeroSection from "../components/homepage/HeroSection";
import ProductCard from "../components/ProductCard";

// data imported from products.ts
import { FEATURED_PRODUCTS, VALUE_PROPOSITIONS } from "../data/products";
import { CATEGORIES } from "../data/products";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="space-y-16 py-8 md:py-12 overflow-x-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Shop by Categories
          </h2>
          <p className="text-sm text-text-muted">
            Find products matching your specific workspace setup and lifestyle
            demands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to="/products"
              className={`glow-card block p-6 rounded-2xl bg-bg-surface/60 border border-border/50 hover:border-accent/40 text-left relative overflow-hidden group`}
            >
              <div className="relative z-10 flex flex-col justify-between h-full min-h-25">
                <div>
                  <h3 className="text-lg font-bold text-white ">{cat.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{cat.items}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-accent font-semibold pt-4 group-hover:text-primary">
                  Explore Now
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Featured Products
            </h2>
            <p className="text-sm text-text-muted">
              Discover our highest-rated items picked by professionals globally.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-primary transition-colors group"
          >
            View all products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              price={prod.price}
              imageUrl={prod.imageUrl}
              rating={prod.rating}
              reviews={prod.reviews}
              category={prod.category}
              stock={prod.stock}
              badge={
                prod.badge as
                  | "Best Seller"
                  | "New"
                  | "Limited Stock"
                  | undefined
              }
            />
          ))}
        </div>
      </section>

      {/* 4. Value Propositions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 md:p-12 rounded-3xl bg-bg-surface/50 border border-border/50 backdrop-blur-xs">
          {VALUE_PROPOSITIONS.map((vp) => (
            <div
              key={vp.id}
              className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3"
            >
              <div className="p-3 rounded-xl bg-accent/10 text-primary border border-accent/20">
                <vp.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">{vp.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed max-w-50">
                {vp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. A arrow pointing downwards to indicate more content below fold */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center mt-4 animate-bounce transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ArrowDown className="h-7 w-7 text-text-muted" />
      </div>
    </div>
  );
};

export default HomePage;
