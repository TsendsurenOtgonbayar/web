import { showNotification } from "../../utils.js";
import { authenticateTestCredentials, TEST_LOGIN_USERS } from "./mockAuthProvider.js";

const REGISTERED_USERS_KEY = "isRegisted";
const LOGGED_IN_KEY = "LoggedIn";
const TOKEN_KEY = "token";
const CACHE_TTL_MS = 5 * 60 * 1000;

class AuthService {
    static cachedRemoteUsers = null;
    static lastFetchedAt = 0;

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
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

    static validateLoginInput(loginOBJ) {
        if (!loginOBJ.Email || !loginOBJ.Password) {
            return { valid: false, error: "Имэйл болон нууц үг оруулна уу" };
        }
        if (!this.validateEmail(loginOBJ.Email)) {
            return { valid: false, error: "Имэйлийн формат буруу байна" };
        }
        return { valid: true, error: null };
    }

    static normalizeUser(rawUser) {
        const firstName = rawUser.FirstName || rawUser.firstName || "";
        const lastName = rawUser.LastName || rawUser.lastName || "";
        const fullName =
            rawUser.Name ||
            rawUser.name ||
            `${lastName} ${firstName}`.trim() ||
            rawUser.Email ||
            rawUser.email ||
            "Unknown";

        const password = rawUser.Password || rawUser.password || rawUser.Pass || "";
        const email = (rawUser.Email || rawUser.email || "").trim();
        const currentRole = rawUser.currentRole || (rawUser.role === "Admin" ? "Admin" : "User");

        return {
            id: rawUser.id || Math.random(),
            FirstName: firstName,
            LastName: lastName,
            Name: fullName,
            Email: email,
            Password: password,
            currentRole,
            role: { User: "User", Admin: "Admin" },
            pets: Array.isArray(rawUser.pets) ? rawUser.pets : [],
            appointments: Array.isArray(rawUser.appointments) ? rawUser.appointments : [],
            createdAt: rawUser.createdAt || new Date().toISOString(),
            isTestAccount: Boolean(rawUser.isTestAccount),
        };
    }

    static getRegisteredUsers() {
        try {
            const users = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
            return Array.isArray(users) ? users.map((u) => this.normalizeUser(u)) : [];
        } catch (error) {
            console.error("Бүртгэлтэй хэрэглэгчдийн өгөгдөл уншихад алдаа:", error);
            return [];
        }
    }

    static saveRegisteredUsers(users) {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }

    static async fetchRemoteUsers() {
        const now = Date.now();
        if (this.cachedRemoteUsers && now - this.lastFetchedAt < CACHE_TTL_MS) {
            return this.cachedRemoteUsers;
        }

        try {
            const response = await fetch(new URL("./userData.json", import.meta.url).href, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const normalized = Array.isArray(data) ? data.map((u) => this.normalizeUser(u)) : [];
            this.cachedRemoteUsers = normalized;
            this.lastFetchedAt = now;
            return normalized;
        } catch (error) {
            console.warn("Backend fetch амжилтгүй, fallback хэрэглэгч ашиглав:", error.message);
            if (this.cachedRemoteUsers) {
                return this.cachedRemoteUsers;
            }
            return [];
        }
    }

    static async getAllUsers() {
        const remoteUsers = await this.fetchRemoteUsers();
        const registeredUsers = this.getRegisteredUsers();
        const testUsers = TEST_LOGIN_USERS.map((u) => this.normalizeUser(u));

        const byEmail = new Map();
        [...remoteUsers, ...registeredUsers, ...testUsers].forEach((user) => {
            if (!user.Email) {
                return;
            }
            byEmail.set(user.Email.toLowerCase(), user);
        });
        return [...byEmail.values()];
    }

    static persistLoggedInUser(user) {
        const sessionUser = {
            id: user.id,
            Name: user.Name,
            FirstName: user.FirstName || "",
            LastName: user.LastName || "",
            Email: user.Email,
            currentRole: user.currentRole || "User",
            role: user.role || { User: "User", Admin: "Admin" },
            pets: Array.isArray(user.pets) ? user.pets : [],
            appointments: Array.isArray(user.appointments) ? user.appointments : [],
            isTestAccount: Boolean(user.isTestAccount),
        };

        localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(sessionUser));
        localStorage.setItem(TOKEN_KEY, `role:${sessionUser.currentRole}`);
    }

