# SUSAN SHOP - GAMING GEAR STORE

Dự án Website bán hàng Gaming Gear (Bàn phím, Chuột, Tai nghe...) được xây dựng bằng **Javascript thuần (Vanilla JS)**. Đây là sản phẩm Assignment môn **Lập trình JavaScript Nâng cao (WEB2064)**.

## Thông tin sinh viên
* **Họ và tên:** Trần Vũ Phong
* **Mã sinh viên:** PD11581
* **Lớp:** MD20301

---

## Công nghệ sử dụng
* **Frontend:** HTML5, CSS3, Javascript (ES6+).
* **Backend (Giả lập):** JSON-Server (Mock API) để xử lý dữ liệu RESTful API.
* **Xử lý bất đồng bộ:** Sử dụng `Fetch API`, `Async/Await`, `Promise.all`.
* **Lưu trữ Client:** `localStorage` (Giỏ hàng, User) và `sessionStorage`.
* **Công cụ:** Visual Studio Code, Git.

---

## Cấu trúc mã nguồn
Dự án được tổ chức theo mô hình tách biệt (Separation of Concerns) để dễ dàng quản lý và bảo trì:


SUSAN-SHOP/

│

├── admin/                  # Giao diện trang quản trị (Admin)

│   ├── dashboard.html      # Thống kê tổng quan

│   ├── products.html       # Quản lý sản phẩm

│   ├── categories.html     # Quản lý danh mục

│   ├── orders.html         # Quản lý đơn hàng

│   └── customers.html      # Quản lý khách hàng

│

├── assets/                 # Tài nguyên tĩnh

│   ├── css/                # Stylesheet (Tách file riêng cho từng trang)

│   │   ├── admin.css       # CSS chung cho Admin

│   │   ├── style.css       # CSS chung cho Client

│   │   ├── shop.css

│   │   └── ...

│   │

│   ├── js/                 # Javascript Logic (Tách module hóa)

│   │   ├── common.js       # Config chung (API URL, Fetch, Format tiền)

│   │   ├── admin-common.js # Logic bảo vệ và xử lý chung cho Admin

│   │   ├── admin-products.js

│   │   ├── admin-orders.js

│   │   ├── home.js

│   │   ├── cart.js

│   │   └── ...

│   │

│   └── images/             # Hình ảnh dự án

│
├── db.json                 # Cơ sở dữ liệu (JSON Server)

├── index.html              # Trang chủ

├── shop.html               # Trang cửa hàng

├── detail.html             # Trang chi tiết sản phẩm

├── cart.html               # Trang giỏ hàng

├── checkout.html           # Trang thanh toán

├── login.html              # Trang đăng nhập

├── register.html           # Trang đăng ký

└── README.md               # Tài liệu hướng dẫn

# Các tính năng của Dự án

## 1. Phía Khách hàng (Client)

### Trang chủ (`index.html`)
* Hiển thị sản phẩm nổi bật động từ API.

### Cửa hàng (`shop.html`)
* **Hiển thị:** Danh sách sản phẩm với phân trang (Pagination).
* **Lọc nâng cao:**
    * Lọc theo Danh mục.
    * Lọc theo Khoảng giá (Range Slider 0 - 100tr).
* **Sắp xếp:** Mới nhất, Giá tăng dần, Giá giảm dần.
* **Add to Cart:** Thêm nhanh sản phẩm vào giỏ khi hover (Yêu cầu đăng nhập).

### Chi tiết sản phẩm (`detail.html`)
* Xem thông tin chi tiết, hình ảnh.
* Tăng giảm số lượng mua.

### Giỏ hàng (`cart.html`)
* **Lưu trữ:** Giỏ hàng lưu trong `localStorage` (F5 không mất dữ liệu).
* **Thao tác:** Tăng/giảm số lượng, xóa sản phẩm.
* **Tính toán:** Tự động tính tổng tiền.

### Thanh toán (`checkout.html`)
* Tự động điền thông tin người mua nếu đã đăng nhập.
* Gửi đơn hàng lên API (Lưu vào bảng `orders` và `order_details`).
* **Tối ưu:** Sử dụng `Promise.all` để tối ưu hóa tốc độ gửi chi tiết đơn hàng.

### Xác thực (Auth)
* **Đăng ký:** Tạo tài khoản mới (Có check trùng email).
* **Đăng nhập:** Hỗ trợ tính năng "Ghi nhớ tôi" (Sử dụng `localStorage` hoặc `sessionStorage`).

---

## 2. Phía Quản trị (Admin)

* ** Bảo mật:** Chặn truy cập nếu tài khoản không có role admin.

### Dashboard
* Thống kê doanh thu thực, tổng đơn hàng, tổng sản phẩm.
* Hiển thị Top 5 đơn hàng mới nhất.

### Quản lý Sản phẩm
* Xem danh sách, tìm kiếm sản phẩm.
* **Thêm mới / Cập nhật:** Sử dụng Modal Popup hiện đại.
* Xóa sản phẩm.

### Quản lý Danh mục
* CRUD (Thêm, Đọc, Sửa, Xóa) Danh mục.
* **Logic nâng cao:**
    * Hiển thị số lượng sản phẩm đang có trong mỗi danh mục.
    * Chặn xóa nếu danh mục đang chứa sản phẩm.

### Quản lý Đơn hàng
* Xem danh sách đơn hàng với trạng thái màu sắc trực quan.
* **Chi tiết đơn hàng (Modal):** Thông tin khách hàng, danh sách món hàng.
* **Cập nhật trạng thái:** Chuyển từ "Chờ xử lý" sang "Đã giao".

### Quản lý Khách hàng
* Xem danh sách người dùng.
* **Phân quyền:** Nâng cấp Member lên Admin và ngược lại.
* **Logic:** Chặn tự xóa tài khoản của chính mình.

---

## 🛠 Hướng dẫn cài đặt & Chạy dự án

Dự án sử dụng **JSON-Server** để giả lập Backend API. Vui lòng thực hiện đúng các bước sau để website hoạt động.

### Bước 1: Cài đặt môi trường
Yêu cầu máy tính đã cài đặt **Node.js**. Sau đó mở Terminal/Command Prompt và cài json-server:

`npm install -g json-server`

### Bước 2: Khởi động API Server
Tại thư mục gốc của dự án (nơi chứa file db.json), mở Terminal và chạy lệnh:
`json-server --watch db.json`

### Bước 3: Chạy Website
Sử dụng Extension Live Server trên Visual Studio Code để mở file index.html.

### Tài khoản dùng thử
Admin: admin@susan.com | 123

User: tranvuphong05@gmail.com | 123456
