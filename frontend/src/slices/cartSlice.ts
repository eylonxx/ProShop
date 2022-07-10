import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItemType } from '../types';

interface addToCartParams {
  id: string;
  qty: number;
}

export const addToCart = createAsyncThunk('cart/addToCart', async (addToCartParams: addToCartParams) => {
  try {
    const { data } = await axios.get(`/api/products/${addToCartParams.id}`);
    console.log(data);

    const item: CartItemType = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty: addToCartParams.qty,
    };
    console.log(item);

    return item;
  } catch (error) {
    console.log(error);
  }
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

const productSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(addToCart.rejected, (state, action) => {
      console.log(action);

      state.isLoading = false;
      state.cartItems = [...state.cartItems];
      state.error = action.error;
    });

    builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<any>) => {
      //check if exists
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
      console.log('loading');

      state.isLoading = true;
    });
  },
});

export default productSlice.reducer;