    static async logCheck(loginOBJ) {
        try {
            const validation = this.validateLoginInput(loginOBJ);
            if (!validation.valid) {
                showNotification(validation.error, "error");
                return false;
            }

            // Туршилтын нэвтрэлтийн тусгай хэсэг (User/Admin role).
            const testUser = authenticateTestCredentials(loginOBJ.Email, loginOBJ.Password);
            if (testUser) {
                const normalizedTestUser = this.normalizeUser(testUser);
                this.persistLoggedInUser(normalizedTestUser);
                showNotification(`Туршилтын ${normalizedTestUser.currentRole} эрхээр нэвтэрлээ`, "success");
                return true;
            }

            const users = await this.getAllUsers();
            const email = loginOBJ.Email.trim().toLowerCase();
            const user = users.find(
                (item) => item.Email.toLowerCase() === email && item.Password === loginOBJ.Password
            );

            if (!user) {
                showNotification("Email эсвэл password буруу байна", "error");
                return false;
            }

            this.persistLoggedInUser(user);
            showNotification(`Амжилттай нэвтэрлээ (${user.currentRole})`, "success");
            return true;
        } catch (error) {
            console.error("Нэвтрэх алдаа:", error);
            showNotification("Системийн алдаа гарлаа", "error");
            return false;
        }
    }

    static async enrollUser(enrollOBJ) {
        try {
            const firstName = (enrollOBJ.FirstName || "").trim();
            const lastName = (enrollOBJ.LastName || "").trim();
            const email = (enrollOBJ.Email || "").trim();
            const password = enrollOBJ.Password || "";

            if (!firstName || !lastName || !email || !password) {
                return {
                    success: false,
                    message: "Овог, нэр, имэйл болон нууц үгээ бүрэн оруулна уу",
                };
            }
            if (!this.validateEmail(email)) {
                return { success: false, message: "Имэйлийн формат буруу байна" };
            }

            const passwordValidation = this.validatePassword(password);
            if (!passwordValidation.valid) {
                return { success: false, message: passwordValidation.message };
            }

            const allUsers = await this.getAllUsers();
            const exists = allUsers.some((user) => user.Email.toLowerCase() === email.toLowerCase());
            if (exists) {
                return { success: false, message: "Энэ имэйл дээр аль хэдийн бүртгэгдсэн байна" };
            }

            const newUser = this.normalizeUser({
                id: Math.random(),
                FirstName: firstName,
                LastName: lastName,
                Name: `${lastName} ${firstName}`.trim(),
                Email: email,
                Password: password,
                currentRole: "User",
                pets: [],
                appointments: [],
                createdAt: new Date().toISOString(),
            });

            const registeredUsers = this.getRegisteredUsers();
            registeredUsers.push(newUser);
            this.saveRegisteredUsers(registeredUsers);

            return {
                success: true,
                message: "Амжилттай бүртгэгдлээ! Одоо нэвтэрнэ үү.",
                user: newUser,
            };
        } catch (error) {
            console.error("Бүртгүүлэлтийн алдаа:", error);
            return { success: false, message: "Системийн алдаа гарлаа" };
        }
    }

    static logout() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(LOGGED_IN_KEY);
            showNotification("Системээс гарлаа", "success");
            return true;
        } catch (error) {
            console.error("Logout алдаа:", error);
            return false;
        }
    }

    static getCurrentUser() {
        try {
            const user = localStorage.getItem(LOGGED_IN_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("getCurrentUser алдаа:", error);
            return null;
        }
    }

    static getToken() {
        return localStorage.getItem(TOKEN_KEY) || null;
    }

    static isAdmin(user = null) {
        const target = user || this.getCurrentUser();
        return target?.currentRole === "Admin";
    }
    static checkAuthAndRedirect() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          return true;
        }
    
        window.location.href = "logIn.html";
        return false;
    }
}

export default AuthService;