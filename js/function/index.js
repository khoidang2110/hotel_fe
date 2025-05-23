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



   $.ajax({
          url: 'https://java.thepointsaver.com/user/info',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          },
          success: function (res) {
            const roleId = res?.data?.role?.id;
          
            if (roleId === 2 || roleId === 3) {
              // Nếu role là 2 (staff) hoặc 3 (admin) thì hiển thị tên người dùng
                  $('#admin-btn').removeClass('d-none');  // Hiển thị nút admin

            } else {
              // Nếu không phải admin hoặc manager thì ẩn
      $('#admin-btn').addClass('d-none');  // Ẩn nút Login
            }
          },
          error: function (xhr) {
              if (xhr.status === 403) {
                  // Nếu lỗi token (token sai, hết hạn...)
                  alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.');
                  localStorage.removeItem('token'); // Xoá token đã lưu
                  window.location.href = '../login.html'; // Điều hướng về trang đăng nhập
              } else {
                  // Nếu lỗi khác (lỗi mạng chẳng hạn) cũng điều hướng về trang chủ
                  window.location.href = '../index.html';
              }
          }
        });



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
