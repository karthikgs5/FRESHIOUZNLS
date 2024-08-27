// Base URL for your Netlify Functions
const baseURL = 'https://freshiouzneeladri.netlify.app/.netlify/functions/manage-products';

// Function to load and display products from Netlify Function
function loadCatalogue() {
    const catalogueContainer = document.querySelector('.catalogue');
    catalogueContainer.innerHTML = ''; // Clear existing items

    // Fetch products from the Netlify Function
    fetch(baseURL)
        .then(response => response.json())
        .then(products => {
            if (Array.isArray(products)) {
                products.forEach(product => {
                    const productHTML = `
                        <div class="product-item">
                            <img src="<span class="math-inline">\{product\.image\}" alt\="</span>{product.name}">
                            <div class="product-details">
                                <h3><span class="math-inline">\{product\.name\}</h3\>
<p\>Price\: ₹</span>{product.price.toFixed(2)}</p>
                                <p><span class="math-inline">\{product\.description\}</p\>
<button onclick\="addToCart\('</span>{product.id}')">Add to Cart</button>
                            </div>
                        </div>
                    `;
                    catalogueContainer.insertAdjacentHTML('beforeend', productHTML);
                });
            } else {
                console.error('Products is not an array or is undefined.');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Function to add a product to the cart
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    fetch(baseURL)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);

            if (product) {
                const existingProduct = cart.find(item => item.id === productId);

                if (existingProduct) {
                    alert('Item already added to cart!');
                } else {
                    cart.push({ id: productId, quantity: 1 });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    alert('Product added to cart!');
                    // Disable the add-to-cart button and show "Item added to cart"
                    const button = document.querySelector(button[onclick="addToCart('${productId}')"]);
                    if (button) {
                        button.innerText = 'Item Added to Cart';
                        button.disabled = true;
                    }
                }
            } else {
                console.log('Product not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Function to load cart items
function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = ''; // Clear existing items

    fetch(baseURL)
        .then(response => response.json())
        .then(products => {
            let total = 0;

            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    const itemTotal = product.price * cartItem.quantity;
                    total += itemTotal;

                    const cartItemHTML = `
                        <div class="cart-item">
                            <img src="<span class="math-inline">\{product\.image\}" alt\="</span>{product.name}">
                            <div class="cart-item-info">
                               <h3 class="cart-item-title">${product.name}</h3>
                                <p class="cart-item-price">₹${product.price.toFixed(2)}</p>
                                <input type="number" class="cart-item-quantity" value="${cartItem.quantity}" min="0.1" step="0.1" onchange="updateQuantity('${product.id}', this.value)">
                                <button class="remove-button" onclick="removeFromCart('${product.id}')">Remove</button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
                }
            });

            cartTotalContainer.innerText = 'Total: ₹${total.toFixed(2)}';
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Function to update product quantity in the cart
function updateQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(item => {
        if (item.id === productId) {
            return { ...item, quantity: parseFloat(newQuantity) };
        }
        return item;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart(); // Reload the cart to reflect changes
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Reload the cart to reflect changes
}

// Function to handle checkout
function submitOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    let orderDetails = `Name: ${customerName}\nPhone: ${customerPhone}\n`;
    if (customerAddress) {
        orderDetails += `Address: ${customerAddress}\n`;
    }
    orderDetails += 'Order Details:\n';

    fetch(baseURL)
        .then(response => response.json())
        .then(products => {
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    orderDetails += `${product.name} - ${cartItem.quantity} x ₹${product.price.toFixed(2)}\n`;
                }
            });

            // Send order details to your WhatsApp number
            const whatsappUrl = `https://api.whatsapp.com/send?phone=YOUR_WHATSAPP_NUMBER&text=${encodeURIComponent(orderDetails)}`;
            window.open(whatsappUrl, '_blank');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Function to open the checkout modal
function openModal() {
    document.getElementById('checkoutModal').style.display = 'block';
}

// Function to close the checkout modal
function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Load catalogue or cart on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    } else {
        loadCatalogue();
    }
});