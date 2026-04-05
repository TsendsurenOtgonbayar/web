document.addEventListener("DOMContentLoaded", () => {
    // 1. Хэрэглэгч нэвтрээгүй бол буцаагаад нэвтрэх хуудас руу шидэх (Хамгаалалт)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        alert("Та эхлээд нэвтэрч орно уу!");
        window.location.href = "logIn.html";
        return;
    }

    // 2. Гарах (Logout) үйлдэл
    const logoutBtn = document.querySelector('a[href="index.html"][style*="color: #dc3545"]');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Та системээс гарахдаа итгэлтэй байна уу?");
            if (confirmLogout) {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userEmail");
                window.location.href = "index.html";
            }
        });
    }

    // 3. Зүүн талын цэсээр агуулга солих (Tabs)
    const menuLinks = document.querySelectorAll(".profile-menu a:not(:last-child)");
    const contentSections = document.querySelectorAll(".profile-content > div, .profile-content > h2");

    // Одоогоор UI дээр бүх мэдээлэл нэг дор харагдаж байгаа. 
    // Хэрэв та цэс дарахад хэсгүүд нуугдаж, гарч ирдэг хийхийг хүсвэл энд логик нэмнэ.
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            // Хуучин active классыг устгах
            document.querySelector(".profile-menu a.active").classList.remove("active");
            // Дарсан линкэнд active өгөх
            link.classList.add("active");
        });
    });

    // 4. Амьтан шинээр нэмэх товч
    const addPetBtn = document.querySelector(".btn-outline");
    if (addPetBtn) {
        addPetBtn.addEventListener("click", () => {
            const petName = prompt("Шинэ амьтны нэрийг оруулна уу:");
            if (petName) {
                alert(`${petName} нэртэй амьтан амжилттай нэмэгдлээ! (Энэ хэсгийг дараа нь модал/форм болгох)`);
            }
        });
    }
});