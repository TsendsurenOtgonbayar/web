import AuthService from "./domain/services/AuthenticationService.js";
import { showNotification } from "./utils.js";
function updateHeaderAuthStatus() {
  const loggedUser = AuthService.getCurrentUser();
  const logInContainer = document.getElementById("log-in");

  if (!logInContainer) {
    return;
  }

  logInContainer.innerHTML = "";

  if (loggedUser) {
    const profileBtn = document.createElement("a");
    profileBtn.href = AuthService.getRedirectRoute(loggedUser);
    const buttonLabel = AuthService.isAdmin(loggedUser) ? "Хянах самбар" : (loggedUser.Name || loggedUser.Email);
    profileBtn.innerHTML = `<button id="profile-button">${buttonLabel}</button>`;
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
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuthStatus();
  setActiveNavigation();
});