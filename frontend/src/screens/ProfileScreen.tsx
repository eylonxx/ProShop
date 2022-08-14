import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listMyOrders, orderParams } from '../slices/orderSlice';
import { getUserDetails, userLogin, userRegister, userUpdateProfile } from '../slices/userSlice';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const userDetails = useSelector((state: any) => state.user.userDetails);
  const updateSuccess = useSelector((state: any) => state.user.userUpdateSuccess);
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const myOrders = useSelector((state: any) => state.order.orders);

  const isLoadingUser = useSelector((state: any) => state.user.isLoading);
  const isLoadingMyOrders = useSelector((state: any) => state.order.isLoading);
  const userError = useSelector((state: any) => state.user.error);
  const myOrdersError = useSelector((state: any) => state.order.error);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!userDetails) {
        dispatch(getUserDetails({ id: 'profile' }));
        dispatch(listMyOrders(name));
      } else {
        setName(userDetails.name);
        setEmail(userDetails.email);
      }
    }
  }, [dispatch, userInfo, userDetails, navigate]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(userUpdateProfile({ id: userDetails._id, name: name, email: email, password: password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {userError && <Message variant="danger" errorMsg={userError} />}
        {updateSuccess && <Message variant="success" children={<span>Profile Updated</span>}></Message>}
        {isLoadingUser && <Loader />}
        <Form onSubmit={submitHandler}>
          <FormGroup className="py-3" controlId="name">
            <FormLabel>Name</FormLabel>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup className="py-3" controlId="email">
            <FormLabel>Email Address</FormLabel>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup className="py-3" controlId="password">
            <FormLabel>Password</FormLabel>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <FormGroup className="py-3" controlId="confirmPassword">
            <FormLabel>Confirm Password</FormLabel>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>

          <Button className="my-3" type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoadingMyOrders ? (
          <Loader />
        ) : myOrdersError ? (
          <Message variant="danger" children={<span>{myOrdersError}</span>}></Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders &&
                myOrders.map((order: any) => {
                  console.log(order);
                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm" variant="light">
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
