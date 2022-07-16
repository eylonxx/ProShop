import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType } from '../types';

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

interface CartState {
  cartItems: CartItemType[];
  isLoading: boolean;
  error: any;
}

const initialState: CartState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      console.log(action.payload);

      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
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

export const { removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
