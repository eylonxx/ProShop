import { CartState } from './cartSlice';
import { ProductState } from './productSlice';
import { userState } from './userSlice';

export interface GlobalSlice {
  cart: CartState;
  product: ProductState;
  user: userState;
}
export interface shippingAddressType {
  address: string;
  city: string;
  country: string;
  postalCode: number;
}
