/**
 * Cart Summary Component
 * Displays cart totals, delivery fee, and checkout button
 */

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { selectFormattedCartSummary } from '../cartSelectors';

interface CartSummaryProps {
  onCheckout?: () => void;
  compact?: boolean;
}

export const CartSummary = ({ onCheckout, compact = false }: CartSummaryProps) => {
  const summary = useAppSelector(selectFormattedCartSummary);
  const isEmpty = summary.itemCount === 0;

  if (compact) {
    return (
      <div className="rounded-lg bg-bg-surface/50 border border-border/50 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal ({summary.totalQuantity} items)</span>
          <span className="text-white font-semibold">{summary.formattedSubtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Delivery</span>
          <span className={`font-semibold ${summary.deliveryFee === 0 ? 'text-accent' : 'text-white'}`}>
            {summary.deliveryFee === 0 ? 'FREE' : summary.formattedDeliveryFee}
          </span>
        </div>
        <div className="border-t border-border/50 pt-3 flex justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="text-lg font-bold text-accent">{summary.formattedTotal}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-linear-to-br from-bg-surface/50 to-bg-dark/50 border border-border/50 p-6 space-y-6">
      {/* Summary Header */}
      <h3 className="text-lg font-bold text-white">Order Summary</h3>

      {/* Summary Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-text-muted">Items ({summary.totalQuantity})</span>
          <span className="font-semibold text-white">{summary.formattedSubtotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-muted">Delivery Fee</span>
          <span
            className={`font-semibold transition-colors ${
              summary.deliveryFee === 0 ? 'text-accent' : 'text-white'
            }`}
          >
            {summary.deliveryFee === 0 ? 'FREE 🎉' : summary.formattedDeliveryFee}
          </span>
        </div>

        {summary.deliveryFee > 0 && (
          <p className="text-xs text-text-muted text-center">
            Add ₹ {(50 - summary.subtotal).toFixed(2)} more for free delivery
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-white">Total</span>
        <span className="text-2xl font-bold text-accent">{summary.formattedTotal}</span>
      </div>

      {/* Checkout Button */}
      {isEmpty ? (
        <Link
          to="/products"
          className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all inline-flex items-center justify-center gap-2 group"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <button
          onClick={onCheckout}
          className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-accent text-white font-semibold shadow-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 inline-flex items-center justify-center gap-2 group"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Additional Info */}
      <div className="pt-4 border-t border-border/50 text-center text-xs text-text-muted space-y-1">
        <p>✓ Secure Checkout</p>
        <p>✓ Free Returns within 30 days</p>
      </div>
    </div>
  );
};

export default CartSummary;
