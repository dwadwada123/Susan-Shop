document.addEventListener("DOMContentLoaded", () => {
    renderCart();
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
                    </div>
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
    });

    updateSummary(total);
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