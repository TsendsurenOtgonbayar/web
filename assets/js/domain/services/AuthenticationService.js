//ene file dotor tanin batalgaajulah logiciig bichne
import { showNotification } from "../../utils.js";
import User from "../models/user.js"
//const serverURL="";//fetch hiihed heregleh url
class AuthService{
    static validateEmail(email) {//ene baij boln✅
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static validatePassword(password) {//ene baij bolnу✅
        if (password.length < 8) {
            return { valid: false, message: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой" };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: "Нууц үг томоохон үсэг агуулсан байх ёстой" };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: "Нууц үг тоо агуулсан байх ёстой" };
        }
        return { valid: true, message: "Нууц үг сайн байна" };
    }
    static validateLoginInput(loginOBJ) {//ene baij boln✅
        if (!loginOBJ.Email || !loginOBJ.Password) {
            return { valid: false, error: "Имэйл болон нууц үг оруулна уу" };
        }
        if (!this.validateEmail(loginOBJ.Email)) {
            return { valid: false, error: "Имэйлийн формат буруу байна" };
        }
        const passwordValidation = this.validatePassword(loginOBJ.Password);
        if (!passwordValidation.valid) {
            return { valid: false, error: passwordValidation.message };
        }
        return { valid: true, error: null };
    }

    static async logCheck(loginOBJ) {
        try {
            // 1. Input validation
            const validation = this.validateLoginInput(loginOBJ);
            if (!validation.valid) {
                showNotification(validation.error, "error");
                return false;
            }
            // 2. Хэрэв backend URL-н байвал fetch хийх
            // if (!serverURL) {
            //     console.warn("Backend URL тохируулагдаагүй байна. Дуурайлгын өгөгдөл ашигладаг.");
            //     // Дуурайлгын өгөгдөл - локал testing-д ашигла
            //     const mockUser = {
            //         Email: "bat@gmail.com",
            //         Password: "Password123"
            //     };
            //     if (loginOBJ.Email === mockUser.Email && loginOBJ.Password === mockUser.Password) {
            //         const userData = {
            //             Name: "А.Бат",
            //             Email: mockUser.Email,
            //             id: Math.random()
            //         };
            //         localStorage.setItem("LoggedIn", JSON.stringify(userData));
            //         showNotification("Амжилттай нэвтэрлээ!", "success");
            //         return true;
            //     } else {
            //         showNotification("Email эсвэл password буруу байна", "error");
            //         return false;
            //     }
            // }
            const response = await fetch(serverURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginOBJ.Email,
                    password: loginOBJ.Password
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP алдаа: ${response.status} ${response.statusText}`);
            }

            // 5. JSON-д задлах
            const data = await response.json();

            // 6. Success эсэхийг шалгах
            if (data.success) {
                // Token хадгалах
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("LoggedIn", JSON.stringify(data.user));
                    showNotification("Амжилттай нэвтэрлээ!", "success");
                }
                return true;
            } else {
                showNotification(data.message || "Email эсвэл password буруу байна", "error");
                return false;
            }

        } catch (error) {
            console.error("Нэвтрэх алдаа:", error);
            
            // Network алдаа эсэхийг шалгах
            if (error instanceof TypeError) {
                showNotification("Интернет холболтоо шалгана уу", "error");
            } else {
                showNotification(`Системийн алдаа: ${error.message}`, "error");
            }
            return false;
        }
    }
    static enrollUser(enrollOBJ) {
        try {
            // 1. Input validation
            if (!enrollOBJ.Email || !enrollOBJ.Password) {
                return {
                    success: false,
                    message: "Имэйл болон нууц үг оруулна уу"
                };
            }

            if (!this.validateEmail(enrollOBJ.Email)) {
                return {
                    success: false,
                    message: "Имэйлийн формат буруу байна"
                };
            }

            const passwordValidation = this.validatePassword(enrollOBJ.Password);
            if (!passwordValidation.valid) {
                return {
                    success: false,
                    message: passwordValidation.message
                };
            }

            // 2. Бүртгүүлэх өгөгдөл шалгах (эхлээд байгаа эсэх)
            const registeredUsers = JSON.parse(localStorage.getItem("isRegisted")) || [];
            
            // Email дүнхэй байгаа эсэх шалгах
            const emailExists = registeredUsers.some(user => user.Email === enrollOBJ.Email);
            if (emailExists) {
                return {
                    success: false,
                    message: "Энэ имэйл дээр аль хэдийн бүртгэгдсэн байна"
                };
            }

            // 3. Шинэ хэрэглэгч объект үүсгэх
            const newUser = {
                id: Math.random(),
                Name: enrollOBJ.Name,
                Email: enrollOBJ.Email,
                Pass: enrollOBJ.Password, // ⚠️ TODO: Хэмжээллэх хэрэгтэй!
                Pet: enrollOBJ.Pet || "",
                createdAt: new Date().toISOString()
            };

            // 4. Массивт нэмэх
            registeredUsers.push(newUser);
            localStorage.setItem("isRegisted", JSON.stringify(registeredUsers));

            return {
                success: true,
                message: "Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.",
                user: newUser
            };

        } catch (error) {
            console.error("Бүртгүүлэлтийн алдаа:", error);
            return {
                success: false,
                message: "Системийн алдаа гарлаа"
            };
        }
    }

    /**
     * Хэрэглэгч гараа (Logout)
     */
    static logout() {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("LoggedIn");
            showNotification("Системээс гарлаа", "success");
            return true;
        } catch (error) {
            console.error("Logout алдаа:", error);
            return false;
        }
    }

    /**
     * Одоогийн нэвтэрсэн хэрэглэгчийн мэдээлэл авах
     * @returns {object|null} - Хэрэглэгчийн өгөгдөл эсвэл null
     */
    static getCurrentUser() {
        try {
            const user = localStorage.getItem("LoggedIn");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("getCurrentUser алдаа:", error);
            return null;
        }
    }
    static getToken() {
        return localStorage.getItem("token") || null;
    }
}
export default AuthService;