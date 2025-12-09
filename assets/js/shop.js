let currentCategoryId = 'all';
let currentMaxPrice = 100000000;
let currentPage = 1;
const itemsPerPage = 9;
let currentSortValue = 'newest';

document.addEventListener("DOMContentLoaded", async () => {
    const categories = await get('/categories');
    renderCategories(categories);
    fetchAndRenderProducts();
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    priceRange.addEventListener('change', (e) => {
        currentMaxPrice = Number(e.target.value);
        priceValue.innerText = formatCurrency(currentMaxPrice);
        currentPage = 1; 
        fetchAndRenderProducts();
    });
    
    priceRange.addEventListener('input', (e) => {
        priceValue.innerText = formatCurrency(Number(e.target.value));
    });

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSortValue = e.target.value;
        currentPage = 1; 
        fetchAndRenderProducts();
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

    fetchAndRenderProducts();
}

async function fetchAndRenderProducts() {
    const container = document.getElementById('shop-products');
    container.innerHTML = '<p>Đang tải dữ liệu...</p>';
    let url = `/products?price_lte=${currentMaxPrice}`;

    if (currentCategoryId !== 'all') {
        url += `&categoryId=${currentCategoryId}`;
    }

    try {
        const response = await fetch(`${API_URL}${url}`);
        let products = await response.json();
        if (currentSortValue === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (currentSortValue === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        } else {
            products.sort((a, b) => b.id - a.id);
        }

        const totalItems = products.length;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);
   
        renderProducts(paginatedProducts);
        renderPagination(totalItems);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Lỗi tải dữ liệu.</p>';
    }
}

function renderProducts(products) {
    const container = document.getElementById('shop-products');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>Không tìm thấy sản phẩm nào phù hợp.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
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
                    <span class="category">SP-${product.id}</span>
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
    
    if (totalItems === 0) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    console.log(`Tổng SP: ${totalItems} | Tổng trang: ${totalPages}`); // Debug

    if (totalPages <= 1) return; 

    const prevClass = currentPage === 1 ? 'disabled' : '';
    const prevBtn = document.createElement('a');
    prevBtn.href = "#";
    prevBtn.className = `page-link ${prevClass}`;
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    if (currentPage > 1) {
        prevBtn.onclick = (e) => changePage(e, currentPage - 1);
    }
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const a = document.createElement('a');
        a.href = "#";
        a.className = `page-link ${i === currentPage ? 'active' : ''}`;
        a.innerText = i;
        a.onclick = (e) => changePage(e, i);
        container.appendChild(a);
    }

    const nextClass = currentPage === totalPages ? 'disabled' : '';
    const nextBtn = document.createElement('a');
    nextBtn.href = "#";
    nextBtn.className = `page-link ${nextClass}`;
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    if (currentPage < totalPages) {
        nextBtn.onclick = (e) => changePage(e, currentPage + 1);
    }
    container.appendChild(nextBtn);
}

function changePage(e, page) {
    e.preventDefault();
    currentPage = page;
    fetchAndRenderProducts();
    document.querySelector('.shop-container').scrollIntoView({ behavior: 'smooth' });
}