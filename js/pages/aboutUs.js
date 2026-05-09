import { addStarColor } from "../utils.js";
import { addReview, listReviews } from "../domain/services/reviewService.js";

document.addEventListener("DOMContentLoaded", () => {
    const reviewText = document.getElementById("reviewText");
    const submitBtn = document.getElementById("submitReviewBtn");
    const reviewsList = document.getElementById("reviewsList");

    if (!reviewText || !submitBtn || !reviewsList) return;

    let currentRating = 0;

    addStarColor("#starSelector svg", (rating) => {
        currentRating = rating;
        checkFormValidity();
    });

    reviewText.addEventListener("input", checkFormValidity);

    listReviews().slice().reverse().forEach((review) => {
        renderReview(review, true);
    });

    submitBtn.addEventListener("click", () => {
        if (currentRating === 0) {
            alert("Та одоор үнэлгээ өгнө үү!");
            return;
        }
        if (reviewText.value.trim() === "") {
            alert("Та сэтгэгдлээ бичнэ үү!");
            return;
        }

        const review = addReview({
            rating: currentRating,
            text: reviewText.value.trim()
        });

        renderReview(review, true);

        currentRating = 0;
        document.querySelectorAll("#starSelector svg").forEach((star) => {
            star.classList.remove("filled");
        });
        reviewText.value = "";
        submitBtn.classList.remove("active");

        alert("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
    });

    function checkFormValidity() {
        if (currentRating > 0 && reviewText.value.trim().length > 0) {
            submitBtn.classList.add("active");
        } else {
            submitBtn.classList.remove("active");
        }
    }

    function renderReview(review, prepend) {
        const starsHtml = buildStarsMarkup(review.rating);
        const newReviewHTML = `
            <div class="review-item" style="animation: fadeIn 0.5s;">
                <div class="review-header">
                    <div class="reviewer-name">
                        ${review.name || "Зочин (Та)"}
                        <div class="star-rating-display">
                            ${starsHtml}
                        </div>
                    </div>
                    <div class="review-date">${review.createdAt}</div>
                </div>
                <p class="review-text">${review.text}</p>
            </div>
        `;

        reviewsList.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", newReviewHTML);
    }
});

function buildStarsMarkup(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starsHtml += `<svg viewBox="0 0 24 24" style="fill: #e08545; width: 18px; height: 18px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        } else {
            starsHtml += `<svg viewBox="0 0 24 24" fill="none" stroke="#e08545" style="width: 18px; height: 18px; stroke-width: 2px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        }
    }
    return starsHtml;
}