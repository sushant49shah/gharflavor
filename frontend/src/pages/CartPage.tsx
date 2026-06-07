/**
 * Cart Page Component
 * Full page view of shopping cart with item list and checkout
 */

import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { selectCartItems, selectIsCartEmpty } from '../features/cart/cartSelectors';
import { CartItemCard } from '../features/cart/components/CartItemCard';
import { CartSummary } from '../features/cart/components/CartSummary';
import { clearCart } from '../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const isEmpty = useAppSelector(selectIsCartEmpty);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-bg-dark py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <ShoppingBag className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Empty Cart State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-bg-surface/20 py-16">
            <ShoppingBag className="mb-4 h-16 w-16 text-text-muted opacity-50" />
            <h2 className="mb-2 text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="mb-6 text-center text-text-muted max-w-md">
              Looks like you haven't added any items yet. Explore our amazing collection of
              products and add your favorites!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Items in Cart ({items.length})</h2>
                <button
                  onClick={handleClearCart}
                  className="text-xs font-semibold text-red-500 hover:text-red-400 border border-border hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item} compact={false} />
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-8 rounded-2xl bg-bg-surface/50 border border-border/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Continue Shopping?</h3>
                <p className="mb-4 text-text-muted">
                  Explore more products and find exactly what you need.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Browse All Products
                </Link>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
