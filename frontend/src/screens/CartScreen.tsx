import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';

const CartScreen = () => {
  const params = useParams();
  const dispatch = useDispatch<any>();
  const [searchParams] = useSearchParams();

  const cartItems = useSelector((state: any) => state.cart.cartItems);
  console.log(cartItems);

  const id = params.id;
  const qty = +searchParams.get('qty');

  useEffect(() => {
    if (id) {
      dispatch(addToCart({ id, qty }));
    }
  }, [dispatch, id, qty]);

  return <div>CartScreen</div>;
};

export default CartScreen;
