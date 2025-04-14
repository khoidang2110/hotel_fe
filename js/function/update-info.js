$(document).ready(function () {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token);  
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = '/login.html'; 
        return;
      }

  // get info 
      $.ajax({
        url: "https://java.thepointsaver.com/user/info", // ← Thay {{url}} bằng API thực tế
        type: "GET",
        headers: {
          "Authorization": "Bearer " + token
        },
        success: function (data) {
            console.log('API Response:', data);  // Kiểm tra dữ liệu trả về từ API
            
            const data1 = data.data
            // Giả sử data trả về có dạng:
            // { email: "abc@example.com", phone: "123456", fullName: "Marta" }
            if (data1 && data1.email && data1.phone && data1.fullName) {
                $("#user-email").val(data1.email);
                $("#user-phone").val(data1.phone);
                $("#user-fullname").val(data1.fullName);
            } else {
                console.error('Dữ liệu trả về không đúng định dạng.');
            }
        },
        error: function (xhr) {
            console.error("Lỗi khi lấy thông tin người dùng:", xhr.responseText);
            alert("Lỗi khi lấy thông tin người dùng: " + xhr.responseText);
        }
      });
       // Xử lý sự kiện click nút Update
       $("#update-form").submit(function (e) {
        e.preventDefault(); // Ngừng hành động mặc định của form (submit form)

        // Lấy dữ liệu từ form
       const email =  $("#user-email").val();

        const fullName = $("#user-fullname").val();
        const phone = $("#user-phone").val();

        // Kiểm tra nếu thông tin có hợp lệ
        if (!fullName || !phone) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Gửi yêu cầu update
        $.ajax({
            url: "https://java.thepointsaver.com/user/update", // API update thông tin người dùng
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify({
                email:email,
                fullName: fullName,
                phone: phone
            }),
            contentType: "application/json",
            success: function () {
                alert("Cập nhật thông tin thành công!");
               
                // Có thể thêm redirect hoặc cập nhật giao diện sau khi update thành công
                localStorage.removeItem('token');
                window.location.href = '/login.html'; 
            },
            error: function (xhr) {
                alert("Lỗi khi cập nhật thông tin: " + xhr.responseText);
            }
        });
    });
  });