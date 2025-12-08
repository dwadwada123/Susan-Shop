const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));

if (!currentUser || currentUser.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang quản trị!');
    window.location.href = '../login.html';
}

function logout(e) {
    e.preventDefault();
    if(confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = '../index.html';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') && path.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
});