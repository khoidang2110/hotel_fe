$(document).ready(function () {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem("fullName");
    if (!token) {
        // Không có token thì đá về trang chủ
        window.location.href = '../index.html';
      } else {
        // Nếu có token thì gọi API user/info để kiểm tra role_id
        $.ajax({
          url: 'https://java.thepointsaver.com/user/info',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          },
          success: function (res) {
            const roleId = res?.data?.role?.id;
          
            if (roleId === 2 || roleId === 3) {
              // Nếu role là 2 (admin) hoặc 3 (manager) thì hiển thị tên người dùng
              $('#name-text').text(` ${fullName}`);
              $('#role-text').text(` ${res.data.role.name} - `);
            } else {
              // Nếu không phải admin hoặc manager thì về trang chủ
              window.location.href = '../index.html';
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
      }   
  
    // Xử lý sự kiện Logout
    $('#logout-btn').click(function() {
        // Xóa token trong localStorage khi người dùng đăng xuất
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
      
        
        // Điều hướng đến trang login hoặc trang chủ (tuỳ chọn)
        window.location.href = '../login.html';  // Hoặc điều hướng về trang chủ: window.location.href = '/';
    });
  });
  