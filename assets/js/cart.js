document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', handleCheckout);
    }
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-body');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        updateSummary(0);
        return;
    } else {
        emptyMsg.style.display = 'none';
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <span style="font-size: 12px; color: #888;">Còn lại trong kho: Đang tải...</span> </div>
                </div>
            </td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <div class="quantity-box" style="margin: 0;">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" class="qty-input-new" readonly>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </td>
            <td class="item-total">${formatCurrency(itemTotal)}</td>
            <td>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        container.appendChild(tr);
        checkStockForDisplay(item.id, tr);
    });

    updateSummary(total);
}

async function checkStockForDisplay(productId, trElement) {
    try {
        const product = await get(`/products/${productId}`);
        const span = trElement.querySelector('span[style*="font-size: 12px"]');
        if (span) span.innerText = `Kho còn: ${product.stock}`;
    } catch (e) {}
}

async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        if(confirm('Bạn cần đăng nhập để thanh toán. Đi đến trang đăng nhập?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    try {
        for (const item of cart) {
            const product = await get(`/products/${item.id}`);
            if (product.stock < item.quantity) {
                alert(`Sản phẩm "${item.name}" hiện chỉ còn ${product.stock} cái. Vui lòng giảm số lượng!`);
                return;
            }
        }
        window.location.href = 'checkout.html';

    } catch (error) {
        console.error(error);
        alert('Có lỗi kết nối, vui lòng thử lại.');
    }
}

function changeQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let newQty = Number(cart[index].quantity) + change;

    if (newQty < 1) newQty = 1;

    cart[index].quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    updateCartBadge();
}

function removeItem(index) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    updateCartBadge();
}

function updateSummary(total) {
    const formatted = formatCurrency(total);
    document.getElementById('subtotal-price').innerText = formatted;
    document.getElementById('total-price').innerText = formatted;
}