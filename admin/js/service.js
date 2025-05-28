$(document).ready(function () {
  const token = localStorage.getItem("token");

  function loadServices() {
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
        size: 20,
      }),
      success: function (response) {
        console.log("✅ Reloaded services:", response);

        if (response.code === 0) {
                  console.log("📦 All services data from API:", response.data); // 👉 Thêm dòng này

          let services = response.data.reverse();
          const $serviceList = $("#service-list");
          $serviceList.empty();

          services.forEach((service) => {
            const createdAt = new Date(service.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            const html = `
              <tr>
                <td>${service.id}</td>
                <td>${service.name}</td>
                <td>${service.price} vnd</td>
                
                <td>
                  <div class="form-button-action">
                    <button type="button" class="btn btn-link btn-primary btn-lg edit-service-btn" title="Edit" data-id="${service.id}">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-link btn-danger delete-service-btn" data-id="${service.id}" title="Remove">
                      <i class="fa fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `;
            $serviceList.append(html);
          });

          attachEditButtonHandlers();
          attachDeleteButtonHandlers();
        } else {
          alert("Failed to load services.");
        }
      },
      error: function (xhr, status, error) {
        console.error("❌ Error loading services:", status, error);

        if (xhr.status === 403) {
          alert("Your session has expired. Redirecting to login...");
          // window.location.href = "/login.html";
        } else {
          alert("Something went wrong while loading services.");
        }
      },
    });
  }

  loadServices();

  function attachEditButtonHandlers() {
    $(".edit-service-btn").off("click").on("click", function () {
      const serviceId = $(this).data("id");
      console.log("Editing service with ID:", serviceId);
      getServiceById(serviceId);
    });
  }

  function attachDeleteButtonHandlers() {
    $(".delete-service-btn").off("click").on("click", function () {
      const serviceId = parseInt($(this).data("id"));

      if (confirm("Are you sure you want to delete this service?")) {
        $.ajax({
          url: `https://java.thepointsaver.com/service/delete?id=${serviceId}`,
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
          success: function () {
            alert("Service deleted successfully");
            loadServices();
          },
          error: function (xhr) {
            alert("Delete failed: " + xhr.responseText);
          },
        });
      }
    });
  }

  function getServiceById(serviceId) {
    $.ajax({
      url: `https://java.thepointsaver.com/service/get-by-id`,
      method: "GET",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: { id: serviceId },
      success: function (response) {
        if (response.code === 0) {
          const service = response.data;
          openEditModal(service);
        } else {
          alert("Failed to fetch service details.");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching service:", status, error);
        alert("Something went wrong while fetching service details.");
      },
    });
  }

  let editingServiceId = null;

  $("#addRowModal").on("shown.bs.modal", function () {
    const isEdit = $(".modal-title").text().includes("Edit");
    $("#serviceId").prop("disabled", isEdit);

    if (isEdit) {
      $("#saveServiceBtn").removeClass("d-none");
      $("#addServiceBtn").addClass("d-none");
    } else {
      $("#addServiceBtn").removeClass("d-none");
      $("#saveServiceBtn").addClass("d-none");
    }
  });

  function openEditModal(service) {
    editingServiceId = service.id;
    $("#serviceId").val(service.id); 
    $("#serviceName").val(service.name);
    $("#servicePrice").val(service.price);
 

    $(".modal-title").html('<span class="fw-mediumbold">Edit</span> <span class="fw-light">Service</span>');
    $("#addRowModal").modal("show");
  }

  function createService() {
    const name = $("#serviceName").val();
    const price= parseFloat($("#servicePrice").val());

    const serviceData = {
      name,
      price,
   
    };

    $.ajax({
      url: "https://java.thepointsaver.com/service/create",
      method: "POST",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(serviceData),
      success: function () {
        resetForm();
        $("#addRowModal").modal("hide");
        alert("Service created successfully");
        loadServices();
      },
      error: function (xhr, status, error) {
        if (xhr.status === 400) {
          const errorMessage = xhr.responseJSON.message || "An error occurred. Please try again.";
          alert("Error: " + errorMessage);
        } else {
          alert("Failed to create service. Please try again.");
        }
      },
    });
  }

  function updateService(serviceId) {
    const price = parseFloat($("#servicePrice").val());
    const name = $("#serviceName").val();

    const serviceData = {
      id: serviceId,
      name,
      price,
      
    };

    $.ajax({
      url: `https://java.thepointsaver.com/service/update`,
      method: "PUT",
      dataType: "json",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify(serviceData),
      success: function () {
        resetForm();
        editingServiceId = null;
        $(".modal-title").html('<span class="fw-mediumbold">New</span> <span class="fw-light">Service</span>');
        $("#addRowModal").modal("hide");
        alert("Service updated successfully");
        loadServices();
      },
      error: function () {
        alert("Failed to update service. Please try again.");
      },
    });
  }

  $("#addServiceBtn").click(function () {
    if (editingServiceId) {
      updateService(editingServiceId);
    } else {
      createService();
    }
  });

  $("#saveServiceBtn").click(function () {
    if (editingServiceId) {
      updateService(editingServiceId);
    } else {
      alert("No service selected for editing.");
    }
  });

  $("#addRowModal").on("hidden.bs.modal", resetForm);

  $(".btn-round[data-bs-toggle='modal']").click(resetForm);

  function resetForm() {
    $("#serviceName").val("");
    $("#servicePrice").val("");
    // $("#serviceMethod").val("CASH");
    // $("#serviceStatus").val("PENDING");
    editingServiceId = null;
    $(".modal-title").html('<span class="fw-mediumbold">New</span> <span class="fw-light">Service</span>');
  }
});
