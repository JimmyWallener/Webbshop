// Elements
let orderTable: HTMLTableElement;
let searchInput: HTMLInputElement;
let paginationContainer: HTMLDivElement;

// Pagination state
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredOrders: any[] = [];

interface Order {
  orderId: string;
  product: {
    name: string;
    articleNumber: string;
    price: string;
  };
  quantity: number;
  totalPrice: string;
}

// Fetch all order details from the API
const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/order-details');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
};

// Display the orders in the table
const displayOrders = (orders: Order[], page: number) => {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // Clear the table body
  const tbody = orderTable.querySelector('tbody')!;
  tbody.innerHTML = '';

  // Populate the table with paginated orders
  paginatedOrders.forEach((order) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align:center;">${order.orderId}</td>
      <td style="text-align:center;">${order.product.name}</td>
      <td style="text-align:center;">${order.product.articleNumber}</td>
      <td style="text-align:center;">${parseFloat(order.product.price).toFixed(
        2
      )}</td>
      <td style="text-align:center;">${order.quantity}</td>
      <td style="text-align:center;">${parseFloat(order.totalPrice).toFixed(
        2
      )}</td>
      
      
      
    `;
    tbody.appendChild(row);
  });

  // Update pagination
  updatePagination(orders.length, page);
};

// Update pagination controls
const updatePagination = (totalItems: number, currentPage: number) => {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i.toString();
    button.disabled = i === currentPage;
    button.addEventListener('click', () => {
      displayOrders(filteredOrders, i);
    });
    paginationContainer.appendChild(button);
  }
};

// Search orders based on input
const setupSearch = () => {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    // Filter orders by orderId
    filteredOrders = filteredOrders.filter((order) =>
      order.orderId.toString().includes(query)
    );

    // Reset to the first page and display results
    currentPage = 1;
    displayOrders(filteredOrders, currentPage);
  });
};

// Initialize the orders page
export const render = (): string => {
  // Return the HTML structure for orders
  return `
    <h1>Orders</h1>
    <div>
      <label for="search">Search Orders:</label>
      <input id="search" type="text" placeholder="Search by order id" />
    </div>
    <table id="order-table" border="1" style="margin-top: 1rem; width: 100%;">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Product Name</th>
          <th>Article Number</th>
          <th>Product Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div id="pagination" style="margin-top: 1rem;"></div>
  `;
};

export const afterRender = async () => {
  // Initialize DOM elements
  orderTable = document.getElementById('order-table') as HTMLTableElement;
  searchInput = document.getElementById('search') as HTMLInputElement;
  paginationContainer = document.getElementById('pagination') as HTMLDivElement;

  // Fetch and display orders
  const orders = await fetchOrders();
  filteredOrders = orders; // Initially, all orders are displayed
  displayOrders(filteredOrders, currentPage);

  // Set up search functionality
  setupSearch();
};
