let allProducts = [];
let allCategories = [];
let currentCategoryId = 'all';
let currentMaxPrice = 100000000;
let currentPage = 1;
const itemsPerPage = 9;

document.addEventListener("DOMContentLoaded", async () => {
    allProducts = await get('/products');
    allCategories = await get('/categories');

    renderCategories(allCategories);
    filterAndRender();

    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    priceRange.addEventListener('input', (e) => {
        currentMaxPrice = Number(e.target.value);
        priceValue.innerText = formatCurrency(currentMaxPrice);
        currentPage = 1; 
        filterAndRender();
    });
});

function renderCategories(categories) {
    const container = document.getElementById('category-list');
    container.innerHTML = `<li><a href="#" class="active" onclick="handleCategoryFilter(event, 'all')">Tất cả</a></li>`;
    
    categories.forEach(cate => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="handleCategoryFilter(event, ${cate.id})">${cate.name}</a>`;
        container.appendChild(li);
    });
}

function handleCategoryFilter(event, categoryId) {
    event.preventDefault();
    currentCategoryId = categoryId;
    currentPage = 1;

    const links = document.querySelectorAll('#category-list a');
    links.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    filterAndRender();
}

function filterAndRender() {
    let filtered = allProducts;

    if (currentCategoryId !== 'all') {
        filtered = filtered.filter(p => p.categoryId === currentCategoryId);
    }

    filtered = filtered.filter(p => p.price <= currentMaxPrice);

    renderPagination(filtered.length);
    renderProducts(filtered);
}

function renderProducts(products) {
    const container = document.getElementById('shop-products');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>Không tìm thấy sản phẩm nào phù hợp.</p>';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    let html = '';
    paginatedItems.forEach(product => {
        const catName = allCategories.find(c => c.id === product.categoryId)?.name || 'Khác';
        const productString = JSON.stringify(product).replace(/"/g, '&quot;');

        html += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
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

    container.innerHTML = html;
}

function renderPagination(totalItems) {
    const container = document.querySelector('.pagination');
    container.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const a = document.createElement('a');
        a.href = "#";
        a.className = `page-link ${i === currentPage ? 'active' : ''}`;
        a.innerText = i;
        a.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            filterAndRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        container.appendChild(a);
    }
}