import { showNotification } from "../utils.js";
import user from "../domain/models/user.js"
import AuthService from "../domain/services/AuthenticationService.js";
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const User_register_key="isRegisted";
    const loggedUser_key="LoggedIn";
    // localStorage.clear()
    // Нэвтрэх үйлдэл
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Хуудас рефреш хийгдэхийг зогсоох
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            // Энд Backend рүү fetch() ашиглан хүсэлт илгээнэ. Одоогоор дуурайлгаж хийе:
            if(email && password) {
                const loginFormInfo ={
                    Email:email,
                    Password:password,
                }
                if(AuthService.logCheck(loginFormInfo)){
                    throw showNotification("Амжилттай нэвтэрлээ!","success");
                    loginForm.reset();
                    window.location.href = "profile.html"; 
                }
                else{
                    showNotification("Email эсвэл password буруу байна","error");
                    loginForm.reset();
                }
                
            }
        });
    }

    // ─────────────────────────────────────────
    // БҮРТГҮҮЛЭХ форм
    // ─────────────────────────────────────────
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const pet = document.getElementById('regPet').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            // Бааз руу хадгалах логик энд бичигдэнэ
            console.log("Шинэ хэрэглэгч:", { name, pet, email, password });
            const registedUserInfo={
                Name:name,
                Pet:pet,
                Email:email,
                Pass:password
            }
            let AllUserData =JSON.parse(localStorage.getItem(User_register_key));
            if(!Array.isArray(AllUserData))AllUserData=[AllUserData];

            AllUserData.push(registedUserInfo);
            localStorage.setItem(User_register_key,JSON.stringify(AllUserData));
            
            showNotification("Амжилттай бүртгэгдлээ! Одоо имэйл болон нууц үгээрээ нэвтэрнэ үү.","success");
            
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