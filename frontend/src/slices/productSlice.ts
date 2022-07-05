import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductType } from '../types';

export const getProducts = createAsyncThunk('products/getProducts', async () => {
  const { data } = await axios.get('/api/products');
  return data;
});

interface ProductState {
  productList: ProductType[];
  isLoading: boolean;
}
const initialState: ProductState = {
  productList: [],
  isLoading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.productList = [];
      console.log('in rejected products');
    });
    builder.addCase(getProducts.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.productList = action.payload;
    });
    builder.addCase(getProducts.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export default productSlice.reducer;
