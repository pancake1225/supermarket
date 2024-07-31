document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.product-list');

    async function fetchProducts(categoryId) {
        const response = await fetch(`/categories/${categoryId}/products`);
        const products = await response.json();
        displayProducts(products);
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <form action="/cart/add" method="post">
                    <input type="hidden" name="productId" value="${product.id}">
                    <button type="submit">Add to cart</button>
                </form>
            `;
            productList.appendChild(productElement);
        });
    }

    // Fetch products for a default category
    fetchProducts(1);

    // Event listener for category buttons
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category-id');
            fetchProducts(categoryId);
        });
    });
});
