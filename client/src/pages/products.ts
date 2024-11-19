// LocalStorage Key
const CART_KEY = 'webshop-cart';

// Elements
let productSelect: HTMLSelectElement;
let productInfo: HTMLDivElement;
let productName: HTMLHeadingElement;
let productArticleNumber: HTMLSpanElement;
let productPrice: HTMLSpanElement;
let productDescription: HTMLSpanElement;
let productForm: HTMLFormElement;
let quantityInput: HTMLInputElement;

// Initialize DOM references
const initializeElements = () => {
  productSelect = document.getElementById(
    'product-select'
  ) as HTMLSelectElement;
  productInfo = document.getElementById('product-info') as HTMLDivElement;
  productName = document.getElementById('product-name') as HTMLHeadingElement;
  productArticleNumber = document.getElementById(
    'product-article-number'
  ) as HTMLSpanElement;
  productPrice = document.getElementById('product-price') as HTMLSpanElement;
  productDescription = document.getElementById(
    'product-description'
  ) as HTMLSpanElement;
  productForm = document.getElementById('product-form') as HTMLFormElement;
  quantityInput = document.getElementById('quantity') as HTMLInputElement;
};

interface Product {
  id: number;
  name: string;
  articleNumber: string;
  price: number;
  description: string;
}

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/products');
    const products = await response.json();
    populateProductSelect(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

// Populate dropdown menu
const populateProductSelect = (products: Product[]) => {
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = JSON.stringify(product);
    option.textContent = product.name;
    productSelect.appendChild(option);
  });
};

// Display selected product info
const setupProductSelectListener = () => {
  productSelect.addEventListener('change', () => {
    const selectedValue = productSelect.value;
    if (!selectedValue) {
      productInfo.style.display = 'none';
      return;
    }

    // Parse and display product details
    const product = JSON.parse(selectedValue);
    productName.textContent = product.name;
    productArticleNumber.textContent = product.articleNumber;
    productPrice.textContent = parseFloat(product.price).toFixed(2);
    productDescription.textContent = product.description;
    productInfo.style.display = 'block';
  });
};

// Add product to cart
const setupProductFormListener = () => {
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedValue = productSelect.value;
    if (!selectedValue) return;

    const product = JSON.parse(selectedValue);
    const quantity = parseInt(quantityInput.value, 10);

    // Create cart item
    const cartItem = {
      ...product,
      quantity,
    };

    // Update cart in localStorage
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    cart.push(cartItem);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    alert(`Added ${quantity} of ${product.name} to cart.`);
  });
};

// Initialize functionality
export const render = (): string => {
  // Render the HTML structure
  const html = `
    <h1>Products</h1>
    <form id="product-form">
      <label for="product-select">Select Product:</label>
      <select id="product-select">
        <option value="">-- Select a product --</option>
      </select>
      
      <div id="product-info" style="display: none; margin-top: 1rem; border: 1px solid #ccc; padding: 1rem; border-radius: 5px;">
        <h2 id="product-name"></h2>
        <p><strong>Article Number:</strong> <span id="product-article-number"></span></p>
        <p><strong>Price:</strong> $<span id="product-price"></span></p>
        <p><strong>Description:</strong> <span id="product-description"></span></p>
        <label for="quantity">Quantity:</label>
        <input id="quantity" type="number" min="1" value="1" required />
      </div>
      
      <button type="submit" style="padding:.5rem;">Add to Cart</button>
    </form>
  `;

  return html;
};

// After the HTML is injected into the DOM
export const afterRender = () => {
  initializeElements();
  fetchProducts();
  setupProductSelectListener();
  setupProductFormListener();
};
