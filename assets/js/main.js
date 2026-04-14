import { delElm, addStarColor,isUserLoggedIn,checkAuthAndRedirect  } from "./utils.js";

const COMMENTS_KEY = "petcare_comments";
const loggedUser_key = "LoggedIn";
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("Main JS ажиллаж байна...");
  function updateHeaderAuthStatus() {
    const loggedUser = JSON.parse(localStorage.getItem(loggedUser_key)) || null;
    const logInContainer = document.getElementById("log-in");

    if (!logInContainer) return;

    // Хуучин товчн��удыг устгах
    logInContainer.innerHTML = "";

    if (loggedUser) {
      const profileBtn = document.createElement("a");
      profileBtn.href = "profile.html";
      profileBtn.innerHTML = `<button id="profile-button">${loggedUser.Name || loggedUser.Email}</button>`;
      logInContainer.appendChild(profileBtn);
    } else {
      const loginLink = document.createElement("a");
      loginLink.href = "logIn.html";
      loginLink.innerHTML = `<button id="ehni-button">Нэвтрэх</button>`;
      const registerLink = document.createElement("a");
      registerLink.href = "logIn.html";
      registerLink.innerHTML = `<button id="udaah-button">Бүртгүүлэх</button>`;
      logInContainer.appendChild(loginLink);
      logInContainer.appendChild(registerLink);
    }
  }
  updateHeaderAuthStatus();
  // -----------------------------
  // 1. NAV ACTIVE STATE
  // -----------------------------
  const currentUrl = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("header nav a, .mobile-bottom-nav a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // -----------------------------
  // 2. COMMENT + LOCALSTORAGE
  // -----------------------------
  const commentRow = document.getElementById("commentRow");
  const makeComment = document.getElementById("makeComments");
  const commentButton = document.getElementById("CommentButton");
  const commentTextarea = document.getElementById("commenText");
  const sendButton = document.getElementById("sentButton");

  // Comment form-ыг анх нууцалж эхэлнэ
  if (makeComment) {
    makeComment.style.display = "none";
  }

  // localStorage-оос сэтгэгдлүүдийг унших
  function loadCommentsFromStorage() {
    const saved = localStorage.getItem(COMMENTS_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Сэтгэгдэл parse хийхэд алдаа гарлаа:", e);
      return [];
    }
  }

  // localStorage-д сэтгэгдлүүдийг хадгалах
  function saveCommentsToStorage(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }

  // Нэг сэтгэгдлийн карт үүсгэх
  function createCommentCard(comment) {
    const article = document.createElement("article");
    article.classList.add("commentKart");

    // Rating однууд
    const fiveStar = document.createElement("div");
    // Class-ийг id биш, class болгон ашиглаж байна (олон картанд давтагдаж болно)
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

    // Хэрвээ rating хадгалагдсан байвал rating хүртэл нь .filled class өгнө
    if (comment.rating) {
      const stars = fiveStar.querySelectorAll("svg");
      stars.forEach((s, i) => {
        if (i < comment.rating) {
          s.classList.add("filled");
        } else {
          s.classList.remove("filled");
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

  // Бүх (эсвэл сүүлийн 10) сэтгэгдлийг дэлгэц дээр зурах
  function renderAllComments() {
    if (!commentRow) return;
    const comments = loadCommentsFromStorage();
    // Хэрвээ зөвхөн сүүлийн 10-г харуулах бол дараах мөрийг ашиглаж болно:
    const last10 = comments.slice(-10);
    const list = last10;
    // const list = comments;

    commentRow.innerHTML = "";
    list.forEach((c) => {
      const card = createCommentCard(c);
      commentRow.appendChild(card);
    });
  }

  // -----------------------------
  // 4. RATING (ОД) – FORM ДЭЭР
  // -----------------------------
  let currentRating = 0;
  const ratingContainer = document.querySelector("#makeComments>.UnelgeeFiveStar");

  if (ratingContainer) {
    // Энэ selector нь зөвхөн form доторх rating-ийн однууд дээр ажиллана
    addStarColor(".UnelgeeFiveStar svg", (rating) => {
      currentRating = rating; // хэрэглэгчийн сонгосон одны тоо
    });
  }

  // "Сэтгэгдэл үлдээх" товч – form-ыг нээх/хаах
  if (commentButton && makeComment) {
    commentButton.addEventListener("click", () => {
      if(!checkAuthAndRedirect())return;
      const isHidden =
        makeComment.style.display === "none" ||
        getComputedStyle(makeComment).display === "none";

      makeComment.style.display = isHidden ? "flex" : "none";
    });
  }

  // "Илгээх" товч – шинэ сэтгэгдэл үүсгээд LocalStorage-д хадгалах
  if (sendButton && commentTextarea && commentRow) {
    sendButton.addEventListener("click", () => {
      if (!checkAuthAndRedirect()) {
        return;
      }
      const text = commentTextarea.value.trim();
      if (text.length < 5) {
        alert("Сэтгэгдэл хамгийн багадаа 5 тэмдэгт байх ёстой.");
        return;
      }
      if (currentRating === 0) {
        alert("Та одоор үнэлгээ өгнө үү.");
        return;
      }

      const comments = loadCommentsFromStorage();
      const newComment = {
        text,
        createdAt: new Date().toLocaleString(),
        rating: currentRating,
      };
      comments.push(newComment);
      saveCommentsToStorage(comments);

      // Хэрвээ 10-аас дээш болсон бол хамгийн эхнийхийг устгана (сонголтоор)
      delElm("#commentRow", ".commentKart");

      renderAllComments();

      // form reset
      commentTextarea.value = "";
      currentRating = 0;
      // Form доторх однуудын өнгийг цайруулъя
      if (ratingContainer) {
        const formStars = ratingContainer.querySelectorAll("svg");
        formStars.forEach((s) => s.classList.remove("filled"));
      }
      makeComment.style.display = "none";
    });
  }

  // Хуудас ачаалахад хадгалсан сэтгэгдлүүдийг харуулна
  renderAllComments();
});