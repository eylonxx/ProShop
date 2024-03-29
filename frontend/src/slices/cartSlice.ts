import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType } from '../types';
import { shippingAddressType } from './types';

interface addToCartParams {
  id: string;
  qty: number;
}

export const addToCart = createAsyncThunk('cart/addToCart', async (addToCartParams: addToCartParams) => {
  const { data } = await axios.get(`/api/products/${addToCartParams.id}`);

  const item: CartItemType = {
    product: data._id,
    name: data.name,
    image: data.image,
    price: data.price,
    countInStock: data.countInStock,
    qty: addToCartParams.qty,
  };
  return item;
});

export interface CartState {
  cartItems: CartItemType[];
  shippingAddress: shippingAddressType;
  paymentMethod: string;
  isLoading: boolean;
  error: any;
}

const initialState: CartState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : '',
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.cartItems = [...state.cartItems];
      state.error = action.error;
    });

    builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
      const item = action.payload;
      const existItem: CartItemType = state.cartItems.find((p: CartItemType) => {
        return p.product === item.product;
      });
      state.isLoading = false;

      if (existItem) {
        state.cartItems = state.cartItems.map((itemToCheck) =>
          itemToCheck.product === existItem.product ? item : itemToCheck
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    });

    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { removeFromCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
