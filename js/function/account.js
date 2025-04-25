//jquery
$(document).ready(function () {
   
  const token = localStorage.getItem('token');
  

    $("#login-form").submit(function (e) {
        e.preventDefault(); // Ngăn reload trang
      
        var email = $("#email").val();
        var password = $("#password").val();
      
        $.ajax({
          method: "POST",
          url: "https://java.thepointsaver.com/auth/login", // đổi URL nếu cần
          contentType: "application/json",
          data: JSON.stringify({
            email: email,
            password: password
          }),
          success: function (response) {
            if (response.data) {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("fullName", response.data.fullName);
              alert("Đăng nhập thành công");
              window.location.href = "index.html";
            } else {
              alert("Đăng nhập thất bại");
            }
          },
          error: function (xhr) {
            const message = xhr.responseJSON?.message || "Có lỗi xảy ra, vui lòng thử lại.";
          
            if (xhr.status === 403) {
              alert("Tài khoản bị khóa: " + message);
            } else if (xhr.status === 400) {
              alert("Lỗi đăng nhập: " + message);
            } else {
              alert("Lỗi không xác định (" + xhr.status + "): " + message);
            }
          }
        });
      });

      $("#register-form").submit(function (e) {
        e.preventDefault(); // Ngăn reload trang
      
        var signupEmail = $("#signup-email").val();
        var signupFullname = $("#signup-fullname").val();
        var signupPhone = $("#signup-phone").val(); // ✅ Đúng ID của phone input
        var signupPassword1 = $("#signup-password1").val();
        var signupPassword2 = $("#signup-password2").val();
      
        if (signupPassword1 !== signupPassword2) {
          alert("Mật khẩu không trùng khớp!");
          return;
        }
      
        $.ajax({
          method: "POST",
          url: "https://java.thepointsaver.com/user/sign-up",
          data: JSON.stringify({
            email: signupEmail,
            password: signupPassword1,
            fullName: signupFullname,  // ✅ Đúng key theo API backend
            phone: signupPhone         // ✅ Thêm số điện thoại nếu backend có nhận
          }),
          contentType: "application/json"
        })
          .done(function (result) {
          

            if (result.code === 0) {
                alert("Đăng ký thành công!");
                window.location.href = "login.html";
              } else {
                alert("Đăng ký thất bại: " + result.message);
              }
              
          })
          .fail(function (xhr) {
            if (xhr.status === 400) {
              var response = JSON.parse(xhr.responseText);
              alert(response.message);
            } else {
              alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
          });
      });
      $("#change-password-form").submit(function (e) {
        e.preventDefault(); // Ngăn reload trang
      
        
        var oldPassword = $("#old-password").val();
      
        var newPassword1 = $("#new-password1").val();
        var newPassword2 = $("#new-password2").val();
      
        if (newPassword1 !== newPassword2) {
          alert("Mật khẩu không trùng khớp!");
          return;
        }
        $.ajax({
          method: "PUT",
          url: "https://java.thepointsaver.com/user/change-password", // đổi URL nếu cần
          contentType: "application/json",
          headers: {
            "Authorization": "Bearer " + token
        },
          data: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword1
          }),
          success: function () {
            alert("Đổi password thành công");
            localStorage.removeItem('token');
            window.location.href = "login.html";
          },
          error: function (xhr) {
            alert("Đổi password  thất bại: " + xhr.responseJSON?.message || "Lỗi không xác định");
          }
        });
      });
      
  });
  