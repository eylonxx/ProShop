import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { ProductType } from '../types';
import { getProducts } from '../slices/productSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  const dispatch = useDispatch<any>();
  const productList = useSelector((state: any) => state.products.productList);
  const isLoading = useSelector((state: any) => state.products.isLoading);
  const error = useSelector((state: any) => state.products.error);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error} />
      ) : (
        <Row>
          {productList.map((product: ProductType) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product key={product._id} product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
