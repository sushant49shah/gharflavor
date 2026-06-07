/**
 * Cart Type Definitions
 * Defines all TypeScript interfaces for the cart system
 */

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  category?: string;
  rating?: number;
  reviews?: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export interface AddToCartPayload {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  rating?: number;
  reviews?: number;
  quantity?: number;
}
