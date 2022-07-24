import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType } from '../types';
import { GlobalSlice, shippingAddressType } from './types';

export interface orderParams {
  orderItems: CartItemType[];
  shippingAddress: shippingAddressType;
  paymentMethod: string;
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  total: string;
}

export const createOrder = createAsyncThunk<any, orderParams, { state: GlobalSlice }>(
  'order/createOrder',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`/api/orders/`, order, config);

      return data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export interface orderState {
  order: any;
  isLoading: boolean;
  success: boolean;
  error: any;
}

const initialState: orderState = {
  order: {},
  isLoading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.success = true;
      state.order = action.payload;
    });

    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export default orderSlice.reducer;
