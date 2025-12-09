let categories = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
    await loadProducts();
    
    const form = document.getElementById('product-form');
    if(form) form.addEventListener('submit', handleSaveProduct);
});

async function loadCategories() {
    categories = await get('/categories');
    const select = document.getElementById('prod-category');
    if (select) {
        select.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
}

async function loadProducts() {
    const products = await get('/products');
    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    products.sort((a, b) => b.id - a.id).forEach(p => {
        const catName = categories.find(c => c.id == p.categoryId)?.name || 'Khác';
        const dataStr = JSON.stringify(p).replace(/"/g, '&quot;');

        let stockHtml = `<span style="font-weight:bold; color: #10b981;">${p.stock}</span>`;
        if (p.stock === 0) {
            stockHtml = `<span style="font-weight:bold; color: #ef4444;">Hết hàng</span>`;
        } else if (p.stock < 10) {
            stockHtml = `<span style="font-weight:bold; color: #f59e0b;">${p.stock} (Sắp hết)</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${p.id}</td>
            <td><img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${p.name}</td>
            <td>${catName}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${stockHtml}</td> <td class="action-btns">
                <button class="btn-edit" onclick="openModal(${dataStr})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    
    if (product) {
        title.innerText = 'Cập nhật sản phẩm';
        document.getElementById('prod-id').value = product.id;
        document.getElementById('prod-name').value = product.name;
        document.getElementById('prod-price').value = product.price;
        document.getElementById('prod-stock').value = product.stock;
        document.getElementById('prod-image').value = product.image;
        document.getElementById('prod-detail').value = product.detail || '';
        document.getElementById('prod-category').value = product.categoryId;
    } else {
        title.innerText = 'Thêm sản phẩm mới';
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('prod-stock').value = 50;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

async function handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    
    const data = {
        name: document.getElementById('prod-name').value,
        price: Number(document.getElementById('prod-price').value),
        stock: Number(document.getElementById('prod-stock').value),
        image: document.getElementById('prod-image').value,
        categoryId: Number(document.getElementById('prod-category').value),
        detail: document.getElementById('prod-detail').value,
        rating: 5.0
    };

    try {
        if (id) {
            await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Cập nhật thành công!');
        } else {
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Thêm mới thành công!');
        }
        closeModal();
        loadProducts();
    } catch (error) {
        alert('Có lỗi xảy ra!');
    }
}

async function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
            await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
            alert('Đã xóa sản phẩm!');
            loadProducts();
        } catch (error) {
            alert('Lỗi khi xóa!');
        }
    }
}