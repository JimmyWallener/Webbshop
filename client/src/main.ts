import './style.css';

// Dynamically load the navigation bar and content div
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="nav-wrapper">
<div><hi id="logo">Industrial Shop</hi></div>
  <nav>
    <button data-page="home">Home</button>
    <button data-page="products">Products</button>
    <button data-page="orders">Orders</button>
    <button data-page="cart"><i class="fa fa-shopping-cart"></i></button>
  </nav>
</div>
<div id="content"></div>
`;

// Event listener for navigation buttons to load pages dynamically
document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content') as HTMLDivElement;
  const navButtons = document.querySelectorAll<HTMLButtonElement>('nav button');

  if (!contentDiv) {
    console.error('#content element not found.');
    return;
  }

  // Dynamic content loader
  const loadPage = async (page: string) => {
    try {
      // Dynamically import the module for the specified page
      const module = await import(`./pages/${page}.ts`);

      // Check if the module has a render function
      if (module.render && typeof module.render === 'function') {
        contentDiv.innerHTML = module.render();
        // Call afterRender if it exists
        if (module.afterRender) {
          module.afterRender();
        }
      } else {
        throw new Error(
          `The module for ${page} does not export a render function.`
        );
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      contentDiv.innerHTML = `<h1>Error</h1><p>Failed to load content for ${page}.</p>`;
    }
  };

  // Load the home page by default
  loadPage('home');

  // Navigation event listeners
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      if (page) {
        loadPage(page);
      }
    });
  });
});
