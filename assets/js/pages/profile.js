import { petCard } from "../components/PetCard.js";
import { showNotification } from "../utils.js"
import AuthService from "../domain/services/AuthenticationService.js";

document.addEventListener("DOMContentLoaded", (event) => {
    
    const loggedUser_key = "LoggedIn";
    
    // ────────────────────────────────────────────
    // 1. ХЭРЭГЛЭГЧИЙН НЭВТРЭЛТ ШАЛГАХ (ХАМГААЛАЛТ)
    // ────────────────────────────────────────────
    console.log("🔵 Profile хуудас ачаалалаа...");
    
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        console.error("❌ Хэрэглэгч нэвтрээгүй байна");
        showNotification("Та эхлээд нэвтэрч орно уу!", "error");
        setTimeout(() => {
            window.location.href = "logIn.html";
        }, 1500);
        return;
    }

    console.log("✅ Нэвтэрсэн хэрэглэгч:", currentUser);

    // ────────────────────────────────────────────
    // 2. ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ ДЭЛГЭЦЭНД ХАРУУЛАХ
    // ────────────────────────────────────────────
    const userNameEl = document.querySelector(".user-info-mini h3");
    const userEmailEl = document.querySelector(".user-info-mini p");
    const avatarEl = document.querySelector(".avatar");

    if (userNameEl) {
        userNameEl.textContent = currentUser.Name || "Ухагдах нэргүй";
        console.log("✅ Нэрийг сетлэлээ:", currentUser.Name);
    }

    if (userEmailEl) {
        userEmailEl.textContent = currentUser.Email;
        console.log("✅ Имэйлийг сетлэлээ:", currentUser.Email);
    }

    if (avatarEl) {
        avatarEl.textContent = (currentUser.Name || "У")[0].toUpperCase();
        avatarEl.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        console.log("✅ Avatar сетлэлээ:", avatarEl.textContent);
    }

    // ────────────────────────────────────────────
    // 3. АМЬТНЫ ФОРМ - АНХАНДАА НУУХ
    // ────────────────────────────────────────────
    const addPetForm = document.getElementById("addPetForm");
    if (addPetForm) {
        addPetForm.style.display = "none";
        console.log("✅ Амьтны форм нуугдсан");
    }

    // ────────────────────────────────────────────
    // 4. ГАРАХ (LOGOUT) ҮЙЛДЭЛ
    // ────────────────────────────────────────────
    const logoutButtons = document.querySelectorAll('a[href="index.html"]');
    logoutButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("🔵 Logout товч дарагдлаа");

            const confirmLogout = confirm("Та системээс гарахдаа итгэлтэй байна уу?");
            if (confirmLogout) {
                const success = AuthService.logout();
                if (success) {
                    console.log("✅ Амжилттай гарлаа");
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);
                } else {
                    console.error("❌ Logout алдаа");
                    showNotification("Гарахад алдаа гарлаа", "error");
                }
            } else {
                console.log("⚠️ Logout хүүхэлгээ");
            }
        });
    });

    // ────────────────────────────────────────────
    // 5. ЗҮҮН ТАЛЫН ЦЭС - TABS СОНГОХ
    // ────────────────────────────────────────────
    const menuLinks = document.querySelectorAll(".profile-menu a:not(:last-child)");
    const contentSections = document.querySelectorAll(".profile-content > div, .profile-content > h2");

    menuLinks.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("🔵 Меню дарагдлаа:", link.textContent);

            // Хуучин active классыг устгах
            document.querySelectorAll(".profile-menu a").forEach(a => {
                a.classList.remove("active");
            });

            // Дарсан линкэнд active өгөх
            link.classList.add("active");

            // Бүх content-ыг нуух
            contentSections.forEach(section => {
                section.style.display = "none";
            });

            // Сонгосон content-ыг үзүүлэх
            // (ЭЭ хэсгийн логик HTML бүтцээс хамаарна)
            console.log("✅ Меню солигдлоо");
        });
    });

    // ────────────────────────────────────────────
    // 6. АМЬТАН НЭМЭХ - ФОРМ НЭЭХ/ХААХ
    // ────────────────────────────────────────────
    const addPetBtn = document.querySelector(".btn-outline");
    const petList = document.querySelector(".card-grid");

    if (addPetBtn && addPetForm) {
        addPetBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("🔵 'Амьтан нэмэх' товч дарагдлаа");
            
            addPetForm.style.display = "flex";
            addPetBtn.style.display = "none";
            console.log("✅ Форм нээгдсэн");
        });
    }

    // ────────────────────────────────────────────
    // 7. АМЬТАН НЭМЭХ - FORM SUBMIT
    // ────────────────────────────────────────────
    const petNameInput = document.getElementById("petName");
    const petAgeInput = document.getElementById("petAge");
    const petMonthInput = document.getElementById("petMonth");
    const petTypeInput = document.getElementById("petType");
    const petGenderInput = document.getElementById("selGender");
    const submitPetBtn = document.querySelector('button[type="submit"]');

    if (addPetForm && submitPetBtn) {
        addPetForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("🔵 Амьтны форм submit болсон");

            // Input validation
            if (!petNameInput.value.trim()) {
                showNotification("Амьтны нэрийг оруулна уу", "error");
                petNameInput.focus();
                return;
            }

            if (!petTypeInput.value) {
                showNotification("Амьтны төрлийг сонгоно уу", "error");
                petTypeInput.focus();
                return;
            }

            if (!petAgeInput.value.trim() || !petMonthInput.value.trim()) {
                showNotification("Амьтны насыг оруулна уу", "error");
                petAgeInput.focus();
                return;
            }

            if (!petGenderInput.value) {
                showNotification("Амьтны хүйсийг сонгоно уу", "error");
                petGenderInput.focus();
                return;
            }

            // Амьтны объект үүсгэх
            const newPet = {
                id: Math.random(),
                Name: petNameInput.value.trim(),
                Type: petTypeInput.value,
                Age: {
                    age: petAgeInput.value.trim(),
                    month: petMonthInput.value.trim()
                },
                Gender: petGenderInput.value,
                createdAt: new Date().toISOString()
            };

            console.log("✅ Шинэ амьтан объект үүсгэгдлээ:", newPet);

            // Amьтны карт үүсгэх
            try {
                const newCard = petCard(newPet);
                if (petList && newCard) {
                    petList.appendChild(newCard);
                    console.log("✅ Амьтны карт дэлгэцэнд нэмэгдлээ");
                }
            } catch (error) {
                console.error("❌ Амьтны карт үүсгэхэд алдаа:", error);
                showNotification("Амьтны карт үүсгэхэд алдаа гарлаа", "error");
                return;
            }

            // Хэрэглэгчийн өгөгдөл дээр амьтан нэмэх (localStorage)
            try {
                let userData = AuthService.getCurrentUser();
                if (!userData.pets) {
                    userData.pets = [];
                }
                userData.pets.push(newPet);
                localStorage.setItem(loggedUser_key, JSON.stringify(userData));
                console.log("✅ Хэрэглэгчийн өгөгдөлд амьтан нэмэгдлээ");
            } catch (error) {
                console.error("❌ localStorage-д нэмэхэд алдаа:", error);
                showNotification("Өгөгдөл хадгалахад алдаа гарлаа", "error");
                return;
            }

            // UI шинэчлэх
            showNotification("✅ Амжилттай бүртгэгдлээ!", "success");
            addPetForm.reset();
            addPetForm.style.display = "none";
            addPetBtn.style.display = "";
            console.log("✅ Форм цэвэрлэгдэж хаагдлаа");
        });
    }

    // ────────────────────────────────────────────
    // 8. АМЬТАН НЭМЭХ ФОРМ - ЦУЦЛАХ ТОВЧ
    // ────────────────────────────────────────────
    const cancelPetBtn = document.getElementById("cancelPetFormBtn");
    if (cancelPetBtn && addPetForm && addPetBtn) {
        cancelPetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("🔵 Цуцлах товч дарагдлаа");

            addPetForm.reset();
            addPetForm.style.display = "none";
            addPetBtn.style.display = "";
            console.log("✅ Форм цэвэрлэгдэж хаагдлаа");
        });
    }

    // ────────────────────────────────────────────
    // 9. НЭВТЭРСЭН ХЭРЭГЛЭГЧИЙН АМЬТНУУДЫГ АЧААЛАХ
    // ────────────────────────────────────────────
    function loadUserPets() {
        try {
            const user = AuthService.getCurrentUser();
            if (user && user.pets && Array.isArray(user.pets)) {
                console.log("🔵 Хэрэглэгчийн амьтнуудыг ачаалж байна...");
                
                if (petList) {
                    petList.innerHTML = ""; // Өмнөхийг цэвэрлэх
                }

                user.pets.forEach(pet => {
                    try {
                        const card = petCard(pet);
                        if (petList && card) {
                            petList.appendChild(card);
                        }
                    } catch (error) {
                        console.error("❌ Амьтны карт ачаалахад алдаа:", error);
                    }
                });

                console.log(`✅ ${user.pets.length} амьтан ачаалагдлаа`);
            }
        } catch (error) {
            console.error("❌ Амьтнуудыг ачаалахад алдаа:", error);
            showNotification("Амьтнуудыг ачаалахад алдаа гарлаа", "error");
        }
    }

    // Хуудас ачаалахад амьтнуудыг үзүүлэх
    loadUserPets();

    // ────────────────────────��───────────────────
    // 10. ХЭРЭГЛЭГЧИЙН СТАТУС МОНИТОРИНГ
    // ────────────────────────────────────────────
    // LocalStorage өөрчлөгдөхөд сэргээх (өөр таб дээрээс өөрчлөгдсөн тохиолдол)
    window.addEventListener('storage', (e) => {
        if (e.key === loggedUser_key) {
            console.log("🔵 LocalStorage өөрчлөгдлөө, хуудас сэргээж байна...");
            location.reload();
        }
    });

    // ────────────────────────────────────────────
    // 11. АМЬТАН УСТГАХ ФУНКЦ (ОПЦИОНАЛ)
    // ────────────────────────────────────────────
    window.deletePet = function(petId) {
        console.log("🔵 Амьтан устгах үйлдэл эхлэв:", petId);

        const confirmDelete = confirm("Та энэ амьтанг устгахдаа итгэлтэй байна уу?");
        if (confirmDelete) {
            try {
                let userData = AuthService.getCurrentUser();
                if (userData.pets && Array.isArray(userData.pets)) {
                    const initialLength = userData.pets.length;
                    userData.pets = userData.pets.filter(pet => pet.id !== petId);
                    
                    if (userData.pets.length < initialLength) {
                        localStorage.setItem(loggedUser_key, JSON.stringify(userData));
                        console.log("✅ Амьтан устгагдлаа");
                        showNotification("✅ Амьтан устгагдлаа", "success");
                        loadUserPets(); // UI шинэчлэх
                    } else {
                        console.warn("⚠️ Амьтан олдсонгүй");
                    }
                }
            } catch (error) {
                console.error("❌ Амьтан устгахэд алдаа:", error);
                showNotification("Амьтан устгахэд алдаа гарлаа", "error");
            }
        } else {
            console.log("⚠️ Амьтан устгалт хүүхэлгээ");
        }
    };

    // ────────────────────────────────────────────
    // 12. ПРОФАЙЛ ШИНЭЧЛЭХ ФУНКЦ (ОПЦИОНАЛ)
    // ────────────────────────────────────────────
    window.updateProfile = function() {
        console.log("🔵 Профайл шинэчлэх үйлдэл эхлэв");

        const newName = prompt("Шинэ нэрээ оруулна уу:", currentUser.Name);
        if (newName && newName.trim()) {
            try {
                let userData = AuthService.getCurrentUser();
                userData.Name = newName.trim();
                localStorage.setItem(loggedUser_key, JSON.stringify(userData));
                
                if (userNameEl) {
                    userNameEl.textContent = newName.trim();
                }
                if (avatarEl) {
                    avatarEl.textContent = newName.trim()[0].toUpperCase();
                }

                console.log("✅ Профайл шинэчлэгдлээ");
                showNotification("✅ Профайл шинэчлэгдлээ", "success");
            } catch (error) {
                console.error("❌ Профайл шинэчлэхэд алдаа:", error);
                showNotification("Профайл шинэчлэхэд алдаа гарлаа", "error");
            }
        }
    };

    console.log("✅ Profile.js бүх логик ачаалагдлаа");
});