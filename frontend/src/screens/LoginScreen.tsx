import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { userLogin } from '../slices/userSlice';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const isLoading = useSelector((state: any) => state.user.isLoading);
  const error = useSelector((state: any) => state.user.error);

  const redirect = window.location.search ? window.location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger" errorMsg={error} />}
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        <FormGroup controlId="email">
          <FormLabel>Email Address</FormLabel>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </FormGroup>
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
