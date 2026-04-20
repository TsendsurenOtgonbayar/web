// Энэ файл дотор нэвтрэх / бүртгүүлэх / гарах бүх логик байна
import User from "../models/user.js";

// localStorage дотор хэрэглэгчдийн жагсаалт болон нэвтэрсэн хэрэглэгчийг
// хадгалахдаа ашиглах түлхүүрүүд
const USERS_KEY = "isRegisted";
const LOGGED_IN_KEY = "LoggedIn";

class AuthService {
    // ---------------------------------------------------------
    // Бүртгүүлэх
    // name   : хэрэглэгчийн нэр
    // pet    : тэжээвэр амьтны мэдээлэл
    // email  : имэйл хаяг
    // password: нууц үг
    // буцаах утга: { ok: true } эсвэл { ok: false, message: "..." }
    // ---------------------------------------------------------
    register(name, pet, email, password) {
        // Бүртгэлтэй бүх хэрэглэгчдийг уншина
        const allUsers = this._getAllUsers();

        // Ижил имэйл бүртгэлтэй эсэхийг шалгана
        const exists = allUsers.find(u => u.Email === email);
        if (exists) {
            return { ok: false, message: "Энэ имэйл хаяг аль хэдийн бүртгэлтэй байна." };
        }

        // Шинэ хэрэглэгчийн объект
        const newUser = {
            Id: Date.now(),       // давтагдашгүй ID
            Name: name,
            Pet: pet,
            Email: email,
            Pass: password,
        };

        // Жагсаалтад нэмж LocalStorage-д хадгална
        allUsers.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));

        return { ok: true };
    }

    // ---------------------------------------------------------
    // Нэвтрэх
    // email    : имэйл хаяг
    // password : нууц үг
    // буцаах утга: { ok: true, user: {...} } эсвэл { ok: false, message: "..." }
    // ---------------------------------------------------------
    login(email, password) {
        const allUsers = this._getAllUsers();

        // Имэйл болон нууц үгийг тулган шалгана
        const found = allUsers.find(
            u => u.Email === email && u.Pass === password
        );

        if (!found) {
            return { ok: false, message: "Имэйл эсвэл нууц үг буруу байна." };
        }

        // Нэвтэрсэн хэрэглэгчийг LocalStorage-д хадгална
        localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(found));

        return { ok: true, user: found };
    }

    // ---------------------------------------------------------
    // Гарах (Logout)
    // ---------------------------------------------------------
    logout() {
        localStorage.removeItem(LOGGED_IN_KEY);
    }

    // ---------------------------------------------------------
    // Нэвтэрсэн эсэхийг шалгах
    // буцаах утга: true / false
    // ---------------------------------------------------------
    isLoggedIn() {
        return localStorage.getItem(LOGGED_IN_KEY) !== null;
    }

    // ---------------------------------------------------------
    // Одоогийн нэвтэрсэн хэрэглэгчийг авах
    // буцаах утга: хэрэглэгчийн объект эсвэл null
    // ---------------------------------------------------------
    getCurrentUser() {
        const raw = localStorage.getItem(LOGGED_IN_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    // ---------------------------------------------------------
    // Дотоод туслах функц: бүртгэлтэй хэрэглэгчдийн жагсаалт авах
    // ---------------------------------------------------------
    _getAllUsers() {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return [];          // LocalStorage хоосон → хоосон массив
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
}

export default AuthService;