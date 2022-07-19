import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { userLogin, userRegister } from '../slices/userSlice';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

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
    //dispatch register
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(userRegister({ name, email, password }));
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant="danger" errorMsg={error} />}
      {isLoading && <Loader />}
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
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
