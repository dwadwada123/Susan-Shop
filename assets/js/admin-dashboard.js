document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
});

async function loadDashboardStats() {
    const orders = await get('/orders');
    const products = await get('/products');
    const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + Number(order.totalPrice), 0);

    const totalOrders = orders.length;
    const totalProducts = products.length;

    document.getElementById('stat-revenue').innerText = formatCurrency(totalRevenue);
    document.getElementById('stat-orders').innerText = totalOrders;
    document.getElementById('stat-products').innerText = totalProducts;

    const recentOrders = orders
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 5);

    const tbody = document.getElementById('dashboard-table-body');
    tbody.innerHTML = '';

    recentOrders.forEach(order => {
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
            <td>${order.customerName}</td>
            <td>${order.createdDate}</td>
            <td>${formatCurrency(order.totalPrice)}</td>
            <td>${statusLabel}</td>
        `;
        tbody.appendChild(tr);
    });
}