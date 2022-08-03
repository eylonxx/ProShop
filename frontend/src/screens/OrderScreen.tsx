import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import { getOrderDetails, orderPay, orderPayReset } from '../slices/orderSlice';
import { CartItemType } from '../types';

const OrderScreen = () => {
  const dispatch = useDispatch<any>();
  const params = useParams();
  const orderId = params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state: any) => state.order.order);
  const successPay = useSelector((state: any) => state.order.success);
  const isLoading = useSelector((state: any) => state.order.isLoading);
  const error = useSelector((state: any) => state.order.error);

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    // addPayPalScript();
    if (!orderDetails || successPay) {
      //dispatch reset here
      dispatch(orderPayReset());
      dispatch(getOrderDetails(orderId));
    } else if (!orderDetails.isPaid) {
      if (!(window as any).paypal) {
        console.log('adding script!');

        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [orderId, successPay, orderDetails]);

  const successPaymentHandler = (paymentResult: any) => {
    console.log(paymentResult);
    console.log(orderId);

    dispatch(orderPay({ orderId, paymentResult }));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error}></Message>
      ) : orderDetails ? (
        <>
          <h1>Order {orderDetails._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {orderDetails.user.name}
                  </p>
                  <p>
                    <a href={`mailto:${orderDetails.user.email}`}>{orderDetails.user.email}</a>
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}
                    {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
                  </p>
                  {orderDetails.isDelivered ? (
                    <Message variant="success" children={<span>Paid on {orderDetails.deliveredAt}</span>}></Message>
                  ) : (
                    <Message variant="danger" children={<span>Not paid</span>}></Message>
                  )}
                </ListGroupItem>

                <ListGroupItem>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {orderDetails.paymentMethod}
                  </p>
                  {orderDetails.isPaid ? (
                    <Message variant="success" children={<span>Paid on {orderDetails.paidAt}</span>}></Message>
                  ) : (
                    <Message variant="danger" children={<span>Not paid</span>}></Message>
                  )}
                </ListGroupItem>

                <ListGroupItem>
                  <h2>Order Items</h2>
                  {orderDetails.orderItems.length === 0 ? (
                    <Message children={<p>Order is empty</p>} />
                  ) : (
                    <ListGroup variant="flush">
                      {orderDetails.orderItems.map((item: CartItemType, index: number) => (
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
                      <Col>${orderDetails.itemsPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className="my-1">
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${orderDetails.shippingPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className="my-1">
                    <Row>
                      <Col>Tax</Col>
                      <Col>${orderDetails.taxPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem className="my-1">
                    <Row>
                      <Col>Total</Col>
                      <Col>${orderDetails.totalPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  {!orderDetails.isPaid && (
                    <ListGroupItem>
                      {isLoading && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton amount={orderDetails.totalPrice} onSuccess={successPaymentHandler} />
                      )}
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default OrderScreen;
