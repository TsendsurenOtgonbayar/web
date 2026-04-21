import { showNotification } from "../utils.js";
import AuthService from "../domain/services/AuthenticationService.js";

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

        const result = await AuthService.logCheck({
            Email: email,
            Password: password
        });

        loginForm.reset();
        if (result) {
            window.location.href = "profile.html";
        }
        else{
            showNotification("Имэйл эсвэл нууц үг буруу байна", "error");
        }
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
        const enrollResult = await AuthService.enrollUser({
            LastName: lastName,
            FirstName: firstName,
            Email: email,
            Password: password
        });
        if (!enrollResult.success) {
            showNotification(enrollResult.message, "error");
            return;
        }
        showNotification(enrollResult.message, "success");
        registerForm.reset();
        setTimeout(() => {
            setTabState('login');
        }, 1500);
    });
}
function redirectIfAlreadyLoggedIn() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        return;
    }
    showNotification(`Сайн байна уу, ${currentUser.Name}!`, "success");
    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1000);
}
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    setupLoginForm(loginForm);
    setupRegisterForm(registerForm);
    setupTabNavigation();
    // setupRealtimeValidation();
    redirectIfAlreadyLoggedIn();
});