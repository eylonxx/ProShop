import { configureStore } from '@reduxjs/toolkit';
import productSlice from './slices/productSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
  },
  devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
});

export default store;
