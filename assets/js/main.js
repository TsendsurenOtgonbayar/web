import { addStarColor } from "./utils.js";
import AuthService from "./domain/services/AuthenticationService.js";
import { createCommentCard } from "./components/commentsComp.js";
import {
  addComment,
  getRecentComments,
  validateCommentInput,
} from "./domain/services/commentService.js";

function updateHeaderAuthStatus() {
  const loggedUser = AuthService.getCurrentUser();
  const logInContainer = document.getElementById("log-in");

  if (!logInContainer) {
    return;
  }

  logInContainer.innerHTML = "";

  if (loggedUser) {
    const profileBtn = document.createElement("a");
    profileBtn.href = "profile.html";
    profileBtn.innerHTML = `<button id="profile-button">${loggedUser.Name || loggedUser.Email}</button>`;
    logInContainer.appendChild(profileBtn);
    return;
  }

  const loginLink = document.createElement("a");
  loginLink.href = "logIn.html";
  loginLink.innerHTML = `<button id="ehni-button">Нэвтрэх</button>`;

  const registerLink = document.createElement("a");
  registerLink.href = "logIn.html";
  registerLink.innerHTML = `<button id="udaah-button">Бүртгүүлэх</button>`;

  logInContainer.appendChild(loginLink);
  logInContainer.appendChild(registerLink);
}

function setActiveNavigation() {
  const currentUrl = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("header nav a, .mobile-bottom-nav a");

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === currentUrl;
    link.classList.toggle("active", isActive);
  });
}

function checkAuthAndRedirect() {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser) {
    return true;
  }

  window.location.href = "logIn.html";
  return false;
}

function resolveAuthorName(currentUser) {
  return currentUser?.Name || currentUser?.name || currentUser?.Email || "Тодорхойгүй";
}

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
      if (!checkAuthAndRedirect()) {
        return;
      }
      const isHidden = getComputedStyle(makeComment).display === "none";
      makeComment.style.display = isHidden ? "flex" : "none";
    });
  }

  if (sendButton && commentTextarea && makeComment) {
    sendButton.addEventListener("click", () => {
      if (!checkAuthAndRedirect()) {
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
  updateHeaderAuthStatus();
  setActiveNavigation();
  initCommentsSection();
});