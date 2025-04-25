$(document).ready(function () {
  // Kiểm tra token trong localStorage
  const token = localStorage.getItem('token');
  const fullName = localStorage.getItem("fullName");

  // Nếu có token, hiển thị nút Logout và ẩn nút Login
  if (token) {
      $('#login-btn').addClass('d-none');  // Ẩn nút Login
      $('#logout-btn').removeClass('d-none');  // Hiển thị nút Logout
      $("#user-menu").removeClass("d-none");
      $("#welcome-text")
        .text(`Welcome, ${fullName}`)
        .removeClass("d-none");
  } else {
      $('#login-btn').removeClass('d-none');  // Hiển thị nút Login
      $('#logout-btn').addClass('d-none');  // Ẩn nút Logout
      $("#user-menu").addClass("d-none");

  }

  // Xử lý sự kiện Logout
  $('#logout-btn').click(function() {
      // Xóa token trong localStorage khi người dùng đăng xuất
      localStorage.removeItem('token');
      localStorage.removeItem('fullName');
      // Ẩn nút Logout và hiển thị lại nút Login
      $("#user-menu").addClass("d-none");
      $('#logout-btn').addClass('d-none');
      $('#login-btn').removeClass('d-none');
      
      // Điều hướng đến trang login hoặc trang chủ (tuỳ chọn)
      window.location.href = '/login.html';  // Hoặc điều hướng về trang chủ: window.location.href = '/';
  });
});
