const API_URL = "http://localhost:3000";

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

async function get(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        return await response.json();
    } catch (error) {
        return [];
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
}

function updateAuthHeader() {
    const user = getCurrentUser();
    const authContainer = document.querySelector('.header-actions');
    const loginBtn = authContainer.querySelector('.btn-primary');

    if (user) {
        if (loginBtn) loginBtn.remove();
        
        if (!document.getElementById('user-info')) {
            const userInfo = document.createElement('div');
            userInfo.id = 'user-info';
            userInfo.style.display = 'flex';
            userInfo.style.alignItems = 'center';
            userInfo.style.gap = '15px';
            
            userInfo.innerHTML = `
                <span style="font-weight: 600;">Hi, ${user.name}</span>
                <a href="#" onclick="logout(event)" style="color: #ef4444; font-size: 14px;"><i class="fa-solid fa-right-from-bracket"></i></a>
            `;
            authContainer.appendChild(userInfo);
        }
    }
}

function logout(e) {
    e.preventDefault();
    if(confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        localStorage.removeItem('cart'); 
        window.location.href = 'index.html';
    }
}

function addToCart(product, quantity = 1) {
    const user = getCurrentUser();
    
    if (!user) {
        if (confirm('Bạn cần đăng nhập để thêm vào giỏ hàng. Đi tới trang đăng nhập?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
    } else {
        cart.push({ ...product, quantity: Number(quantity) });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.badge');
    badges.forEach(b => b.innerText = totalQty);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    updateAuthHeader();
});