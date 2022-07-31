import React, { useEffect } from 'react';
import { Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderDetails } from '../slices/orderSlice';
import { CartItemType } from '../types';

const OrderScreen = () => {
  const dispatch = useDispatch<any>();
  const params = useParams();
  const orderId = params.id;

  const orderDetails = useSelector((state: any) => state.order.order);
  const isLoading = useSelector((state: any) => state.order.isLoading);
  const error = useSelector((state: any) => state.order.error);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, []);

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
