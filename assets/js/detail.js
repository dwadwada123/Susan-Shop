document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    const product = await get(`/products/${productId}`);
    
    if (!product || !product.id) {
        document.getElementById('product-detail-container').innerHTML = '<h2>Sản phẩm không tồn tại</h2>';
        return;
    }

    const categories = await get('/categories');
    const category = categories.find(c => c.id === product.categoryId);

    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-price').innerText = formatCurrency(product.price);
    document.getElementById('detail-desc').innerText = product.detail;
    document.getElementById('detail-id').innerText = `SP-${product.id}`;
    document.getElementById('detail-category').innerText = category ? category.name : 'Khác';

    const qtyInput = document.getElementById('qty-input');
    
    document.getElementById('btn-minus').addEventListener('click', () => {
        let current = parseInt(qtyInput.value);
        if (current > 1) qtyInput.value = current - 1;
    });

    document.getElementById('btn-plus').addEventListener('click', () => {
        let current = parseInt(qtyInput.value);
        qtyInput.value = current + 1;
    });

    document.getElementById('btn-add-cart').addEventListener('click', () => {
        addToCart(product, qtyInput.value);
    });
});