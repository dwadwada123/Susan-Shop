document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});

async function loadOrders() {
    const orders = await get('/orders');
    const tbody = document.getElementById('order-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    orders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).forEach(order => {
        let statusLabel = '';
        if (order.status === 'pending') {
            statusLabel = '<span class="status pending">Chờ xử lý</span>';
        } else if (order.status === 'completed') {
            statusLabel = '<span class="status completed">Đã giao</span>';
        } else {
            statusLabel = '<span class="status" style="background:#ef444420; color:#ef4444">Đã hủy</span>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>
                <div>${order.customerName}</div>
                <div style="font-size: 12px; color: var(--text-muted)">${order.phone}</div>
            </td>
            <td>${order.createdDate}</td>
            <td>${formatCurrency(order.totalPrice)}</td>
            <td>${statusLabel}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="viewOrder('${order.id}')" title="Xem chi tiết">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

let currentOrderId = null;

async function viewOrder(orderId) {
    currentOrderId = orderId;
    const order = await get(`/orders/${orderId}`);
    const allDetails = await get('/order_details');
    const details = allDetails.filter(d => d.orderId == orderId);

    document.getElementById('modal-order-id').innerText = '#' + order.id;
    document.getElementById('detail-customer').innerText = order.customerName;
    document.getElementById('detail-phone').innerText = order.phone;
    document.getElementById('detail-address').innerText = order.address;
    document.getElementById('detail-note').innerText = order.note || 'Không có';
    document.getElementById('detail-total').innerText = formatCurrency(order.totalPrice);

    const btnComplete = document.getElementById('btn-complete-order');
    if (order.status === 'completed') {
        btnComplete.style.display = 'none';
    } else {
        btnComplete.style.display = 'block';
        btnComplete.onclick = () => updateOrderStatus(order.id, 'completed');
    }

    const itemsBody = document.getElementById('order-items-body');
    itemsBody.innerHTML = '';
    details.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #334155;">${item.productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #334155;">x${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #334155;">${formatCurrency(item.unitPrice)}</td>
        `;
        itemsBody.appendChild(tr);
    });

    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

async function updateOrderStatus(orderId, newStatus) {
    if(!confirm('Xác nhận đơn hàng này đã được giao thành công?')) return;
    try {
        await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        alert('Cập nhật trạng thái thành công!');
        closeOrderModal();
        loadOrders();
    } catch (error) {
        alert('Lỗi khi cập nhật!');
    }
}