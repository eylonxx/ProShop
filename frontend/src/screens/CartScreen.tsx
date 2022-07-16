import React from 'react';
import { useEffect } from 'react';
import { Row, Col, ListGroup, ListGroupItem, Image, FormControl, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { CartItemType } from '../types';

const CartScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
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

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
    console.log('remove');
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
    console.log('checkout');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message text={'Your cart is empty!'}>
            <Link to="/">Go back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item: CartItemType) => (
              <ListGroupItem key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <FormControl
                      as="select"
                      value={item.qty}
                      onChange={(e: any) => {
                        dispatch(addToCart({ id: item.product, qty: Number(e.target.value) }));
                      }}
                    >
                      {Array.from([...Array(item.countInStock)].keys()).map((p) => (
                        <option key={p + 1} value={p + 1}>
                          {p + 1}
                        </option>
                      ))}
                    </FormControl>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        removeFromCartHandler(item.product);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Subtotal ({cartItems.reduce((acc: number, item: CartItemType) => acc + item.qty, 0)}) items</h2>$
              {cartItems.reduce((acc: number, item: CartItemType) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroupItem>
            <ListGroupItem>
              <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                Proceed to Checkout
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
