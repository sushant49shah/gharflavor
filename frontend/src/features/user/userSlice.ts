import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export interface UserInfo {
  id: number;
  _id: number;
  username: string;
  email: string;
  name: string;
  isAdmin: boolean;
  token: string;
}

export interface UserProfileDetails {
  id: number;
  _id: number;
  username: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  profileDetails: UserProfileDetails | null;
  profileLoading: boolean;
  profileError: string | null;
  profileSuccess: boolean;
}

// Helper to get userInfo from localStorage
const getUserFromStorage = (): UserInfo | null => {
  try {
    const stored = localStorage.getItem('gharflavour_userInfo');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse user info from localStorage', error);
    return null;
  }
};

const initialState: UserState = {
  userInfo: getUserFromStorage(),
  loading: false,
  error: null,
  profileDetails: null,
  profileLoading: false,
  profileError: null,
  profileSuccess: false,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post<UserInfo>(
        `${BASE_URL}/api/users/login/`,
        { username: email, password }, // MyTokenObtainPairSerializer uses standard username/password
        config
      );
      
      localStorage.setItem('gharflavour_userInfo', JSON.stringify(data));
      return data;
    } catch (error: any) {
      const message =
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post<UserInfo>(
        `${BASE_URL}/api/users/register/`,
        { name, email, password },
        config
      );

      localStorage.setItem('gharflavour_userInfo', JSON.stringify(data));
      return data;
    } catch (error: any) {
      const message =
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'user/details',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.userInfo?.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data } = await axios.get<UserProfileDetails>(
        `${BASE_URL}/api/users/profile/`,
        config
      );
      return data;
    } catch (error: any) {
      const message =
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message || 'Failed to fetch profile details';
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    userData: { name?: string; email?: string; password?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { user: UserState };
      const token = state.user.userInfo?.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data } = await axios.put<UserInfo>(
        `${BASE_URL}/api/users/profile/update/`,
        userData,
        config
      );
      
      // Update localStorage with updated user token/name
      localStorage.setItem('gharflavour_userInfo', JSON.stringify(data));
      return data;
    } catch (error: any) {
      const message =
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message || 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('gharflavour_userInfo');
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      state.profileDetails = null;
      state.profileLoading = false;
      state.profileError = null;
      state.profileSuccess = false;
    },
    resetProfileSuccess: (state) => {
      state.profileSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<UserProfileDetails>) => {
        state.profileLoading = false;
        state.profileDetails = action.payload;
        state.profileError = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.profileSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.profileLoading = false;
        state.userInfo = action.payload; // Since update returns UserSerializerWithToken, it includes updated details
        state.profileDetails = {
          id: action.payload.id,
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          name: action.payload.name,
          isAdmin: action.payload.isAdmin,
        };
        state.profileSuccess = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
        state.profileSuccess = false;
      });
  },
});

export const { logoutUser, resetProfileSuccess } = userSlice.actions;

export default userSlice.reducer;
