import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
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

  const isLoading = useSelector((state: any) => state.user.isLoading);
  const error = useSelector((state: any) => state.user.error);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!userDetails) {
        dispatch(getUserDetails({ id: 'profile' }));
      } else {
        console.log('setting');
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
        {error && <Message variant="danger" errorMsg={error} />}
        {updateSuccess && <Message variant="success" children={<span>Profile Updated</span>}></Message>}
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
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
