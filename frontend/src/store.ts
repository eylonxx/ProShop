import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import productSlice from './slices/productSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    user: userSlice,
  },
  devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
});

export default store;
