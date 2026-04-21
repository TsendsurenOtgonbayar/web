import { addStarColor } from "../utils.js";
import AuthService from "../domain/services/AuthenticationService.js";
import { createCommentCard } from "../components/commentsComp.js";
import {addComment,getRecentComments,validateCommentInput,} from "../domain/services/commentService.js";

function initCommentsSection() {
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

  function renderComments() {
    const comments = getRecentComments();
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
      if (!AuthService.checkAuthAndRedirect()) {
        return;
      }
      const isHidden = getComputedStyle(makeComment).display === "none";
      makeComment.style.display = isHidden ? "flex" : "none";
    });
  }

  if (sendButton && commentTextarea && makeComment) {
    sendButton.addEventListener("click", () => {
      if (!AuthService.checkAuthAndRedirect()) {
        return;
      }

      const text = commentTextarea.value;
      const validation = validateCommentInput(text, currentRating);
      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      const authorName = resolveAuthorName(currentUser);
      addComment({
        text,
        rating: currentRating,
        userId: currentUser?.id ?? null,
        authorName,
      });

      renderComments();

      commentTextarea.value = "";
      currentRating = 0;
      if (ratingContainer) {
        const stars = ratingContainer.querySelectorAll("svg");
        stars.forEach((star) => star.classList.remove("filled"));
      }
      makeComment.style.display = "none";
    });
  }

  renderComments();
}
document.addEventListener("DOMContentLoaded", () => {
  initCommentsSection();
});