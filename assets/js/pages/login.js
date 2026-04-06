document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Нэвтрэх үйлдэл
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Хуудас рефреш хийгдэхийг зогсоох
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Энд Backend рүү fetch() ашиглан хүсэлт илгээнэ. Одоогоор дуурайлгаж хийе:
            if(email && password) {
                // Хэрэглэгч нэвтэрсэн гэдгийг LocalStorage-д түр хадгалах
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", email);
                
                alert("Амжилттай нэвтэрлээ!");
                window.location.href = "profile.html"; // Профайл хуудас руу шилжүүлэх
            }
        });
    }

    // Бүртгүүлэх үйлдэл
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const pet = document.getElementById('regPet').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            // Бааз руу хадгалах логик энд бичигдэнэ
            console.log("Шинэ хэрэглэгч:", { name, pet, email, password });
            
            alert("Амжилттай бүртгэгдлээ! Одоо имэйл болон нууц үгээрээ нэвтэрнэ үү.");
            
            // Формыг цэвэрлээд Нэвтрэх таб руу шилжих
            registerForm.reset();
            switchTab('login'); // logIn.html доторх функцийг дуудах
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

// 2. Хуудас ачаалж дууссаны дараа ажиллах хэсэг
document.addEventListener("DOMContentLoaded", () => {
    
    // Хэрэв URL нь #register гэж орж ирвэл шууд бүртгүүлэх табыг нээх
    if (window.location.hash === '#register') {
        switchTab('register');
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // НЭВТРЭХ үйлдэл
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Хуудас рефреш хийгдэхийг зогсоох
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if(email && password) {
                // Хэрэглэгч нэвтэрсэн гэдгийг хөтөчийн санах ойд (LocalStorage) түр хадгалах
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", email);
                
                alert("Амжилттай нэвтэрлээ!");
                window.location.href = "profile.html"; // Профайл руу үсрэх
            }
        });
    }

    // БҮРТГҮҮЛЭХ үйлдэл
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Бааз руу хадгалах логик энд бичигдэнэ (Одоогоор зүгээр alert харуулна)
            alert("Амжилттай бүртгэгдлээ! Одоо имэйл болон нууц үгээрээ нэвтэрнэ үү.");
            
            // Формыг хоосолж цэвэрлээд Нэвтрэх таб руу шилжих
            registerForm.reset();
            switchTab('login'); 
        });
    }
});