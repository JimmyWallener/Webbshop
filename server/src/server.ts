import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import orderRoutes from './routes/order.routes';
import orderDetails from './routes/orderDetail.routes';
import productRoutes from './routes/product.routes';

const app: Express = express();
const port = process.env.PORT || 3000;
const url = process.env.URL!;

// Body parser middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware for handling requests from other origins
app.use(
  cors({
    origin: url + port,
    credentials: true,
  })
);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order-details', orderDetails);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
