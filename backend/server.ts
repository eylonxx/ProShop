import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import colors from 'colors';
import productRoutes from './routes/productRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();
connectDB();
const app = express();
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(colors.yellow.bold(`Serving on port ${PORT} in ${process.env.NODE_ENV} mode`));
});
