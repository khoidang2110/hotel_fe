// $(document).ready(function () {
//     const token = localStorage.getItem("token");




    
// function loadPayments() {
//   $.ajax({
//     url: `https://java.thepointsaver.com/payment/list`,
//     method: "POST",
//     dataType: "json",
//     contentType: "application/json", // 👈 CẦN THÊM DÒNG NÀY

//     headers: {
//         Authorization: "Bearer " + token,
//       },
//       data: JSON.stringify({
//         page: 0,
//         size: 20,
//       }),
//     success: function (response) {
//       console.log("✅ Reloaded payments:", response);

//       if (response.code === 0) {
//         let payments = response.data;
//          // Đảo ngược danh sách thanh toán để render từ mới nhất
//          payments = payments.reverse();
//         const $paymentList = $("#payment-list");
//         $paymentList.empty();

//         payments.forEach((payment, index) => {
//             const createdAt = new Date(payment.createdAt).toLocaleDateString("en-US", {
//               month: "long",
//               day: "numeric",
//               year: "numeric",
//             });
          
//             const html = `
//               <tr>
              
//                  <td>${payment.booking.id}</td>
//                 <td>${payment.booking.user.fullName}</td>
//                 <td>${payment.amount} USD</td>
//                 <td>${payment.paymentMethod}</td>
//                 <td>${payment.status}</td>
//                 <td>${createdAt}</td>
//                 <td>
//                   <div class="form-button-action">
//                     <button type="button" class="btn btn-link btn-primary btn-lg  edit-payment-btn" title="Edit" data-id="${payment.id}" >
//                       <i class="fa fa-edit"></i>
//                     </button>
//                     <button type="button" class="btn btn-link btn-danger" title="Remove">
//                       <i class="fa fa-times"></i>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             `;
//             $paymentList.append(html);
//           });
          
//       } else {
//         alert("Failed to load payments.");
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("❌ Error loading payments:", status, error);

//       if (xhr.status === 403) {
//         alert("Your session has expired. Redirecting to login...");
//       //  window.location.href = "/login.html"; // Thay bằng đường dẫn đến trang login của bạn
//       } else {
//         alert("Something went wrong while loading payments.");
//       }
//     },
//   });
// }
// loadPayments();




// function createPayment() {
//   // Get values from form
//   const bookingId = parseInt($("#bookingId").val());
//   const amount = parseFloat($("#amount").val());
//   const paymentMethod = $("#paymentMethod").val();
//   const status = $("#paymentStatus").val();

//   const paymentData = {
//     bookingId,
//     amount,
//     paymentMethod,
//     status,
//   };

//   $.ajax({
//     url: "https://java.thepointsaver.com/payment/create",
//     method: "POST",
//     dataType: "json",
//     contentType: "application/json",
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//     data: JSON.stringify(paymentData),
//     success: function (response) {
//       console.log("✅ Payment created successfully:", response);
//       loadPayments();

//       // Reset form
//       $("#bookingId").val("");
//       $("#amount").val("");
//       $("#paymentMethod").val("CASH");
//       $("#paymentStatus").val("PENDING");

//       // Close modal (Bootstrap 4)
//       $("#addRowModal").modal("hide");
//       alert("Payment created successfully");

//     },
//     error: function (xhr, status, error) {
//       if (xhr.status === 400) {
//         const errorMessage = xhr.responseJSON.message || "An error occurred. Please try again.";
//         alert("Error: " + errorMessage);
//       } else {
//       //  console.error("❌ Error creating payment:", status, error);
//         alert("Failed to create payment. Please try again.");
//       }
//     },
//   });
// }

// $("#addPaymentBtn").click(function () {
//   createPayment();

//   function getPaymentById(paymentId) {
//     $.ajax({
//       url: `https://java.thepointsaver.com/payment/get-by-id`,
//       method: "GET",
//       dataType: "json",
//       contentType: "application/json",
//       headers: {
//         Authorization: "Bearer " + token, // Sử dụng token mà bạn đã có
//       },
//       data: {
//         id: paymentId, // Truyền id payment vào dưới dạng query string
//       },
//       success: function(response) {
//         console.log("Payment data:", response);
//         if (response.code === 0) {
//           const payment = response.data;
//           // Bây giờ bạn có thể sử dụng dữ liệu trả về, ví dụ:
//           openEditModal(payment);
//         } else {
//           alert("Failed to fetch payment details.");
//         }
//       },
//       error: function(xhr, status, error) {
//         console.error("Error fetching payment:", status, error);
//         alert("Something went wrong while fetching payment details.");
//       }
//     });
//   }
  
//   let editingPaymentId = null; // Biến này sẽ lưu id của payment đang được chỉnh sửa

//   // Mở modal và điền dữ liệu của payment vào form
//   function openEditModal(payment) {
//     // Lưu lại ID của payment đang chỉnh sửa
//     editingPaymentId = payment.id;
  
//     // Điền các giá trị vào các trường trong form
//     $('#bookingId').val(payment.booking.id);
//     $('#amount').val(payment.amount);
//     $('#paymentMethod').val(payment.paymentMethod);
//     $('#paymentStatus').val(payment.status);
  
