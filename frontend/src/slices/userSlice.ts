import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface userLoginParams {
  email: string;
  password: string;
}

export const userLogin = createAsyncThunk(
  'cart/userLogin',
  async (userLoginParams: userLoginParams, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(`/api/users/login`, userLoginParams, config);
      return data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

interface userInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface userState {
  userInfo: userInfo;
  isLoading: boolean;
  error: any;
}

const initialState: userState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(userLogin.fulfilled, (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    });

    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true;
    });
  },
});

export default userSlice.reducer;
