import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
  },
  devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
});

export default store;