//     // Mở modal
//     $('#addRowModal').modal('show');
//   }
  
//   // Cập nhật hoặc thêm payment khi bấm nút Add
//   $('#addRowButtonk').on('click', function () {
//     const bookingId = $('#bookingId').val();
//     const amount = $('#amount').val();
//     const paymentMethod = $('#paymentMethod').val();
//     const paymentStatus = $('#paymentStatus').val();
  
//     // Kiểm tra dữ liệu đầu vào
//     if (!bookingId || !amount || !paymentMethod || !paymentStatus) {
//       alert("Please fill in all fields.");
//       return;
//     }
  
//     // Tạo payload để gửi đi
//     const data = {
//       bookingId: bookingId,
//       amount: amount,
//       paymentMethod: paymentMethod,
//       paymentStatus: paymentStatus,
//     };
  
//     if (editingPaymentId) {
//       // Nếu đang chỉnh sửa, gửi yêu cầu PUT để cập nhật
//       $.ajax({
//         url: `https://java.thepointsaver.com/payment/update/${editingPaymentId}`,
//         method: "PUT",
//         contentType: "application/json",
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//         data: JSON.stringify(data),
//         success: function (response) {
//           if (response.code === 0) {
//             alert("Payment updated successfully.");
//             loadPayments(); // Reload danh sách payments
//             $('#addRowModal').modal('hide'); // Đóng modal
//           } else {
//             alert("Failed to update payment.");
//           }
//         },
//         error: function (xhr, status, error) {
//           alert("Error updating payment.");
//         }
//       });
//     } else {
//       // Nếu không có payment id, gửi yêu cầu POST để tạo mới
//       $.ajax({
//         url: `https://java.thepointsaver.com/payment/create`,
//         method: "POST",
//         contentType: "application/json",
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//         data: JSON.stringify(data),
//         success: function (response) {
//           if (response.code === 0) {
//             alert("Payment created successfully.");
//             loadPayments(); // Reload danh sách payments
//             $('#addRowModal').modal('hide'); // Đóng modal
//           } else {
//             alert("Failed to create payment.");
//           }
//         },
//         error: function (xhr, status, error) {
//           alert("Error creating payment.");
//         }
//       });
//     }
//   });
  
 
  


//   $(document).on('click', '.edit-payment-btn', function() {
//     const paymentId = $(this).data('id'); // Lấy giá trị của data-id
//     console.log('Editing payment with ID:', paymentId);
  
//     getPaymentById(paymentId); // Gọi hàm để lấy thông tin payment từ API
//     openEditModal(payment);

//   });
// });






//   });
  

