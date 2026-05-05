import { petCard } from "../components/PetCard.js";
import { showNotification } from "../utils.js";
import APIGateway from "../gateway/apiGateway.js";

let currentUser = null;

function calculateAgeParts(pet) {
    if (typeof pet.getAgeInYears === "function") {
        return { age: pet.getAgeInYears(), month: 0 };
    }

    const birthYear = Number(pet.birthYear);
    const birthMonth = Number(pet.birthMonth);
    if (!birthYear || !birthMonth) {
        return { age: 0, month: 0 };
    }

    const now = new Date();
    let years = now.getFullYear() - birthYear;
    let months = now.getMonth() + 1 - birthMonth;
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { age: Math.max(0, years), month: Math.max(0, months) };
}

async function getCurrentUserOrRedirect() {
    const user = await APIGateway.getCurrentUser();
    if (user) {
        if (APIGateway.isAdmin(user)) {
            window.location.href = "/UI/dashboard.html";
            return null;
        }
        return user;
    }

    showNotification("Та эхлээд нэвтэрч орно уу!", "error");
    setTimeout(() => {
        window.location.href = "/UI/logIn.html";
    }, 1200);
    return null;
}

function renderUserSummary(user) {
    const userNameEl = document.querySelector(".user-info-mini h3");
    const userEmailEl = document.querySelector(".user-info-mini p");
    const avatarEl = document.querySelector(".avatar");

    const displayName = user?.Name || user?.name || "нэргүй";
    const displayEmail = user?.Email || user?.email || "";

    if (userNameEl) {
        userNameEl.textContent = displayName;
    }
    if (userEmailEl) {
        userEmailEl.textContent = displayEmail;
    }
    if (avatarEl) {
        avatarEl.textContent = (displayName[0] || "U").toUpperCase();
        avatarEl.style.backgroundColor = "#2b5ba8";
    }
}

function getPetGrid() {
    return document.querySelector(".card-grid");
}

async function renderUserPets() {
    const petGrid = getPetGrid();
    if (!petGrid || !currentUser) {
        return;
    }

    const dashboard = await APIGateway.getPatientDashboard(currentUser.userId);
    const pets = Array.isArray(dashboard?.pets) ? dashboard.pets : [];

    petGrid.innerHTML = "";
    pets.forEach((pet) => {
        const ageParts = calculateAgeParts(pet);
        petGrid.appendChild(petCard({
            Name: pet.name,
            Type: pet.type,
            Age: ageParts,
            Gender: pet.gender
        }));
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

        APIGateway.logout().then(() => {
            window.location.href = "/index.html";
        });
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
        name: petNameInput.value.trim(),
        type: petTypeInput.value,
        birthYear: Number(petAgeInput.value.trim()),
        birthMonth: Number(petMonthInput.value.trim()),
        gender: petGenderInput.value,
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

    addPetForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newPet = buildPetFromForm();
        if (!newPet || !currentUser) {
            return;
        }

        const result = await APIGateway.addPet(currentUser.userId, newPet);
        if (!result.success) {
            showNotification(result.errors?.[0] || result.error || "Амьтан бүртгэхэд алдаа гарлаа", "error");
            return;
        }

        await renderUserPets();

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
    window.deletePet = async function(petId) {
        const confirmed = confirm("Та энэ амьтанг устгахдаа итгэлтэй байна уу?");
        if (!confirmed || !currentUser) {
            return;
        }

        const result = await APIGateway.deletePet(currentUser.userId, petId);
        if (!result.success) {
            showNotification(result.error || "Амьтан устгах боломжгүй", "error");
            return;
        }

        await renderUserPets();
        showNotification("✅ Амьтан устгагдлаа", "success");
    };

    window.updateProfile = async function() {
        if (!currentUser) {
            return;
        }

        const newName = prompt("Шинэ нэрээ оруулна уу:", currentUser.Name || currentUser.name || "");
        if (!newName || !newName.trim()) {
            return;
        }

        const result = await APIGateway.updateCurrentUser({ displayName: newName.trim(), Name: newName.trim() });
        if (!result.success) {
            showNotification(result.error || "Профайл шинэчлэхэд алдаа гарлаа", "error");
            return;
        }

        currentUser = await APIGateway.getCurrentUser();
        renderUserSummary(currentUser);
        showNotification("✅ Профайл шинэчлэгдлээ", "success");
    };
}

function setupStorageSync() {
    window.addEventListener("storage", (event) => {
        if (event.key === "identity_service_current_user") {
            window.location.reload();
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    currentUser = await getCurrentUserOrRedirect();
    if (!currentUser) {
        return;
    }

    renderUserSummary(currentUser);
    setupLogoutAction();
    setupMenuActiveState();
    setupPetForm();
    await renderUserPets();
    exposePageActions();
    setupStorageSync();
});