import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types';
import { GlobalSlice } from './types';

interface userLoginParams {
  email: string;
  password: string;
}
interface userRegisterParams {
  name: string;
  email: string;
  password: string;
}
interface userDetailsParams {
  id: string;
}

export const userLogin = createAsyncThunk('user/userLogin', async (userLoginParams: userLoginParams, thunkAPI) => {
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
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUserDetails = createAsyncThunk<any, userDetailsParams, { state: GlobalSlice }>(
  'user/userDetails',
  async (userDetailsParams, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/users/${userDetailsParams.id}`, config);

      return data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export const userUpdateProfile = createAsyncThunk<any, User, { state: GlobalSlice }>(
  'user/userUpdateProfile',
  async (userObject, { getState, rejectWithValue }) => {
    const { token } = getState().user.userInfo;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.put(`/api/users/profile`, userObject, config);
      return data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export const userRegister = createAsyncThunk(
  'user/userRegister',
  async (userRegisterParams: userRegisterParams, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(`/api/users`, userRegisterParams, config);
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

interface userDetails {
  _id: string;
  name: string;
  email: string;
  isAdmin: string;
  token: string;
  // can expand later, different than userInfo
}

export interface userState {
  userInfo: userInfo;
  userDetails: userDetails;
  userUpdateSuccess: boolean;
  isLoading: boolean;
  error: any;
}

const initialState: userState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  userDetails: null,
  userUpdateSuccess: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.isLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(userLogin.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    });

    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(userRegister.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(userRegister.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    });

    builder.addCase(userRegister.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.userDetails = action.payload;
    });

    builder.addCase(getUserDetails.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(userUpdateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.userUpdateSuccess = false;
      state.error = action.payload;
    });

    builder.addCase(userUpdateProfile.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.userInfo = action.payload;
      state.userDetails.email = action.payload.email;
      state.userDetails.name = action.payload.name;
      state.userUpdateSuccess = true;
    });

    builder.addCase(userUpdateProfile.pending, (state, action) => {
      state.isLoading = true;
    });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