$(document).ready(function () {
  const token = localStorage.getItem("token");

  function loadPayments() {
    $.ajax({
      url: `https://java.thepointsaver.com/payment/list`,
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify({
        page: 0,
        size: 20,
      }),
      success: function (response) {
        console.log("✅ Reloaded payments:", response);

        if (response.code === 0) {
          let payments = response.data;
          // Đảo ngược danh sách thanh toán để render từ mới nhất
          payments = payments.reverse();
          const $paymentList = $("#payment-list");
          $paymentList.empty();

          payments.forEach((payment, index) => {
            const createdAt = new Date(payment.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          
            const html = `
              <tr>
                <td>${payment.booking.id}</td>
                <td>${payment.booking.user.fullName}</td>
                <td>${payment.amount} USD</td>
                <td>${payment.paymentMethod}</td>
                <td>${payment.status}</td>
                <td>${createdAt}</td>
                <td>
                  <div class="form-button-action">
                    <button type="button" class="btn btn-link btn-primary btn-lg edit-payment-btn" title="Edit" data-id="${payment.id}">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-link btn-danger" title="Remove">
                      <i class="fa fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
            $paymentList.append(html);
          });
          
          // Re-attach event handlers after adding new elements
          attachEditButtonHandlers();
          
        } else {
          alert("Failed to load payments.");
        }
      },
      error: function (xhr, status, error) {
        console.error("❌ Error loading payments:", status, error);

        if (xhr.status === 403) {
          alert("Your session has expired. Redirecting to login...");
          // window.location.href = "/login.html";
        } else {
          alert("Something went wrong while loading payments.");
        }
      },
    });
  }
  
  loadPayments();

  // Attach event handlers to edit buttons
  function attachEditButtonHandlers() {
    $('.edit-payment-btn').off('click').on('click', function() {
      const paymentId = $(this).data('id');
      console.log('Editing payment with ID:', paymentId);
      getPaymentById(paymentId);
    });
  }

  function getPaymentById(paymentId) {
    $.ajax({
      url: `https://java.thepointsaver.com/payment/get-by-id`,
      method: "GET",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        id: paymentId,
      },
      success: function(response) {
        console.log("Payment data:", response);
        if (response.code === 0) {
          const payment = response.data;
          openEditModal(payment);
        } else {
          alert("Failed to fetch payment details.");
        }
      },
      error: function(xhr, status, error) {
        console.error("Error fetching payment:", status, error);
        alert("Something went wrong while fetching payment details.");
      }
    });
  }
  
  let editingPaymentId = null; // Variable to store ID of payment being edited

$('#addRowModal').on('shown.bs.modal', function () {
  const isEdit = $('.modal-title').text().includes('Edit');

  // Disable hoặc enable input bookingId
  $('#bookingId').prop('disabled', isEdit);

  // Hiển thị đúng nút
  if (isEdit) {
    $('#savePaymentBtn').removeClass('d-none');
    $('#addPaymentBtn').addClass('d-none');
  } else {
    $('#addPaymentBtn').removeClass('d-none');
    $('#savePaymentBtn').addClass('d-none');
  }
});

  // Open modal and fill with payment data
  function openEditModal(payment) {
    // Save ID of payment being edited
    editingPaymentId = payment.id;
   // $('#bookingId').val(payment.booking.id).prop('disabled', true); // disable

    // Fill form fields with values
    $('#bookingId').val(payment.booking.id);
    $('#amount').val(payment.amount);
    $('#paymentMethod').val(payment.paymentMethod);
    $('#paymentStatus').val(payment.status);
  
    // Update modal title to indicate editing
    $('.modal-title').html('<span class="fw-mediumbold">Edit</span> <span class="fw-light">Payment</span>');
    
    // Open modal
    $('#addRowModal').modal('show');
  }

  function createPayment() {
    // Get values from form
    const bookingId = parseInt($("#bookingId").val());
    const amount = parseFloat($("#amount").val());
    const paymentMethod = $("#paymentMethod").val();
    const status = $("#paymentStatus").val();

    const paymentData = {
      bookingId,
      amount,
      paymentMethod,
      status,
    };

    $.ajax({
      url: "https://java.thepointsaver.com/payment/create",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(paymentData),
      success: function (response) {
        console.log("✅ Payment created successfully:", response);
        
        // Reset form
        $("#bookingId").val("");
        $("#amount").val("");
        $("#paymentMethod").val("CASH");
        $("#paymentStatus").val("PENDING");

        // Close modal (Bootstrap 5)
        $("#addRowModal").modal("hide");
        alert("Payment created successfully");
        
        // Reload payments to show new data
        loadPayments();
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          const errorMessage = xhr.responseJSON.message || "An error occurred. Please try again.";
          alert("Error: " + errorMessage);
        } else {
          console.error("❌ Error creating payment:", status, error);
          alert("Failed to create payment. Please try again.");
        }
      },
    });
  }
  
  function updatePayment(paymentId) {
    // Get values from form
    //const bookingId = parseInt($("#bookingId").val());
    const amount = parseFloat($("#amount").val());
    const paymentMethod = $("#paymentMethod").val();
    const status = $("#paymentStatus").val();

    const paymentData = {
      id:paymentId,
      amount,
      paymentMethod,
      status,
    };

    $.ajax({
      url: `https://java.thepointsaver.com/payment/update`,
      method: "PUT",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(paymentData),
      success: function (response) {
        console.log("✅ Payment updated successfully:", response);
        
        // Reset form
        $("#bookingId").val("");
        $("#amount").val("");
        $("#paymentMethod").val("CASH");
        $("#paymentStatus").val("PENDING");
        
        // Reset editing state
        editingPaymentId = null;
        
        // Reset modal title
        $('.modal-title').html('<span class="fw-mediumbold">New</span> <span class="fw-light">Payment</span>');

        // Close modal
        $("#addRowModal").modal("hide");
        alert("Payment updated successfully");
        
        // Reload payments
        loadPayments();
      },
      error: function (xhr, status, error) {
        console.error("❌ Error updating payment:", status, error);
        alert("Failed to update payment. Please try again.");
      },
    });
  }

  // Add Payment Button Click Handler
  $("#addPaymentBtn").click(function () {
    if (editingPaymentId) {
      // If editing, update payment
      updatePayment(editingPaymentId);
    } else {
      // If adding new, create payment
      createPayment();
    }
  });
  
  // Reset form when modal is closed
  $('#addRowModal').on('hidden.bs.modal', function () {
    $("#bookingId").val("");
    $("#amount").val("");
    $("#paymentMethod").val("CASH");
    $("#paymentStatus").val("PENDING");
    
    // Reset editing state
    editingPaymentId = null;
    
    // Reset modal title
    $('.modal-title').html('<span class="fw-mediumbold">New</span> <span class="fw-light">Payment</span>');
  });
  
  // Add new payment button on modal should show empty form
  $('.btn-round[data-bs-toggle="modal"]').click(function() {
    // Reset form
    $("#bookingId").val("");
    $("#amount").val("");
    $("#paymentMethod").val("CASH");
    $("#paymentStatus").val("PENDING");
    
    // Reset editing state
    editingPaymentId = null;
    
    // Reset modal title
    $('.modal-title').html('<span class="fw-mediumbold">New</span> <span class="fw-light">Payment</span>');
  });
  // Save Payment Button Click Handler (for editing)
$("#savePaymentBtn").click(function () {
  if (editingPaymentId) {
    updatePayment(editingPaymentId);
  } else {
    alert("No payment selected for editing.");
  }
});

});