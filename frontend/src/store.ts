import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import productSlice from './slices/productSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    user: userSlice,
    order: orderSlice,
  },
  devTools: process.env.NODE_ENV !== 'production', //only show devTools when in production
});

export default store;
