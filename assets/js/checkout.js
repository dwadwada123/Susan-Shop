document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        window.location.href = 'shop.html';
        return;
    }

    const container = document.getElementById('order-items-list');
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<span>${item.name} (x${item.quantity})</span><span>${formatCurrency(itemTotal)}</span>`;
        container.appendChild(div);
    });

    document.getElementById('order-total').innerText = formatCurrency(total);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('bill-name').value = user.name || '';
        document.getElementById('bill-email').value = user.email || '';
        document.getElementById('bill-phone').value = user.phone || '';
        document.getElementById('bill-address').value = user.address || '';
    }

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const newOrder = {
            userId: user ? user.id : null,
            customerName: document.getElementById('bill-name').value,
            email: document.getElementById('bill-email').value,
            phone: document.getElementById('bill-phone').value,
            address: document.getElementById('bill-address').value,
            note: document.getElementById('bill-note').value,
            totalPrice: total,
            status: 'pending',
            createdDate: new Date().toISOString().split('T')[0]
        };

        try {
            const orderRes = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });

            const createdOrder = await orderRes.json();
            const detailPromises = cart.map(item => {
                const detail = {
                    orderId: createdOrder.id,
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price
                };
                return fetch(`${API_URL}/order_details`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(detail)
                });
            });

            await Promise.all(detailPromises);
            localStorage.removeItem('cart');
            window.location.href = `thankyou.html?id=${createdOrder.id}`;

        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi xử lý đơn hàng.');
        }
    });
});