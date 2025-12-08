document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;
    const remember = document.getElementById('remember-me').checked;

    const users = await get(`/users?email=${email}&password=${password}`);

    if (users.length > 0) {
        const user = users[0];

        if (remember) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
        
        alert(`Xin chào, ${user.name}!`);
        
        if (user.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert('Email hoặc mật khẩu không chính xác!');
    }
});