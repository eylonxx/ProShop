import React, { useEffect } from 'react';
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { createOrder } from '../slices/orderSlice';
import { CartItemType } from '../types';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const cart = useSelector((state: any) => state.cart);

  //calcs
  const addDecimals = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice: string = addDecimals(
    cart.cartItems.reduce((acc: number, item: CartItemType) => acc + item.price * item.qty, 0)
  );

  const shippingPrice: string = addDecimals(Number(itemsPrice) > 100 ? 0 : 10);

  const taxPrice: string = addDecimals(Number((0.17 * Number(itemsPrice)).toFixed(2)));

  const total: string = addDecimals(Number((Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)));

  const createdOrder = useSelector((state: any) => state.order.order);
  const isLoading = useSelector((state: any) => state.order.isLoading);
  const success = useSelector((state: any) => state.order.success);
  const error = useSelector((state: any) => state.order.error);

  console.log(createdOrder);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        total: total,
      })
    );
  };

  useEffect(() => {
    if (success) {
      navigate(`/order/${createdOrder._id}`);
    }
  }, [success, navigate]);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroupItem>

            <ListGroupItem>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message children={<p>Your cart is empty</p>} />
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item: CartItemType, index: number) => (
                    <ListGroupItem key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush" className="my-2">
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>
              <ListGroupItem className="my-1">
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="my-1">
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="my-1">
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem className="my-1">
                <Row>
                  <Col>Total</Col>
                  <Col>${total}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>{error && <Message errorMsg={error} />}</ListGroupItem>
              <ListGroupItem>
                <div className="d-grid">
                  <Button
                    type="button"
                    className="btn-block mt-2"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </div>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
