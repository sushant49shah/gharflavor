import { CreditCard, ShoppingBag, TrendingUp, Users } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import { useEffect, useState } from "react";
import axiosInstance from "../../app/axios";

// Purpose: Main admin overview page with high-level metrics and mock charts.
// Props: None.
// Usage: Render as the default admin landing page.
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
}
const DashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/api/products/");
        setProducts(response.data.results);
        console.log("Dashboard data:", response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1]">
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Monthly revenue"
              value="₹0"
              trend="+0%"
              icon={<CreditCard className="h-5 w-5" />}
            />
            <StatsCard
              title="New orders"
              value="0"
              trend="+0%"
              icon={<ShoppingBag className="h-5 w-5" />}
            />
            <StatsCard
              title="Active customers"
              value="1"
              trend="+0%"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Return rate"
              value="0%"
              trend="0%"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary">
                    Sales performance
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Revenue growth & projections
                  </h2>
                </div>
                <button className="rounded-full bg-bg-surface/60 hover:bg-bg-surface/80 px-4 py-3 text-sm font-semibold text-text-base transition-colors">
                  View report
                </button>
              </div>
              <div className="mt-8 h-72 rounded-2xl bg-linear-to-br from-bg-surface/40 via-bg-dark to-bg-surface/40 p-6">
                <div className="h-full w-full rounded-xl bg-bg-surface/40 p-6 text-text-muted shadow-inner">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.25em] text-text-muted">
                        Revenue forecast
                      </p>
                      <div className="space-y-2">
                        <div className="h-3 rounded-full bg-border/40" />
                        <div className="h-3 w-5/6 rounded-full bg-border/40" />
                        <div className="h-3 w-4/6 rounded-full bg-border/40" />
                        <div className="h-3 w-3/5 rounded-full bg-border/40" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-bg-surface/60 p-4 text-center text-text-base">
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">
                          This month
                        </p>
                        <p className="mt-3 text-xl font-semibold text-white">
                          ₹178k
                        </p>
                      </div>
                      <div className="rounded-2xl bg-bg-surface/60 p-4 text-center text-text-base">
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">
                          Last month
                        </p>
                        <p className="mt-3 text-xl font-semibold text-white">
                          ₹158k
                        </p>
                      </div>
                      <div className="rounded-2xl bg-bg-surface/60 p-4 text-center text-text-base">
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">
                          Forecast
                        </p>
                        <p className="mt-3 text-xl font-semibold text-white">
                          ₹198k
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
                Top products
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Featured catalog
              </h2>
            </div>
            <button className="rounded-full bg-bg-surface/60 hover:bg-bg-surface/80 px-4 py-3 text-sm font-semibold text-text-base transition-colors">
              Manage catalog
            </button>
          </div>
          <div className="grid gap-4">
            {products.sort((a, b) => b.rating - a.rating).slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-border/60 bg-bg-surface/60 p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {product.price} · {product.stock} available
                    </p>
                  </div>
                  <div className="rounded-full bg-bg-surface/80 px-3 py-2 text-sm text-text-base">
                    {product.rating} ★
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
