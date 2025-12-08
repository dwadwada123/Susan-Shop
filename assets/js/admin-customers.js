document.addEventListener("DOMContentLoaded", () => {
    loadCustomers();
    
    const form = document.getElementById('customer-form');
    if (form) form.addEventListener('submit', handleSaveCustomer);
});

async function loadCustomers() {
    const users = await get('/users');
    const tbody = document.getElementById('customer-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    users.forEach(user => {
        let roleLabel = '';
        if (user.role === 'admin') {
            roleLabel = '<span class="status pending" style="color: #8b5cf6; background: rgba(139, 92, 246, 0.1);">Quản trị viên</span>';
        } else {
            roleLabel = '<span class="status completed">Thành viên</span>';
        }
        const dataStr = JSON.stringify(user).replace(/"/g, '&quot;');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${user.id}</td>
            <td style="font-weight: 600;">${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || '---'}</td>
            <td>${roleLabel}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="openModal(${dataStr})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" onclick="deleteCustomer(${user.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(user) {
    document.getElementById('cust-id').value = user.id;
    document.getElementById('cust-name').value = user.name;
    document.getElementById('cust-email').value = user.email;
    document.getElementById('cust-phone').value = user.phone || '';
    document.getElementById('cust-role').value = user.role;
    
    document.getElementById('customer-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('customer-modal').classList.remove('active');
}

async function handleSaveCustomer(e) {
    e.preventDefault();
    
    const id = document.getElementById('cust-id').value;
    const data = {
        name: document.getElementById('cust-name').value,
        phone: document.getElementById('cust-phone').value,
        role: document.getElementById('cust-role').value
    };

    try {
        await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alert('Cập nhật thành công!');
        closeModal();
        loadCustomers();
        const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        if (currentUser.id == id && data.role !== 'admin') {
            alert('Bạn vừa hủy quyền Admin của chính mình. Vui lòng đăng nhập lại.');
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            window.location.href = '../login.html';
        }

    } catch (error) {
        alert('Có lỗi xảy ra!');
    }
}

async function deleteCustomer(id) {
    const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (currentUser.id == id) {
        alert('Bạn không thể tự xóa tài khoản của chính mình!');
        return;
    }

    if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
        try {
            await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
            alert('Đã xóa người dùng!');
            loadCustomers();
        } catch (error) {
            alert('Lỗi khi xóa!');
        }
    }
}