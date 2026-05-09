import { petCard } from "../components/pet.js";
import { showNotification } from "../domain/services/uiService.js";
import {
    getCurrentUser,
    logoutUser,
    requireAuth
} from "../domain/services/AuthenticationService.js";
import {
    addPetToCurrentUser,
    listPetsForCurrentUser
} from "../domain/services/petService.js";

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuth()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const name = document.querySelector(".user-info-mini h3");
    const email = document.querySelector(".user-info-mini p");
    const avatar = document.querySelector(".avatar");
    const addPet = document.getElementById("addPetForm");
    const addPetBtn = document.querySelector(".btn-outline");
    const petList = document.querySelector(".card-grid");
    const petName = document.getElementById("petName");
    const petAge = document.getElementById("petAge");
    const petMonth = document.getElementById("petMonth");
    const petType = document.getElementById("petType");
    const petGender = document.getElementById("selGender");
    const cancelBtn = document.getElementById("cancelPetFormBtn");

    if (addPet) addPet.style.display = "none";

    if (name) name.textContent = currentUser.Name || "";
    if (email) email.textContent = currentUser.Email || "";
    if (avatar) avatar.textContent = (currentUser.Name || currentUser.Email || "")[0] || "";

    const logoutBtn = document.querySelector('a[href="index.html"][style*="color: #dc3545"]');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Та системээс гарахдаа итгэлтэй байна уу?");
            if (confirmLogout) {
                logoutUser();
                window.location.href = "index.html";
            }
        });
    }

    const menuLinks = document.querySelectorAll(".profile-menu a:not(:last-child)");
    menuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const activeLink = document.querySelector(".profile-menu a.active");
            if (activeLink) activeLink.classList.remove("active");
            link.classList.add("active");
        });
    });

    if (petList) {
        listPetsForCurrentUser().forEach((pet) => {
            petList.appendChild(petCard(pet));
        });
    }

    if (addPetBtn && addPet) {
        addPetBtn.addEventListener("click", (event) => {
            event.preventDefault();
            addPet.style.display = "";
            addPetBtn.style.display = "none";
        });
    }

    if (addPet && petList) {
        addPet.addEventListener("submit", (e) => {
            e.preventDefault();

            const newAnimal = {
                Name: petName.value.trim(),
                Type: petType.value,
                Age: {
                    age: petAge.value.trim(),
                    month: petMonth.value.trim()
                },
                Gender: petGender.value
            };

            const result = addPetToCurrentUser(newAnimal);
            if (!result.ok) {
                showNotification(result.message, "error");
                return;
            }

            petList.appendChild(petCard(newAnimal));
            showNotification("Амжилттай бүртгэгдлээ!", "success");
            addPet.reset();
            addPet.style.display = "none";
            if (addPetBtn) addPetBtn.style.display = "";
        });
    }

    if (cancelBtn && addPet && addPetBtn) {
        cancelBtn.addEventListener("click", () => {
            addPet.reset();
            addPet.style.display = "none";
            addPetBtn.style.display = "";
        });
    }
});