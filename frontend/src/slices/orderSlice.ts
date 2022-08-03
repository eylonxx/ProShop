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
  totalPrice: string;
}

export interface paymentResultParams {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface orderPayParams {
  orderId: string;
  paymentResult: paymentResultParams;
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

export const orderPay = createAsyncThunk<any, orderPayParams, { state: GlobalSlice }>(
  'order/orderPay',
  async (orderPayObject, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderPayObject.orderId}/pay`,
        orderPayObject.paymentResult,
        config
      );

      return data;
    } catch (error: any) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk<any, string, { state: GlobalSlice }>(
  'order/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.userInfo;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);

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
  order: null,
  isLoading: false,
  success: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderPayReset: (state) => {
      state.success = false;
    },
  },

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

    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.order = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getOrderDetails.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(orderPay.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });

    builder.addCase(orderPay.fulfilled, (state, action: PayloadAction<any>) => {
      state.success = true;
      state.isLoading = false;
    });

    builder.addCase(orderPay.pending, (state) => {
      state.isLoading = true;
    });
  },
});
export const { orderPayReset } = orderSlice.actions;
export default orderSlice.reducer;
