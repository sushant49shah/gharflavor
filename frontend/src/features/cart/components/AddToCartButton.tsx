/**
 * Add To Cart Button Component
 * Reusable button for adding products to cart
 */

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useAppDispatch } from '../../../hooks';
import { addToCart } from '../cartSlice';
import type { AddToCartPayload } from '../cartTypes';

interface AddToCartButtonProps {
  product: AddToCartPayload;
  disabled?: boolean;
  className?: string;
  showSuccessFeedback?: boolean;
}

export const AddToCartButton = ({
  product,
  disabled,
  className = '',
  showSuccessFeedback = true,
}: AddToCartButtonProps) => {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));

    if (showSuccessFeedback) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdded}
      className={`
        inline-flex items-center justify-center gap-2 
        px-4 py-2.5 rounded-lg
        font-semibold text-sm
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isAdded
          ? 'bg-accent text-white hover:bg-accent'
          : 'bg-primary text-white hover:bg-accent'
        }
        ${
          disabled ? 'hover:bg-primary' : 'hover:bg-accent'
        }
        ${className}
      `}
      title={disabled ? 'Out of stock' : 'Add to cart'}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
