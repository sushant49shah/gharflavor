import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import axiosInstance from "../../app/axios";
import ProductCard from "../ProductCard";

interface Product {
  id: number;
  name: string;
  category: string | null;
  image: string;
  price: number | string;
  rating: number | string;
  reviews: unknown;
  stock: number;
  badge: string | null;
}

interface PaginatedProducts {
  results: Product[];
}

const formatLabel = (value: string | null | undefined) => {
  if (!value || value === "none") return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getReviewCount = (reviews: unknown) => {
  if (Array.isArray(reviews)) return reviews.length;
  if (typeof reviews === "number") return reviews;
  return 0;
};

const FeaturedProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get<PaginatedProducts | Product[]>(
          "/api/products/?badge=featured",
        );
        const results = Array.isArray(data) ? data : data.results ?? [];
        setProducts(results.filter((product) => product.badge === "featured"));
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || "Unable to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
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

      {loading ? (
        <div className="rounded-2xl border border-border/50 bg-bg-surface/40 p-8 text-center text-sm text-text-muted">
          Loading featured products...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-sm text-red-200">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-bg-surface/40 p-8 text-center text-sm text-text-muted">
          No featured products are available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              imageUrl={product.image}
              rating={Number(product.rating)}
              reviews={getReviewCount(product.reviews)}
              category={formatLabel(product.category)}
              stock={product.stock}
              badge={formatLabel(product.badge)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProduct;
