document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    
    const form = document.getElementById('category-form');
    if (form) form.addEventListener('submit', handleSaveCategory);
});

async function loadCategories() {
    const categories = await get('/categories');
    const products = await get('/products');
    
    const tbody = document.getElementById('category-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    categories.forEach(cat => {
        const count = products.filter(p => p.categoryId == cat.id).length;
        const dataStr = JSON.stringify(cat).replace(/"/g, '&quot;');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${cat.id}</td>
            <td style="font-weight: 600;">${cat.name}</td>
            <td>
                <span class="status completed" style="color: var(--text-main); background: rgba(255,255,255,0.1);">
                    ${count} sản phẩm
                </span>
            </td>
            <td class="action-btns">
                <button class="btn-edit" onclick="openModal(${dataStr})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" onclick="deleteCategory(${cat.id}, ${count})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(category = null) {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('modal-title');
    
    if (category) {
        title.innerText = 'Cập nhật danh mục';
        document.getElementById('cate-id').value = category.id;
        document.getElementById('cate-name').value = category.name;
    } else {
        title.innerText = 'Thêm danh mục mới';
        document.getElementById('category-form').reset();
        document.getElementById('cate-id').value = '';
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('category-modal').classList.remove('active');
}

async function handleSaveCategory(e) {
    e.preventDefault();
    
    const id = document.getElementById('cate-id').value;
    const name = document.getElementById('cate-name').value;

    const data = { name: name };

    try {
        if (id) {
            // Sửa
            await fetch(`${API_URL}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Cập nhật thành công!');
        } else {
            // Thêm mới
            await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            alert('Thêm mới thành công!');
        }
        
        closeModal();
        loadCategories();

    } catch (error) {
        alert('Có lỗi xảy ra!');
    }
}

async function deleteCategory(id, count) {
    if (count > 0) {
        alert(`Danh mục này đang chứa ${count} sản phẩm. Bạn cần xóa hoặc chuyển sản phẩm sang danh mục khác trước!`);
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        try {
            await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
            alert('Đã xóa danh mục!');
            loadCategories();
        } catch (error) {
            alert('Lỗi khi xóa!');
        }
    }
}