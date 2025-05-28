

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
        let payments = response.data.reverse(); // Mới nhất lên đầu
        const $paymentList = $("#payment-list");
        $paymentList.empty(); // Xóa cũ

        payments.forEach((payment, index) => {
          const createdAt = new Date(payment.createdAt).toLocaleDateString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          // 1. Dòng chính
          $paymentList.append(`
            <tr>
              <td>${payment.bookingId || "N/A"}</td>
              <td>${payment.booking?.user?.fullName || "N/A"}</td>
              <td>${payment.amount.toLocaleString()} đ</td>
              <td>${payment.paymentMethod}</td>
              <td><span class="${payment.status === 'PAID' ? 'text-success' : 'text-warning'}">${payment.status}</span></td>
              <td>${createdAt}</td>
              <td>
                <div class="form-button-action">
                   <button type="button" class="btn btn-link btn-danger add-service-payment-btn" title="Add" data-id="${payment.id}">
                   <i class="fa fa-plus" aria-hidden="true"></i>

                  </button>
                  <button type="button" class="btn btn-link btn-primary btn-lg edit-payment-btn" title="Edit" data-id="${payment.id}">
                    <i class="fa fa-edit"></i>
                  </button>
                  <button type="button" class="btn btn-link btn-danger delete-payment-btn" title="Remove" data-id="${payment.id}">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          `);

          // 2. Dòng bảng con nếu có paymentDetails
          if (payment.paymentDetails && payment.paymentDetails.length > 0) {
            $paymentList.append(`
              <tr>
                <td colspan="7">
                  <table  width="100%" style="background: #f9f9f9;">
                    <thead>
                      <tr>
                        <th class="text-center">STT</th>
                        <th class="text-center">Dịch vụ</th>
                        <th class="text-center">Số lượng</th>
                        <th class="text-center">Đơn giá</th>
                        <th class="text-center">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${payment.paymentDetails.map((detail, i) => `
                      <tr>
  <td class="text-center">${i + 1}</td>
  <td class="text-center">${detail.service?.name || "N/A"}</td>
  <td class="text-center">${detail.quantity}</td>
  <td class="text-center">${detail.price.toLocaleString()} đ</td>
  <td class="text-center">${detail.total.toLocaleString()} đ</td>
  <td > 
   <div class="form-button-action">
                <button type="button" class="btn btn-link btn-danger delete-service-payment-btn" title="Remove" data-id="${detail.id}">
                    <i class="fa fa-times"></i>
                  </button>
  </td>
</tr>
                      `).join("")}
                    </tbody>
                  </table>
                </td>
              </tr>
            `);
          }
        });

        // Gán lại sự kiện sau khi render xong
        attachEditButtonHandlers();
        attachDeleteButtonHandlers();
attachAddServicePaymentHandlers(); // ⬅️ Thêm dòng này
attachDeleteServicePaymentHandlers();

      } else {
        alert("❌ Tải danh sách thanh toán thất bại.");
      }
    },
    error: function (xhr, status, error) {
      console.error("❌ Error loading payments:", status, error);
      if (xhr.status === 403) {
        alert("⚠️ Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
        // window.location.href = "/login.html";
      } else {
        alert("Đã có lỗi khi tải dữ liệu thanh toán.");
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

  function attachDeleteButtonHandlers() {
    $('.delete-payment-btn').off('click').on('click', function () {
      const paymentId = parseInt($(this).data('id')); // Ép kiểu về int
  
      if (confirm('Are you sure you want to delete this payment?')) {
        $.ajax({
          url: `https://java.thepointsaver.com/payment/delete?id=${paymentId}`,
          method: 'DELETE',
          headers: {
            Authorization: "Bearer " + token,
          },
          success: function (response) {
            alert('Payment deleted successfully');
            loadPayments();
          },
          error: function (xhr) {
            alert('Delete failed: ' + xhr.responseText);
          }
        });
      }
    });
  }


  function attachAddServicePaymentHandlers() {
  $(".add-service-payment-btn").off("click").on("click", function () {
    const paymentId = $(this).data("id");
    $("#addServicePaymentId").val(paymentId);

    // Gọi API dịch vụ
    fetchServices(function (err, services) {
      if (err) {
        alert("Không thể tải danh sách dịch vụ");
        return;
      }

      const $serviceSelect = $("#serviceId");
      $serviceSelect.empty();
      services.forEach(service => {
        $serviceSelect.append(
          $("<option></option>")
            .val(service.id)
            .text(`${service.name} - ${service.price} vnd`)
        );
      });

      // Hiển thị modal
      const modal = new bootstrap.Modal(document.getElementById("addServiceModal"));
      modal.show();
    });
  });
}

function attachDeleteServicePaymentHandlers() {
  $(".delete-service-payment-btn").off("click").on("click", function () {
    const detailId = $(this).data("id");

    if (confirm("Bạn có chắc muốn xoá dịch vụ này khỏi thanh toán không?")) {
      $.ajax({
        url: `https://java.thepointsaver.com/payment/remove-service/${detailId}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
        success: function (response) {
          alert("Dịch vụ đã được xoá khỏi thanh toán");
          loadPayments();
        },
        error: function (xhr) {
          alert("Xoá thất bại: " + xhr.responseText);
        },
      });
    }
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
   // const amount = parseFloat($("#amount").val());
    const paymentMethod = $("#paymentMethod").val();
    const status = $("#paymentStatus").val();

    const paymentData = {
      bookingId,
     // amount,
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

$("#confirmAddServiceBtn").on("click", function () {
  const paymentId = parseInt($("#addServicePaymentId").val());
  const serviceId = parseInt($("#serviceId").val());
  const quantity = parseInt($("#quantity").val());

  $.ajax({
    url: "https://java.thepointsaver.com/payment/add-service",
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: JSON.stringify({ paymentId, serviceId, quantity }),
    success: function (response) {
      $("#addServiceModal").modal("hide");
      alert("✅ Added service to payment.");
      loadPayments(); // Reload table to show detail
    },
    error: function (xhr) {
      alert("❌ Failed to add service: " + (xhr.responseJSON?.message || "Unknown error"));
    }
  });
});

function fetchServices(callback) {
  $.ajax({
    url: `https://java.thepointsaver.com/service/list`,
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: JSON.stringify({
      page: 0,
      size: 100,
    }),
    success: function (response) {
      if (response.code === 0) {
        const services = response.data.reverse(); // Hoặc giữ nguyên thứ tự nếu bạn muốn
        callback(null, services);
      } else {
        callback(new Error("Failed to load services"), null);
      }
    },
    error: function (xhr, status, error) {
      console.error("❌ Error fetching services:", status, error);
      callback(new Error("Request failed"), null);
    }
  });
}

});