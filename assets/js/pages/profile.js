import { petCard } from "../components/PetCard.js";
import { showNotification } from "../utils.js";
import AuthService from "../domain/services/AuthenticationService.js";

const LOGGED_USER_KEY = "LoggedIn";

function getCurrentUserOrRedirect() {
    const user = AuthService.getCurrentUser();
    if (user) {
        return user;
    }
    showNotification("Та эхлээд нэвтэрч орно уу!", "error");
    setTimeout(() => {
        window.location.href = "logIn.html";
    }, 1200);
    return null;
}

function saveCurrentUser(user) {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
}

function renderUserSummary(user) {
    const userNameEl = document.querySelector(".user-info-mini h3");
    const userEmailEl = document.querySelector(".user-info-mini p");
    const avatarEl = document.querySelector(".avatar");

    const displayName = user.Name || user.name || "Ухагдах нэргүй";
    const displayEmail = user.Email || user.email || "";

    if (userNameEl) {
        userNameEl.textContent = displayName;
    }
    if (userEmailEl) {
        userEmailEl.textContent = displayEmail;
    }
    if (avatarEl) {
        avatarEl.textContent = displayName[0].toUpperCase();
        avatarEl.style.backgroundColor = "#2b5ba8";
    }
}

function getPetGrid() {
    return document.querySelector(".card-grid");
}

function renderUserPets() {
    const petGrid = getPetGrid();
    const addPetButton = document.querySelector(".btn-outline");
    if (!petGrid || !addPetButton) {
        return;
    }

    const user = AuthService.getCurrentUser();
    const pets = Array.isArray(user?.pets) ? user.pets : [];

    petGrid.querySelectorAll(".item-card").forEach((item) => item.remove());

    pets.forEach((pet) => {
        petGrid.appendChild(petCard(pet));
    });
}

function setupLogoutAction() {
    const logoutLink = document.querySelector('.profile-menu a[href="index.html"]');
    if (!logoutLink) {
        return;
    }

    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        const confirmed = confirm("Та системээс гарахдаа итгэлтэй байна уу?");
        if (!confirmed) {
            return;
        }

        if (AuthService.logout()) {
            window.location.href = "index.html";
            return;
        }
        showNotification("Гарахад алдаа гарлаа", "error");
    });
}

function setupMenuActiveState() {
    const menuLinks = document.querySelectorAll(".profile-menu a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            menuLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

function buildPetFromForm() {
    const petNameInput = document.getElementById("petName");
    const petAgeInput = document.getElementById("petAge");
    const petMonthInput = document.getElementById("petMonth");
    const petTypeInput = document.getElementById("petType");
    const petGenderInput = document.getElementById("selGender");

    if (!petNameInput?.value.trim()) {
        showNotification("Амьтны нэрийг оруулна уу", "error");
        petNameInput?.focus();
        return null;
    }
    if (!petTypeInput?.value) {
        showNotification("Амьтны төрлийг сонгоно уу", "error");
        petTypeInput?.focus();
        return null;
    }
    if (!petAgeInput?.value.trim() || !petMonthInput?.value.trim()) {
        showNotification("Амьтны насыг оруулна уу", "error");
        petAgeInput?.focus();
        return null;
    }
    if (!petGenderInput?.value) {
        showNotification("Амьтны хүйсийг сонгоно уу", "error");
        petGenderInput?.focus();
        return null;
    }

    return {
        id: Math.random(),
        Name: petNameInput.value.trim(),
        Type: petTypeInput.value,
        Age: {
            age: petAgeInput.value.trim(),
            month: petMonthInput.value.trim(),
        },
        Gender: petGenderInput.value,
        createdAt: new Date().toISOString(),
    };
}

function setupPetForm() {
    const addPetButton = document.querySelector(".btn-outline");
    const addPetForm = document.getElementById("addPetForm");
    const cancelButton = document.getElementById("cancelPetFormBtn");

    if (!addPetButton || !addPetForm) {
        return;
    }

    addPetForm.style.display = "none";

    addPetButton.addEventListener("click", (event) => {
        event.preventDefault();
        addPetForm.style.display = "flex";
        addPetButton.style.display = "none";
    });

    addPetForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newPet = buildPetFromForm();
        if (!newPet) {
            return;
        }

        const user = AuthService.getCurrentUser();
        if (!user) {
            showNotification("Хэрэглэгчийн мэдээлэл олдсонгүй", "error");
            return;
        }

        user.pets = Array.isArray(user.pets) ? user.pets : [];
        user.pets.push(newPet);
        saveCurrentUser(user);
        renderUserPets();

        showNotification("✅ Амжилттай бүртгэгдлээ!", "success");
        addPetForm.reset();
        addPetForm.style.display = "none";
        addPetButton.style.display = "";
    });

    if (cancelButton) {
        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            addPetForm.reset();
            addPetForm.style.display = "none";
            addPetButton.style.display = "";
        });
    }
}

function exposePageActions() {
    window.deletePet = function(petId) {
        const confirmed = confirm("Та энэ амьтанг устгахдаа итгэлтэй байна уу?");
        if (!confirmed) {
            return;
        }

        const user = AuthService.getCurrentUser();
        if (!user || !Array.isArray(user.pets)) {
            showNotification("Амьтан олдсонгүй", "error");
            return;
        }

        const before = user.pets.length;
        user.pets = user.pets.filter((pet) => pet.id !== petId);
        if (user.pets.length === before) {
            showNotification("Амьтан олдсонгүй", "error");
            return;
        }

        saveCurrentUser(user);
        renderUserPets();
        showNotification("✅ Амьтан устгагдлаа", "success");
    };

    window.updateProfile = function() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            return;
        }

        const newName = prompt("Шинэ нэрээ оруулна уу:", currentUser.Name || "");
        if (!newName || !newName.trim()) {
            return;
        }

        currentUser.Name = newName.trim();
        saveCurrentUser(currentUser);
        renderUserSummary(currentUser);
        showNotification("✅ Профайл шинэчлэгдлээ", "success");
    };
}

function setupStorageSync() {
    window.addEventListener("storage", (event) => {
        if (event.key === LOGGED_USER_KEY) {
            window.location.reload();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUserOrRedirect();
    if (!user) {
        return;
    }

    renderUserSummary(user);
    setupLogoutAction();
    setupMenuActiveState();
    setupPetForm();
    renderUserPets();
    exposePageActions();
    setupStorageSync();
});