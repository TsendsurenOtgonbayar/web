import { addStarColor } from "./utils.js";
import { addComment, listComments } from "./domain/services/commentService.js";
import { requireAuth } from "./domain/services/AuthenticationService.js";
import { setActiveNavLinks, updateHeaderAuthStatus } from "./domain/services/navService.js";

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuthStatus();
  setActiveNavLinks();
  initCommentSection();
});

function initCommentSection() {
  const commentRow = document.getElementById("commentRow");
  const makeComment = document.getElementById("makeComments");
  const commentButton = document.getElementById("CommentButton");
  const commentTextarea = document.getElementById("commentText");
  const sendButton = document.getElementById("sentButton");
  const ratingContainer = document.querySelector("#makeComments .UnelgeeFiveStar");

  if (!commentRow || !makeComment) return;

  makeComment.style.display = "none";

  let currentRating = 0;
  if (ratingContainer) {
    addStarColor("#makeComments .UnelgeeFiveStar svg", (rating) => {
      currentRating = rating;
    });
  }

  if (commentButton) {
    commentButton.addEventListener("click", () => {
      if (!requireAuth()) return;
      const isHidden =
        makeComment.style.display === "none" ||
        getComputedStyle(makeComment).display === "none";

      makeComment.style.display = isHidden ? "flex" : "none";
    });
  }

  if (sendButton && commentTextarea) {
    sendButton.addEventListener("click", () => {
      if (!requireAuth()) return;

      const text = commentTextarea.value.trim();
      if (text.length < 5) {
        alert("Сэтгэгдэл хамгийн багадаа 5 тэмдэгт байх ёстой.");
        return;
      }
      if (currentRating === 0) {
        alert("Та одоор үнэлгээ өгнө үү.");
        return;
      }

      addComment({ text, rating: currentRating });
      renderComments();

      commentTextarea.value = "";
      currentRating = 0;
      if (ratingContainer) {
        ratingContainer.querySelectorAll("svg").forEach((star) => {
          star.classList.remove("filled");
        });
      }
      makeComment.style.display = "none";
    });
  }

  renderComments();

  function renderComments() {
    const comments = listComments(10);
    commentRow.innerHTML = "";
    comments.forEach((comment) => {
      commentRow.appendChild(createCommentCard(comment));
    });
  }
}

function createCommentCard(comment) {
  const article = document.createElement("article");
  article.classList.add("commentKart");

  const fiveStar = document.createElement("div");
  fiveStar.classList.add("UnelgeeFiveStar");
  fiveStar.innerHTML = `
      <svg data-value="1" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <svg data-value="2" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <svg data-value="3" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <svg data-value="4" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <svg data-value="5" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    `;

  if (comment.rating) {
    fiveStar.querySelectorAll("svg").forEach((star, index) => {
      if (index < comment.rating) {
        star.classList.add("filled");
      } else {
        star.classList.remove("filled");
      }
    });
  }

  const commentText = document.createElement("p");
  commentText.classList.add("commentText");
  commentText.textContent = comment.text;

  const meta = document.createElement("p");
  meta.classList.add("commentMeta");
  meta.textContent = comment.createdAt || "";

  article.appendChild(fiveStar);
  article.appendChild(commentText);
  article.appendChild(meta);

  return article;
}