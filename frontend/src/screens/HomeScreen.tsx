import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { ProductType } from '../types';
import { getProducts } from '../slices/productSlice';

const HomeScreen = () => {
  const dispatch = useDispatch<any>();
  const productList = useSelector((state: any) => state.products.productList);
  const isLoading = useSelector((state: any) => state.products.isLoading);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <>
      <h1>Latest products</h1>
      {isLoading ? (
        <h3>loading!!</h3>
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
