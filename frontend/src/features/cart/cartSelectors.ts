/**
 * Cart Selectors
 * Efficient selectors for accessing cart state
 */

import type { RootState } from '../../app/store';
import type { CartItem } from './cartTypes';

/**
 * Select all cart items
 */
export const selectCartItems = (state: RootState): CartItem[] => {
  return state.cart.items;
};

/**
 * Select total quantity of items in cart
 */
export const selectTotalQuantity = (state: RootState): number => {
  return state.cart.totalQuantity;
};

/**
 * Select cart subtotal
 */
export const selectSubtotal = (state: RootState): number => {
  return state.cart.subtotal;
};

/**
 * Select single item by ID
 */
export const selectCartItemById = (id: number) => (state: RootState): CartItem | undefined => {
  return state.cart.items.find((item) => item.id === id);
};

/**
 * Select if cart is empty
 */
export const selectIsCartEmpty = (state: RootState): boolean => {
  return state.cart.items.length === 0;
};

/**
 * Select cart summary data
 */
export const selectCartSummary = (state: RootState) => {
  const items = state.cart.items;
  const totalQuantity = state.cart.totalQuantity;
  const subtotal = state.cart.subtotal;
  const deliveryFee = subtotal > 50 ? 0 : 5; // Free shipping over $50
  const total = subtotal + deliveryFee;

  return {
    itemCount: items.length,
    totalQuantity,
    subtotal,
    deliveryFee,
    total,
  };
};

/**
 * Select formatted cart summary with currency
 */
export const selectFormattedCartSummary = (state: RootState) => {
  const summary = selectCartSummary(state);
  return {
    ...summary,
    formattedSubtotal: formatCurrency(summary.subtotal),
    formattedDeliveryFee: formatCurrency(summary.deliveryFee),
    formattedTotal: formatCurrency(summary.total),
  };
};

/**
 * Helper function to format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 2,
  }).format(amount);
};
