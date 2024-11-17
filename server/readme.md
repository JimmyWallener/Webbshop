# Webbshop Server

This is the backend server for the Webbshop project. It handles all the business logic and data management for the e-commerce platform.

## Features

- Product management (CRUD operations)
- Order processing
- RESTful API endpoints

## Technologies Used

- Node.js
- Express.js
- MariaDB
- Typescript

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jimmywallener/webbshop.git
   ```

2. Navigate to the project directory:

   ```bash
   cd webbshop/server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   DB_PORT=3000
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   URL=http://localhost
   PORT=3000
   ```

## Running the Server

Start the server in development mode:

```bash
npm run dev
```

Start the server in production mode:

```bash
npm start
```

## API Endpoints

- `POST /api/order-details` - Create a new order detail
- `GET /api/order-details` - Get all order details
- `GET /api/order-details/:id` - Get an order detail by ID
- `PUT /api/order-details/:id` - Update an order detail
- `DELETE /api/order-details/:id` - Delete an order detail
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get an order by ID
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

## Contributing

Not accepting contributions at the moment. This is a personal project for learning purposes.

## License

This project is licensed under the MIT License.