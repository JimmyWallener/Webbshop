// LocalStorage Key
const CART_KEY = 'webshop-cart';

interface CartItem {
  id: number;
  name: string;
  price: string;
  description: string;
  quantity: number;
}

let cart: CartItem[] = [];
let cartTable: HTMLTableElement;
let totalAmountDiv: HTMLDivElement;
let purchaseButton: HTMLButtonElement;

// Fetch cart items from localStorage
const fetchCartItems = (): any[] => {
  const storedCart = localStorage.getItem(CART_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
};

// Display cart items in a table
const displayCartItems = () => {
  cartTable.innerHTML = `
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${cart
        .map((item) => {
          const itemTotal =
            parseFloat(parseFloat(item.price).toFixed(2)) * item.quantity;
          return `
          <tr style="padding:1rem;">
            <td style="padding:.5rem;">${item.name}</td>
            <td style="padding:.5rem;">${item.quantity}</td>
            <td style="padding:.5rem;">${parseFloat(item.price).toFixed(2)}</td>
            <td style="padding:.5rem;">${itemTotal.toFixed(2)}</td>
            <td style="padding:.5rem;"><button data-id="${
              item.id
            }" class="remove-btn" style="padding:.5rem;">Remove</button></td>
          </tr>
        `;
        })
        .join('')}
    </tbody>
  `;

  // Update total amount
  updateTotalAmount();

  // Add event listeners for remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const productId = (e.target as HTMLButtonElement).dataset.id;
      if (productId) {
        removeFromCart(productId);
      } else {
        console.error('Product ID is undefined');
      }
    });
  });
};

// Update the total amount in the cart
const updateTotalAmount = () => {
  const total = cart.reduce(
    (sum, item) =>
      sum + parseFloat(parseFloat(item.price).toFixed(2)) * item.quantity,
    0
  );
  totalAmountDiv.textContent = `Total: $${total.toFixed(2)}`;
};

// Remove an item from the cart
const removeFromCart = (productId: string) => {
  cart = cart.filter((item) => item.id !== Number(productId));
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  displayCartItems();
};

// Function to format the date to 'YYYY-MM-DD HH:mm:ss'
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Create a new order
const createOrder = async () => {
  const orderData = { createdAt: formatDate(new Date()) };
  console.log(orderData);

  try {
    const response = await fetch('http://localhost:8080/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();
    return order.id;
  } catch (error) {
    console.error('Failed to create order:', error);
    alert('Failed to create order.');
    return null;
  }
};

// Create order details for each item in the cart
const createOrderDetails = async (orderId: number) => {
  for (const item of cart) {
    const orderDetailData = {
      orderId: orderId,
      productId: item.id,
      quantity: item.quantity,
    };

    try {
      await fetch('http://localhost:8080/api/order-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetailData),
      });
    } catch (error) {
      console.error('Failed to create order detail:', error);
      alert('Failed to create order detail.');
    }
  }
};

// Handle purchase button click
const handlePurchase = async () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  // Create the order
  const orderId = await createOrder();
  if (orderId) {
    // Create order details for each cart item
    await createOrderDetails(orderId);

    // Clear the cart from localStorage
    localStorage.removeItem(CART_KEY);

    // Display success message and reload the cart
    alert('Order placed successfully!');
    cart = []; // Clear cart array
    displayCartItems();
  }
};

// Initialize the cart page
export const render = (): string => {
  return `
    <h1>Your Cart</h1>
    <table id="cart-table"></table>
    <div style="display:flex;align-items:center;">
    <div id="total-amount" style="padding:1rem;"></div>
    <button id="purchase-btn" style="padding:.5rem;">Purchase</button>
    </div>
    
  `;
};

export const afterRender = () => {
  // Initialize DOM elements
  cartTable = document.getElementById('cart-table') as HTMLTableElement;
  totalAmountDiv = document.getElementById('total-amount') as HTMLDivElement;
  purchaseButton = document.getElementById('purchase-btn') as HTMLButtonElement;

  // Fetch and display cart items
  cart = fetchCartItems();
  displayCartItems();

  // Set up purchase button event listener
  purchaseButton.addEventListener('click', handlePurchase);
};
