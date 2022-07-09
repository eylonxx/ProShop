import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductType } from '../types';

export const getProducts = createAsyncThunk('products/getProducts', async () => {
  const { data } = await axios.get('/api/products');
  return data;
});

export const getProductDetails = createAsyncThunk('products/getProductDetails', async (id: string) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
});

interface ProductState {
  productList: ProductType[];
  product: ProductType;
  isLoading: boolean;
  error: any;
}

const initialState: ProductState = {
  productList: [],
  product: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.productList = [];
      state.error = action.error;
    });
    builder.addCase(getProducts.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.productList = action.payload;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.product = null;
      state.error = action.error;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductDetails.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export default productSlice.reducer;
