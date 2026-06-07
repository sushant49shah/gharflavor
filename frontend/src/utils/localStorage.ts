/**
 * localStorage Utilities
 * Handle persisting and loading cart data from browser storage
 */

import type { CartState } from '../features/cart/cartTypes';

const CART_STORAGE_KEY = 'gharflavour_cart';

/**
 * Save cart state to localStorage
 */
export const saveCartToStorage = (cart: CartState): void => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

/**
 * Load cart state from localStorage
 */
export const loadCartFromStorage = (): CartState | null => {
  try {
    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!serializedCart) {
      return null;
    }
    const cart = JSON.parse(serializedCart) as CartState;
    // Validate structure
    if (Array.isArray(cart.items) && typeof cart.totalQuantity === 'number') {
      return cart;
    }
    return null;
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return null;
  }
};

/**
 * Clear cart from localStorage
 */
export const clearCartStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};
