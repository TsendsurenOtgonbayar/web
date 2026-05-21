import APIGateway from "../gateway/apiGateway.js";
import "../web-component/wc-header.js";
import "../web-component/wc-footer.js";
import "../web-component/wc-mobile-Nav.js";
import "../web-component/wc-comment.js";
import homePage from "./homePage/homePage.js";
import aboutUsPage from "./aboutUsPage/aboutUsPage.js";
import serviceRender from "./servicePage/serviceRender.js";
import bookingPage from "./bookingPage/bookingPag.js";
import contactPage from "./contactPage/contactPage.js";
import renderLoginPage  from "./login/renderLoginPage.js";
const app = document.querySelector('#app');
function delMemoryIframe() {
    const iframe = document.querySelector('iframe');
    if(iframe){
        iframe.src='about:blank';
        iframe.remove();
    }
}
function router() {
    const hash = window.location.hash || '#home'; 
    console.log('Current hash:', hash); 
    switch(hash) {
        case '#home':
            delMemoryIframe();
            app.innerHTML = homePage();
            break;
        case '#aboutUs':
            delMemoryIframe();  
            app.innerHTML = aboutUsPage();
            break;
        case '#service':
            delMemoryIframe();
            app.innerHTML = serviceRender();
            break;
        case '#booking':
            delMemoryIframe();
            app.innerHTML = bookingPage();
            break;
        case '#contact':
            app.innerHTML = contactPage();
            break;
        case '#login':
            app.innerHTML = renderLoginPage();
            break;
        default:
            app.innerHTML = "<h1>404 Олдсонгүй</h1>";
    }
}

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

// function setActiveNavigation() {
//   const currentUrl = window.location.pathname.split("/").pop();
//   const navLinks = document.querySelectorAll("header nav a, .mobile-bottom-nav a");

//   navLinks.forEach((link) => {
//     const href = link.getAttribute("href") || "";
//     const linkFile = href.split("/").pop();
//     const isActive = linkFile === currentUrl;
//     link.classList.toggle("active", isActive);
//   });
// }

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuthStatus();
  router();
});