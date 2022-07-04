import express from 'express';
import products from './data/products';
import dotenv from 'dotenv';
import connectDB from './config/db';
import colors from 'colors';

dotenv.config();
connectDB();
const app = express();

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(colors.yellow.bold(`Serving on port ${PORT} in ${process.env.NODE_ENV} mode`));
});
