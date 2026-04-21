function buildStarsHtml(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i += 1) {
        if (i < rating) {
            starsHtml += `<svg viewBox="0 0 24 24" style="fill: #e08545; width: 18px; height: 18px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            continue;
        }
        starsHtml += `<svg viewBox="0 0 24 24" fill="none" stroke="#e08545" style="width: 18px; height: 18px; stroke-width: 2px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
    return starsHtml;
}

function createReviewHtml(rating, text) {
    const today = new Date().toISOString().split("T")[0].replace(/-/g, ".");
    return `
        <div class="review-item" style="animation: fadeIn 0.5s;">
            <div class="review-header">
                <div class="reviewer-name">
                    Зочин (Та)
                    <div class="star-rating-display">
                        ${buildStarsHtml(rating)}
                    </div>
                </div>
                <div class="review-date">${today}</div>
            </div>
            <p class="review-text">${text}</p>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#starSelector svg");
    const reviewText = document.getElementById("reviewText");
    const submitBtn = document.getElementById("submitReviewBtn");
    const reviewsList = document.getElementById("reviewsList");

    if (!stars.length || !reviewText || !submitBtn || !reviewsList) {
        return;
    }

    let currentRating = 0;

    function paintStars() {
        stars.forEach((star, index) => {
            star.classList.toggle("filled", index < currentRating);
        });
    }

    function updateSubmitButtonState() {
        const canSubmit = currentRating > 0 && reviewText.value.trim().length > 0;
        submitBtn.classList.toggle("active", canSubmit);
    }

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            currentRating = index + 1;
            paintStars();
            updateSubmitButtonState();
        });
    });

    reviewText.addEventListener("input", updateSubmitButtonState);

    submitBtn.addEventListener("click", () => {
        const text = reviewText.value.trim();
        if (currentRating === 0) {
            alert("Та одоор үнэлгээ өгнө үү!");
            return;
        }
        if (!text) {
            alert("Та сэтгэгдлээ бичнэ үү!");
            return;
        }

        reviewsList.insertAdjacentHTML("afterbegin", createReviewHtml(currentRating, text));

        currentRating = 0;
        reviewText.value = "";
        paintStars();
        updateSubmitButtonState();
        alert("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
    });
});