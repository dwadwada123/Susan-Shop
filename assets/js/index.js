document.addEventListener("DOMContentLoaded", async () => {
    const products = await get('/products');
    const categories = await get('/categories');
    const container = document.getElementById('product-list');
    
    const featuredProducts = products.slice(0, 4);
    let htmlContent = '';
    
    featuredProducts.forEach(product => {
        const catName = categories.find(c => c.id === product.categoryId)?.name || 'Khác';
        const productString = JSON.stringify(product).replace(/"/g, '&quot;');

        htmlContent += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="tag new">Mới</span>
                    <div class="product-overlay">
                        <button class="action-btn" onclick="addToCart(${productString})">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <a href="detail.html?id=${product.id}" class="action-btn" style="display:flex;align-items:center;justify-content:center">
                            <i class="fa-regular fa-eye"></i>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <span class="category">${catName}</span>
                    <h3><a href="detail.html?id=${product.id}">${product.name}</a></h3>
                    <div class="price-row">
                        <span class="price">${formatCurrency(product.price)}</span>
                        <div class="rating"><i class="fa-solid fa-star"></i> ${product.rating}</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
});