document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (password !== confirm) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    const checkUser = await get(`/users?email=${email}`);
    if (checkUser.length > 0) {
        alert('Email này đã được đăng ký!');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        role: 'member',
        phone: '',
        address: ''
    };

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
});