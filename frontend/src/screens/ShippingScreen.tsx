import React, { useState } from 'react';
import { Button, Form, FormGroup, FormLabel } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const shippingAddress = useSelector((state: any) => state.cart.shippingAddress);

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log('submit!');
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup className="py-3" controlId="address">
          <FormLabel>Address</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </FormGroup>

        <FormGroup className="py-3" controlId="city">
          <FormLabel>City</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </FormGroup>

        <FormGroup className="py-3" controlId="PostalCode">
          <FormLabel>Postal Code</FormLabel>
          <Form.Control
            type="number"
            placeholder="Enter ostal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </FormGroup>

        <FormGroup className="py-3" controlId="country">
          <FormLabel>Country</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </FormGroup>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
