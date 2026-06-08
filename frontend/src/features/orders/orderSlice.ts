import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../app/axios';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, {getState, rejectWithValue}) => {
        try {
            const state: any = getState();
            const token = state.user.userInfo?.token;

            const {data} = await axiosInstance.get('/api/orders/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
        }
    }
);


export const fetchOrderById = createAsyncThunk(
    'api/orders/fetchById',
    async (id: string, {getState, rejectWithValue}) => {
        try {
            const state: any = getState();
            const token = state.user.userInfo?.token;

            const {data} = await axiosInstance.get(`/api/orders/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
        }
    }
);

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}
interface Order {
  id: number;
  items: OrderItem[];
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;   
  shipping_address: any;
}

const orderSlice = createSlice({
    name: 'orders',
    initialState:{
        orders: [] as Order[],
        selectedOrder: null as Order | null,
        loading: false,
        error: null as string | null,
    },
    reducers: {
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
    }
})

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
