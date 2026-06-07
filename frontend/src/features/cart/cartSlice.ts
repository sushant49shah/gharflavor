/**
 * Redux Toolkit Cart Slice
 * Manages cart state with reducers for add, remove, update quantity
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem, AddToCartPayload } from './cartTypes';
import { loadCartFromStorage, saveCartToStorage } from '../../utils/localStorage';

const initialState: CartState = loadCartFromStorage() || {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, subtotal };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increase quantity if already exists
     * Prevents quantity from exceeding stock
     */
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { id, name, price, image, stock, category, rating, reviews, quantity = 1 } = action.payload;

      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        // Item exists - increase quantity but don't exceed stock
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          stock
        );
        existingItem.quantity = newQuantity;
      } else {
        // New item - add to cart
        const newItem: CartItem = {
          id,
          name,
          price,
          image,
          quantity: Math.min(quantity, stock),
          stock,
          category,
          rating,
          reviews,
        };
        state.items.push(newItem);
      }

      // Recalculate totals
      const { totalQuantity, subtotal } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.subtotal = subtotal;

      // Persist to localStorage
      saveCartToStorage(state);
    },

    /**
     * Remove item completely from cart
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      // Recalculate totals
      const { totalQuantity, subtotal } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.subtotal = subtotal;

      // Persist to localStorage
      saveCartToStorage(state);
    },

    /**
     * Increase item quantity by 1
     * Respects stock limits
     */
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item && item.quantity < item.stock) {
        item.quantity += 1;

        // Recalculate totals
        const { totalQuantity, subtotal } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.subtotal = subtotal;

        // Persist to localStorage
        saveCartToStorage(state);
      }
    },

    /**
     * Decrease item quantity by 1
     * If quantity becomes 0, remove the item
     */
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove if quantity would be 0
          state.items = state.items.filter((item) => item.id !== id);
        }

        // Recalculate totals
        const { totalQuantity, subtotal } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.subtotal = subtotal;

        // Persist to localStorage
        saveCartToStorage(state);
      }
    },

    /**
     * Set exact quantity for an item
     * Respects stock limits
     */
    setQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        // Ensure quantity is between 1 and stock
        item.quantity = Math.max(1, Math.min(quantity, item.stock));

        // Recalculate totals
        const { totalQuantity, subtotal } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.subtotal = subtotal;

        // Persist to localStorage
        saveCartToStorage(state);
      }
    },

    /**
     * Clear entire cart
     */
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;

      // Persist to localStorage
      saveCartToStorage(state);
    },

    /**
     * Load cart from localStorage (useful on app init)
     */
    loadCart: (_state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
