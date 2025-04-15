$(document).ready(function () {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  let roomType = params.get("roomType");

  const roomImageMap = {
    SINGLE: "1",
    DOUBLE: "2",
    SUITE: "3",
  };
  const imageNumber = roomImageMap[roomType?.toUpperCase()] || "default";

  // Gán src cho hình ảnh
  const imageElement = document.getElementById("roomImage");
  imageElement.src = `img/rooms/${imageNumber}.png`;

  console.log("🔐 Token từ localStorage:", token);

  const $reviewDiv = $(".write_review");
  console.log(
    "🔎 Có tìm thấy .write_review không?",
    $reviewDiv.length > 0 ? "✅ Có" : "❌ Không"
  );

  if (token) {
    console.log("✅ Có token, sẽ hiển thị form review.");
    $reviewDiv.show();
  } else {
    console.log("⛔ Không có token, sẽ ẩn form review.");
    $reviewDiv.hide();
  }

  let selectedRating = 0;

  const formattedRoomType =
    roomType.charAt(0).toUpperCase() + roomType.slice(1).toLowerCase();

  document.title = `${formattedRoomType} Rooms`;

  // Update the room heading
  $(".room_heading_inner h3").text(`${roomType} ROOMS`);

  // Update the breadcrumb heading
  $("#room-name h3").text(`${formattedRoomType} Rooms Details`);

  // chọn stars rating
  loadReviews(roomType);
  $(".rating_stars i").on("click", function () {
    selectedRating = $(this).index() + 1;
    console.log("⭐ Selected Rating:", selectedRating);

    // Reset tất cả các ngôi sao
    $(".rating_stars i").removeClass("fa-star").addClass("fa-star-o");

    // Đổi icon các sao đã chọn
    $(".rating_stars i").each(function (index) {
      if (index < selectedRating) {
        $(this).removeClass("fa-star-o").addClass("fa-star");
      }
    });
  });

  $("#create-review-form").on("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const comment = $("textarea").val().trim();
    // Lấy roomType hiện tại từ URL
    const currentRoomType = params.get("roomType");
    console.log("Current roomType when submitting:", currentRoomType);

    // Map roomType → roomId
    const roomIdMap = {
      SINGLE: 1,
      DOUBLE: 2,
      SUITE: 3,
    };

    // Dùng currentRoomType thay vì roomType
    const roomId = roomIdMap[currentRoomType?.toUpperCase()] || null;

    if (!roomId) {
      alert("Invalid room type.");
      return;
    }

    if (!selectedRating || !comment) {
      alert("Please select rating and enter a comment.");
      return;
    }

    // Gọi API
    $.ajax({
      url: "https://java.thepointsaver.com/review/create",
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify({
        roomId: roomId,
        rating: selectedRating,
        comment: comment,
      }),
      success: function (response) {
        console.log("✅ Review submitted:", response);
        alert("Review submitted successfully!");
        $("textarea").val("");
        $(".rating_stars i").removeClass("fa-star").addClass("fa-star-o");
        selectedRating = 0;

        window.location.reload();
      },
      error: function (xhr, status, error) {
        console.error("❌ Error:", xhr.responseText || error);
        alert("Failed to submit review.");
      },
    });
  });
  function loadReviews(roomType) {
    $.ajax({
      url: `https://java.thepointsaver.com/review/room-type`,
      method: "GET",
      data: {
        roomType: roomType,
      },
      dataType: "json",
      success: function (response) {
        console.log("✅ Reloaded reviews:", response);

        if (response.code === 0) {
          const reviews = response.data;
          const $reviewList = $("#review-list");
          $reviewList.empty(); // Clear old content

          reviews.forEach((review) => {
            const stars = Array(review.rating)
              .fill('<i class="fa fa-star"></i>')
              .join("");
            const createdAt = new Date(review.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            );

            const html = `
                            <div class="single_review mb-4 pb-4 border-bottom">
                                <div class="review_header d-flex justify-content-between mb-3">
                                    <div class="reviewer_info">
                                        <h5>${
                                          review.userName || "Anonymous"
                                        }</h5>
                                        <div class="rating">${stars}</div>
                                    </div>
                                    <div class="review_date">
                                        <p>${createdAt}</p>
                                    </div>
                                </div>
                                <div class="review_content">
                                    <p>"${review.comment}"</p>
                                </div>
                            </div>
                        `;
            $reviewList.append(html);
          });
        } else {
          alert("Failed to reload reviews.");
        }
      },
      error: function (xhr, status, error) {
        console.error("❌ Error loading reviews:", status, error);
        alert("Something went wrong while reloading reviews.");
      },
    });
  }
});
