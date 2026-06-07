import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../app/store';

const BASE_URL = 'http://localhost:8000';

export interface ReviewSubmission {
  productId: number;
  rating: number;
  comment: string;
}

export interface ReviewState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  loading: false,
  success: false,
  error: null,
};

export const submitReview = createAsyncThunk(
  'review/submitReview',
  async (review: ReviewSubmission, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { userInfo: { token: string } | null } };
      const token = state.user.userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      };

      const response = await axios.post(
        `${BASE_URL}/reviews/product/${review.productId}/`,
        { rating: review.rating, comment: review.comment },
        config,
      );

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || 'Failed to submit review');
    }
  },
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;

export const selectReviewState = (state: RootState) => state.review;

export default reviewSlice.reducer;
