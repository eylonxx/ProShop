import { Schema, model, Types } from 'mongoose';
import Product from './productModel';

interface Order {
  user: Types.ObjectId;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: String;
  paymentResult: PaymentResult;
  taxPrice: string;
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  isPaid: boolean;
  paidAt: Number;
  isDelivered: boolean;
  deliveredAt: Date;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Types.ObjectId;
}

interface PaymentResult {
  id: String;
  status: String;
  update_time: string;
  email_address: string;
}

const orderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: { type: String, required: true },
    shippingPrice: { type: String, required: true },
    itemsPrice: { type: String, required: true },
    totalPrice: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = model<Order>('Order', orderSchema);

export default Order;
