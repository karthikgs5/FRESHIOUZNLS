// Base URL for your Netlify Functions
const baseURL = 'https://freshiouzneeladri.netlify.app/netlify/functions/manage-products';

// Add a new product to the server
async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (imageFile && price && name && description) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const image = e.target.result;
            const newProduct = {
                name,
                price,
                description,
                image
            };

            try {
                const response = await fetch(baseURL, {
                    method: 'POST',
                    body: JSON.stringify(newProduct),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('Product added successfully!');
                    document.getElementById('addProductForm').reset();
                    showSection('manageProducts');
                    renderProducts();
                } else {
                    alert('Failed to add product.');
                }
            } catch (err) {
                alert('Failed to add product.');
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Please fill out all fields and select an image.');
    }
}

// Update a product on the server
async function updateProduct(event, id) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];

    const updatedProduct = {
        id,
        name,
        price,
        description
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            updatedProduct.image = e.target.result;

            try {
                const response = await fetch(baseURL, {
                    method: 'PUT',
                    body: JSON.stringify(updatedProduct),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('Product updated successfully!');
                    document.getElementById('addProductForm').reset();
                    showSection('manageProducts');
                    renderProducts();
                } else {
                    alert('Failed to update product.');
                }
            } catch (err) {
                alert('Failed to update product.');
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        try {
            const response = await fetch(baseURL, {
                method: 'PUT',
                body: JSON.stringify(updatedProduct),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                alert('Product updated successfully!');
                document.getElementById('addProductForm').reset();
                showSection('manageProducts');
                renderProducts();
            } else {
                alert('Failed to update product.');
            }
        } catch (err) {
            alert('Failed to update product.');
        }
    }
}