import { addStarColor, showNotification } from "../utils.js";
import APIGateway from "../gateway/apiGateway.js";
import { createCommentCard } from "../components/commentsCard.js";

function resolveAuthorName(currentUser) {
  return currentUser?.Name || currentUser?.name || currentUser?.Email || currentUser?.email || "Тодорхойгүй";
}

function validateReviewInput(text, rating) {
  if (!text || text.trim().length < 5) {
    return { valid: false, message: "Сэтгэгдэл хамгийн багадаа 5 тэмдэгттэй байна" };
  }

  if (rating < 1 || rating > 5) {
    return { valid: false, message: "Одны үнэлгээг сонгоно уу" };
  }

  return { valid: true };
}

async function initCommentsSection() {
  const commentRow = document.getElementById("commentRow");
  const makeComment = document.getElementById("makeComments");
  const commentButton = document.getElementById("CommentButton");
  const commentTextarea = document.getElementById("commentText");
  const sendButton = document.getElementById("sentButton");
  const ratingContainer = document.querySelector("#makeComments .UnelgeeFiveStar");

  if (!commentRow) {
    return;
  }

  let currentRating = 0;

  async function renderComments() {
    const comments = await APIGateway.getRecentReviews(10);
    commentRow.innerHTML = "";
    comments.forEach((comment) => {
      commentRow.appendChild(createCommentCard(comment));
    });
  }

  if (makeComment) {
    makeComment.style.display = "none";
  }

  if (ratingContainer) {
    addStarColor("#makeComments .UnelgeeFiveStar svg", (rating) => {
      currentRating = rating;
    });
  }

  if (commentButton && makeComment) {
    commentButton.addEventListener("click", () => {
      if (!APIGateway.checkAuthAndRedirect()) {
        return;
      }
      const isHidden = getComputedStyle(makeComment).display === "none";
      makeComment.style.display = isHidden ? "flex" : "none";
    });
  }

  if (sendButton && commentTextarea && makeComment) {
    sendButton.addEventListener("click", async () => {
      if (!APIGateway.checkAuthAndRedirect()) {
        return;
      }

      const text = commentTextarea.value;
      const validation = validateReviewInput(text, currentRating);
      if (!validation.valid) {
        showNotification(validation.message, "error");
        return;
      }

      const currentUser = await APIGateway.getCurrentUser();
      const authorName = resolveAuthorName(currentUser);
      const result = await APIGateway.submitReview(currentUser?.userId, {
        text,
        rating: currentRating,
        appointmentId: null,
        authorName,
      });

      if (!result.success) {
        showNotification(result.error || "Сэтгэгдэл хадгалах боломжгүй", "error");
        return;
      }

      await renderComments();

      commentTextarea.value = "";
      currentRating = 0;
      if (ratingContainer) {
        const stars = ratingContainer.querySelectorAll("svg");
        stars.forEach((star) => star.classList.remove("filled"));
      }
      makeComment.style.display = "none";
    });
  }

  await renderComments();
}

document.addEventListener("DOMContentLoaded", () => {
  initCommentsSection();
});