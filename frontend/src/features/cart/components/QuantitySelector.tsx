/**
 * Quantity Selector Component
 * Reusable component for selecting product quantity
 */

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
  compact?: boolean;
}

export const QuantitySelector = ({
  quantity,
  stock,
  onQuantityChange,
  compact = false,
}: QuantitySelectorProps) => {
  const canDecrease = quantity > 1;
  const canIncrease = quantity < stock;

  const handleDecrease = () => {
    if (canDecrease) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const newQuantity = Math.max(1, Math.min(value, stock));
      onQuantityChange(newQuantity);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-bg-surface rounded-lg p-1 border border-border/30">
        <button
          onClick={handleDecrease}
          disabled={!canDecrease}
          className="p-1 hover:bg-border/50 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
          title="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5 text-text-muted" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min="1"
          max={stock}
          className="w-8 text-center text-sm font-semibold text-white bg-transparent outline-none"
        />
        <button
          onClick={handleIncrease}
          disabled={!canIncrease}
          className="p-1 hover:bg-border/50 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
          title="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5 text-text-muted" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-bg-surface/40 rounded-xl p-4 border border-border/30">
      <button
        onClick={handleDecrease}
        disabled={!canDecrease}
        className={`
          flex items-center justify-center h-10 w-10 rounded-lg
          border border-border/50
          transition-all duration-200
          ${canDecrease
            ? 'hover:bg-primary hover:border-primary text-text-muted hover:text-white cursor-pointer'
            : 'opacity-40 cursor-not-allowed text-text-muted'
          }
        `}
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="flexflex-col items-center">
        <input
          type="text"
          disabled
          value={quantity}
          onChange={handleInputChange}
          min="1"
          max={stock}
          className="
            w-12 text-center text-lg font-bold text-white 
            bg-bg-dark rounded-lg border border-border/50
            outline-none focus:ring-2 focus:ring-accent/50
          "
        />
        <span className="text-[10px] text-text-muted mt-1">of {stock}</span>
      </div>

      <button
        onClick={handleIncrease}
        disabled={!canIncrease}
        className={`
          flex items-center justify-center h-10 w-10 rounded-lg
          border border-border/50
          transition-all duration-200
          ${canIncrease
            ? 'hover:bg-accent hover:border-accent text-text-muted hover:text-white cursor-pointer'
            : 'opacity-40 cursor-not-allowed text-text-muted'
          }
        `}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
