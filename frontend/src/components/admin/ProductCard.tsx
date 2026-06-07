import Badge from './Badge'

interface ProductCardProps {
  name: string
  category: string
  price: string
  stock: number
  rating: string
  image: string
  status: string
}

// Purpose: Display a product preview card inside product management lists.
// Props:
//   name - product title.
//   category - product category.
//   price - display price.
//   stock - inventory count.
//   rating - average rating.
//   image - product image URL.
//   status - status label.
// Usage: Use in grid views for product summaries and inventory overviews.
const ProductCard = ({ name, category, price, stock, rating, image, status }: ProductCardProps) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-bg-surface/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-border/80">
      <div className="relative h-56 overflow-hidden rounded-t-2xl bg-bg-surface/60">
        <img src={image} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge label={status} variant={status === 'Active' ? 'success' : status === 'Low stock' ? 'warning' : 'secondary'} />
          <p className="rounded-full bg-bg-surface/60 px-3 py-1 text-xs uppercase tracking-[0.24em] text-text-muted">{rating} ★</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="mt-2 text-sm text-text-muted">{category}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-text-base">
          <span>{price}</span>
          <span>{stock} in stock</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
