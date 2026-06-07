/**
 * Cart Item Card Component
 * Displays individual cart item with quantity controls and remove button
 */

import { Trash2 } from 'lucide-react';
import type { CartItem } from '../cartTypes';
import { useAppDispatch } from '../../../hooks';
import { removeFromCart, setQuantity } from '../cartSlice';
import { QuantitySelector } from './QuantitySelector';
import { formatCurrency } from '../cartSelectors';

interface CartItemCardProps {
  item: CartItem;
  compact?: boolean;
}

export const CartItemCard = ({ item, compact = false }: CartItemCardProps) => {
  const dispatch = useAppDispatch();
  const itemTotal = item.price * item.quantity;

  const handleRemove = () => {
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      dispatch(removeFromCart(item.id));
    }
  };

  const handleQuantityChange = (quantity: number) => {
    dispatch(setQuantity({ id: item.id, quantity }));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-border/30 last:border-b-0">
        {/* Image */}
        <div className="relative h-16 w-16 shrink-0 rounded-lg bg-bg-surface overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/64?text=Image';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
          <p className="text-xs text-text-muted">{formatCurrency(item.price)}</p>
        </div>

        {/* Quantity */}
        <QuantitySelector
          quantity={item.quantity}
          stock={item.stock}
          onQuantityChange={handleQuantityChange}
          compact={true}
        />

        {/* Remove */}
        <button
          onClick={handleRemove}
          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          title="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-bg-surface/40 border border-border/30 hover:border-accent/20 transition-colors">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 rounded-lg bg-bg-dark overflow-hidden border border-border/50">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/96?text=Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">{item.name}</h3>
          {item.category && (
            <p className="text-xs text-text-muted">{item.category}</p>
          )}
          {item.rating && (
            <p className="text-xs text-text-muted mt-1">
              ⭐ {item.rating} ({item.reviews} reviews)
            </p>
          )}
        </div>
        <p className="text-sm font-semibold text-white">{formatCurrency(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center">
        <QuantitySelector
          quantity={item.quantity}
          stock={item.stock}
          onQuantityChange={handleQuantityChange}
          compact={false}
        />
      </div>

      {/* Item Total */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all mb-2"
          title="Remove from cart"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        <div className="text-right">
          <p className="text-xs text-text-muted mb-1">Subtotal</p>
          <p className="text-lg font-bold text-white">{formatCurrency(itemTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
