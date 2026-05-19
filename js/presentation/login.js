import { showNotification } from "../utils.js";
import APIGateway from "../gateway/apiGateway.js";

function setTabState(tabName) {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginFormEl = document.getElementById('loginForm');
    const registerFormEl = document.getElementById('registerForm');

    if (tabLogin) tabLogin.classList.remove('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (loginFormEl) loginFormEl.classList.remove('active');
    if (registerFormEl) registerFormEl.classList.remove('active');

    if (tabName === 'register') {
        if (tabRegister) tabRegister.classList.add('active');
        if (registerFormEl) registerFormEl.classList.add('active');
        window.location.hash = 'register';
        return;
    }

    if (tabLogin) tabLogin.classList.add('active');
    if (loginFormEl) loginFormEl.classList.add('active');
    window.location.hash = 'login';
}

function setupTabNavigation() {
    window.switchTab = function(tabName) {
        setTabState(tabName);
    };

    const initializeTabFromHash = () => {
        const hash = window.location.hash.substring(1);
        setTabState(hash === 'register' ? 'register' : 'login');
    };

    initializeTabFromHash();
    window.addEventListener('hashchange', initializeTabFromHash);
}

function setupLoginForm(loginForm) {
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            showNotification("Имэйл болон нууц үг оруулна уу", "error");
            return;
        }

        const result = await APIGateway.login(email, password);
        loginForm.reset();

        if (result.success) {
            window.location.href = APIGateway.getRedirectRoute(result.user);
            return;
        }

        showNotification(result.error || "Нэвтрэхэд алдаа гарлаа", "error");
    });
}

function setupRegisterForm(registerForm) {
    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const lastName = document.getElementById('regLastName').value.trim();
        const firstName = document.getElementById('regFirstName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();

        if (!lastName || !firstName || !email || !password) {
            showNotification("Бүх талбарыг бөглөх хэрэгтэй", "error");
            return;
        }

        const enrollResult = await APIGateway.register({
            lastName,
            firstName,
            email,
            password
        });

        if (!enrollResult.success) {
            showNotification(enrollResult.error || "Бүртгэл үүсгэхэд алдаа гарлаа", "error");
            return;
        }

        showNotification("Бүртгэл амжилттай үүслээ", "success");
        registerForm.reset();
        setTimeout(() => {
            setTabState('login');
        }, 1500);
    });
}

async function redirectIfAlreadyLoggedIn() {
    const currentUser = await APIGateway.getCurrentUser();
    if (!currentUser) {
        return;
    }

    showNotification(`Сайн байна уу, ${currentUser.Name || currentUser.name}!`, "success");
    setTimeout(() => {
        window.location.href = APIGateway.getRedirectRoute(currentUser);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    setupLoginForm(loginForm);
    setupRegisterForm(registerForm);
    setupTabNavigation();
    redirectIfAlreadyLoggedIn();
});