import { loginUser, registerUser } from "../domain/services/AuthenticationService.js";
import { showNotification } from "../domain/services/uiService.js";
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    // Нэвтрэх үйлдэл
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Хуудас рефреш хийгдэхийг зогсоох
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) return;

            const result = loginUser(email, password);
            if (!result.ok) {
                showNotification(result.message, "error");
                loginForm.reset();
                return;
            }

            showNotification("Амжилттай нэвтэрлээ!", "success");
            loginForm.reset();
            window.location.href = "profile.html";
        });
    }

    // Бүртгүүлэх үйлдэл
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const pet = document.getElementById('regPet').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            const result = registerUser({ name, pet, email, password });

            if (!result.ok) {
                showNotification(result.message, "error");
                return;
            }

            showNotification("Амжилттай бүртгэгдлээ!", "success");
            registerForm.reset();
            switchTab('login');
        });
    }
});
// 1. Таб солих функц (HTML дээрх onclick="switchTab(...)" товчнууд ажиллахын тулд)
window.switchTab = function(tabName) {
    // Табуудын active классыг солих
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-register').classList.remove('active');
    
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.remove('active');

    if (tabName === 'login') {
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
        window.location.hash = 'login';
    } else {
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
        window.location.hash = 'register';
    }
};