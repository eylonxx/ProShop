import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import colors from 'colors';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req: Request, res: Response) => res.send(process.env.PAYPAL_CLIENT_ID));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(colors.yellow.bold(`Serving on port ${PORT} in ${process.env.NODE_ENV} mode`));
});
