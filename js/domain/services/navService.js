import { getLoggedInUser } from "./storageService.js";

export function updateHeaderAuthStatus() {
  const loggedUser = getLoggedInUser();
  const logInContainer = document.getElementById("log-in");

  if (!logInContainer) return;

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

export function setActiveNavLinks() {
  const currentUrl = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("header nav a, .mobile-bottom-nav a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}