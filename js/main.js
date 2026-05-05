import APIGateway from "./gateway/apiGateway.js";
function updateHeaderAuthStatus() {
  const loggedUser = APIGateway.getCurrentUser();
  const logInContainer = document.getElementById("log-in");

  if (!logInContainer) {
    return;
  }

  logInContainer.innerHTML = "";

  if (loggedUser) {
    const profileBtn = document.createElement("a");
    profileBtn.href = APIGateway.getRedirectRoute(loggedUser);
    const buttonLabel = APIGateway.isAdmin(loggedUser) ? "Хянах самбар" : (loggedUser.Name || loggedUser.Email || loggedUser.email);
    profileBtn.innerHTML = `<button id="profile-button">${buttonLabel}</button>`;
    logInContainer.appendChild(profileBtn);
    return;
  }

  const loginLink = document.createElement("a");
  loginLink.href = "/UI/logIn.html#login";
  loginLink.innerHTML = `<button id="ehni-button">Нэвтрэх</button>`;

  const registerLink = document.createElement("a");
  registerLink.href = "/UI/logIn.html#register";
  registerLink.innerHTML = `<button id="udaah-button">Бүртгүүлэх</button>`;

  logInContainer.appendChild(loginLink);
  logInContainer.appendChild(registerLink);
}

function setActiveNavigation() {
  const currentUrl = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("header nav a, .mobile-bottom-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkFile = href.split("/").pop();
    const isActive = linkFile === currentUrl;
    link.classList.toggle("active", isActive);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuthStatus();
  setActiveNavigation();
});