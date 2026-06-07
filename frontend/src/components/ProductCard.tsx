import AddToCartButton from "./../features/cart/components/AddToCartButton";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  badge?: "Best Seller" | "New" | "Limited Stock";
}

const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  rating,
  reviews,
  category,
  stock,
  badge,
}: ProductCardProps) => {
  return (
    <div
      key={id}
      className="glow-card flex flex-col rounded-2xl bg-bg-surface/40 border border-border/50 hover:border-accent/30 p-4 relative overflow-hidden text-left"
    >
      {/* Visual mockup container */}
      <div
        className={`relative h-44 w-full rounded-xl flex items-center justify-center border border-border/60 overflow-hidden`}
      >
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain"
        />
        {badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              badge === "Best Seller"
                ? "bg-accent text-white"
                : badge === "New"
                  ? "bg-primary text-white"
                  : "bg-accent text-white"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 flex flex-col justify-between pt-4">
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
            {category}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-text-muted text-xs">
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
            <span className="font-semibold text-white">{rating}</span>
            <span className="text-text-muted">({reviews} reviews)</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-auto text-xs font-extrabold">
          <span className={stock === 0 ? "text-red-500" : "text-red-300"}>
            {stock === 0 ? "Out of Stock" : (stock < 10 ? "Limited Stock" : "")}
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="text-sm font-extrabold text-white">
            ₹{price.toFixed(2)}
          </span>
          <AddToCartButton
            product={{
              id, 
              name,
              price,
              image: imageUrl || "https://via.placeholder.com/256?text=Product",
              stock: 50,
              category,
              rating,
              reviews,
            }}
            disabled={stock <= 0}
            className="px-3 py-1.5 text-xs"
            showSuccessFeedback={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
