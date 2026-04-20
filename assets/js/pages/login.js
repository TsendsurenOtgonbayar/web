import { showNotification } from "../utils.js";
import AuthService from "../domain/services/AuthenticationService.js";

// AuthService-ийн нэг жишээ үүсгэнэ
const authService = new AuthService();

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // ─────────────────────────────────────────
    // НЭВТРЭХ форм
    // ─────────────────────────────────────────
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Хуудас дахин ачаалагдахаас сэргийлнэ

            const email    = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            // AuthService-ээр нэвтрүүлнэ
            const result = authService.login(email, password);

            if (result.ok) {
                showNotification("Амжилттай нэвтэрлээ!", "success");
                loginForm.reset();
                window.location.href = "profile.html"; // Профайл руу шилжинэ
            } else {
                showNotification(result.message, "error");
                loginForm.reset();
            }
        });
    }

    // ─────────────────────────────────────────
    // БҮРТГҮҮЛЭХ форм
    // ─────────────────────────────────────────
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name     = document.getElementById("regName").value.trim();
            const pet      = document.getElementById("regPet").value.trim();
            const email    = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value.trim();

            // AuthService-ээр бүртгүүлнэ
            const result = authService.register(name, pet, email, password);

            if (result.ok) {
                showNotification("Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.", "success");
                registerForm.reset();
                switchTab("login"); // Нэвтрэх таб руу шилжинэ
            } else {
                showNotification(result.message, "error");
            }
        });
    }
});

// ─────────────────────────────────────────
// ТАБ СОЛИХ — HTML дахь onclick="switchTab(...)" дуудна
// ─────────────────────────────────────────
window.switchTab = function (tabName) {
    document.getElementById("tab-login").classList.remove("active");
    document.getElementById("tab-register").classList.remove("active");

    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.remove("active");

    if (tabName === "login") {
        document.getElementById("tab-login").classList.add("active");
        document.getElementById("loginForm").classList.add("active");
        window.location.hash = "login";
    } else {
        document.getElementById("tab-register").classList.add("active");
        document.getElementById("registerForm").classList.add("active");
        window.location.hash = "register";
    }
};