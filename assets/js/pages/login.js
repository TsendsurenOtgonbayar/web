import { showNotification } from "../utils.js";
import AuthService from "../domain/services/AuthenticationService.js";
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    // НЭВТРЭХ ФОРМ
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Form доторх элементүүдийг авах
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            // Input validation
            if (!email || !password) {
                showNotification("Имэйл болон нууц үг оруулна уу", "error");
                return;
            }

            // AuthService-г дуудаж нэвтрэх
            const result = await AuthService.logCheck({
                Email: email,
                Password: password
            });

            // Нэвтрэлт амжилттай эсэхийг шалгах
            if (result) {
                // Form цэвэрлэх
                loginForm.reset();
                window.location.href="profile.html"
                // Профайл хуудас руу шилжүүлэх
                // setTimeout(() => {
                //     window.location.href = "profile.html";
                // }, 1500); // 1.5 сек хүлээж үзүүлэх (notification бүтээгүй болгохын тулд)
            } else {
                // Нэвтрэлт амжилтгүй - form цэвэрлэх
                loginForm.reset();
            }
        });
    }
    // БҮРТГҮҮЛЭХ ФОРМ
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Form доторх элементүүдийг авах
            const name = document.getElementById('regName').value.trim();
            const pet = document.getElementById('regPet').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            // Нэмэлт input validation
            if (!name || !pet || !email || !password) {
                showNotification("Бүх талбарыг өглөх хэрэгтэй", "error");
                return;
            }

            // AuthService-ийн enrollUser методыг дуудаж бүртгүүлэх
            const enrollResult = AuthService.enrollUser({
                Name: name,
                Pet: pet,
                Email: email,
                Password: password
            });

            // Бүртгүүлэлтийн үр дүнг шалгах
            if (enrollResult.success) {
                showNotification(enrollResult.message, "success");
                
                // Form цэвэрлэх
                registerForm.reset();
                
                // Нэвтрэх таб руу шилжүүлэх
                setTimeout(() => {
                    switchTab('login');
                }, 1500);
            } else {
                showNotification(enrollResult.message, "error");
                // Формыг цэвэрлэхгүй үлдээх (хэрэглэгч засахын тулд)
            }
        });
    }

    // ────────────────────────────────────────
    // ТАБ СОЛИХ ФУНКЦ
    // ────────────────────────────────────────
    window.switchTab = function(tabName) {
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const loginFormEl = document.getElementById('loginForm');
        const registerFormEl = document.getElementById('registerForm');

        // Бүх tab-ыг идэвхигүй болгох
        if (tabLogin) tabLogin.classList.remove('active');
        if (tabRegister) tabRegister.classList.remove('active');
        if (loginFormEl) loginFormEl.classList.remove('active');
        if (registerFormEl) registerFormEl.classList.remove('active');

        // Сонгосон tab-ыг идэвхижүүлэх
        if (tabName === 'login') {
            if (tabLogin) tabLogin.classList.add('active');
            if (loginFormEl) loginFormEl.classList.add('active');
            window.location.hash = 'login';
        } else if (tabName === 'register') {
            if (tabRegister) tabRegister.classList.add('active');
            if (registerFormEl) registerFormEl.classList.add('active');
            window.location.hash = 'register';
        }
    };
    // URL HASH-ээр ТАБ СОНГОХ (опционал)
    function initializeTabFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash === 'register') {
            switchTab('register');
        } else {
            switchTab('login');
        }
    }

    // Хуудас ачаалахад tab инициализ хийх
    initializeTabFromHash();

    // Hash өөрчлөгдөхөд tab сонгох
    window.addEventListener('hashchange', () => {
        initializeTabFromHash();
    });

    // FORM VALIDATION - Real-time
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const regNameInput = document.getElementById('regName');
    const regPetInput = document.getElementById('regPet');
    const regEmailInput = document.getElementById('regEmail');
    const regPasswordInput = document.getElementById('regPassword');

    // Email validation (Real-time)
    if (loginEmailInput) {
        loginEmailInput.addEventListener('blur', () => {
            const email = loginEmailInput.value.trim();
            if (email && !AuthService.validateEmail(email)) {
                loginEmailInput.style.borderColor = '#ff4757';
                showNotification("Имэйлийн формат буруу байна", "error");
            } else {
                loginEmailInput.style.borderColor = '';
            }
        });
    }

    if (regEmailInput) {
        regEmailInput.addEventListener('blur', () => {
            const email = regEmailInput.value.trim();
            if (email && !AuthService.validateEmail(email)) {
                regEmailInput.style.borderColor = '#ff4757';
                showNotification("Имэйлийн формат буруу байна", "error");
            } else {
                regEmailInput.style.borderColor = '';
            }
        });
    }

    // Password validation (Real-time)
    if (regPasswordInput) {
        regPasswordInput.addEventListener('blur', () => {
            const password = regPasswordInput.value;
            if (password) {
                const validation = AuthService.validatePassword(password);
                if (!validation.valid) {
                    regPasswordInput.style.borderColor = '#ff4757';
                    showNotification(validation.message, "error");
                } else {
                    regPasswordInput.style.borderColor = '#2ed573';
                    showNotification("Нууц үг сайн байна ✓", "success");
                }
            }
        });
    }

    // ХЭРЭГЛЭГЧ АЛЬ ХЭДИЙН НЭВТЭРСЭН ЭСЭ ШАЛГАХ
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
        // Хэрэглэгч аль хэдийн нэвтэрсэн бол профайл хуудас руу шилжүүлэх
        showNotification(`Сайн байна уу, ${currentUser.Name}!`, "success");
        setTimeout(() => {
            window.location.href = "profile.html";
        }, 1000);
    }
});