import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../app/axios';

// ─── Types ───────────────────────────────────────────────
interface FetchProductsParams {
  page?: number;
  category?: string;
  search?: string;
  sort?: string;
}

interface Product {
  id: number;
  name: string;
category: string | null;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  stock: number;
  badge: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// ─── Initial State ────────────────────────────────────────
const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

// ─── Async Thunks ─────────────────────────────────────────
export const fetchProducts = createAsyncThunk(
  'api/products/fetchAll',
  async (
    { page = 1, category = '', search = '', sort = '' }: FetchProductsParams,
    { rejectWithValue }
  ) => {
    try {
      const query = `page=${page}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}`;
      const { data } = await axios.get(`/api/products/?${query}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch products'
      );
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  'api/products/fetchSingle',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}/`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Product not found'
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.totalCount = action.payload.count;
        state.currentPage = action.payload.current_page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        // update product in list if it exists
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ─── Exports ──────────────────────────────────────────────
export const { setCurrentPage, clearError, resetProducts } =
  productsSlice.actions;

export default productsSlice.reducer;