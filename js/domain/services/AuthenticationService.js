import {
	getLoggedInUser,
	getUsers,
	setLoggedInUser,
	setUsers,
	clearLoggedInUser
} from "./storageService.js";
import { showNotification } from "./uiService.js";

function normalizeUser(user) {
	if (!user) return null;
	const pets = Array.isArray(user.Pets) ? user.Pets : [];
	return { ...user, Pets: pets };
}

export function registerUser({ name, pet, email, password }) {
	const users = getUsers();
	const exists = users.some((u) => u.Email === email);

	if (exists) {
		return { ok: false, message: "Энэ имэйлээр бүртгэлтэй хэрэглэгч байна." };
	}

	const newUser = {
		Name: name,
		Pet: pet,
		Email: email,
		Pass: password,
		Pets: []
	};

	setUsers([...users, newUser]);
	return { ok: true, user: newUser };
}

export function loginUser(email, password) {
	const users = getUsers();
	const match = users.find((user) => user.Email === email && user.Pass === password);

	if (!match) {
		return { ok: false, message: "Email эсвэл password буруу байна" };
	}

	const normalized = normalizeUser(match);
	setLoggedInUser(normalized);
	return { ok: true, user: normalized };
}

export function getCurrentUser() {
	return normalizeUser(getLoggedInUser());
}

export function isLoggedIn() {
	return !!getLoggedInUser();
}

export function requireAuth(redirectUrl = "logIn.html") {
	if (!isLoggedIn()) {
		showNotification("Та эхлээд нэвтэрч орно уу!", "error");
		window.location.href = redirectUrl;
		return false;
	}

	return true;
}

export function logoutUser() {
	clearLoggedInUser();
}