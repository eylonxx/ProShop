import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, FormControl } from 'react-bootstrap';
import Rating from '../components/Rating';
import { getProductDetails } from '../slices/productSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
  const params = useParams();
  const dispatch = useDispatch<any>();
  const product = useSelector((state: any) => state.products.product);
  const isLoading = useSelector((state: any) => state.products.isLoading);
  const error = useSelector((state: any) => state.products.error);

  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id]);

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`);
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {isLoading || product === null ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error} />
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <FormControl as="select" value={qty} onChange={(e) => setQty(+e.target.value)}>
                          {Array.from([...Array(product.countInStock)].keys()).map((p) => (
                            <option key={p + 1} value={p + 1}>
                              {p + 1}
                            </option>
                          ))}
                        </FormControl>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
