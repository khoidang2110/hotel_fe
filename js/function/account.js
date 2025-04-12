//jquery
$(document).ready(function () {
   
  
  

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
              localStorage.setItem("token", response.data);
              alert("Đăng nhập thành công");
              window.location.href = "index.html";
            } else {
              alert("Đăng nhập thất bại");
            }
          },
          error: function (xhr) {
            alert("Đăng nhập thất bại: " + xhr.responseJSON?.message || "Lỗi không xác định");
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
      
      
  });
  