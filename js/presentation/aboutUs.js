import { DoctorCard } from "/web/js/components/DoctorCard.js";

document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#starSelector svg");
    const reviewText = document.getElementById("reviewText");
    const submitBtn = document.getElementById("submitReviewBtn");
    const reviewsList = document.getElementById("reviewsList");
    const doctorList = document.querySelector('.doctor-list');
    
    let currentRating = 0;

    const doctors = [
        {
            name: "Б. Оюунчимэг",
            type: "Ерөнхий малын эмч",
            image: "/web/access/doctor-1.png",
            rating: 5,
            experience: 12,
            speciality: "Дотрын өвчин"
        },
        {
            name: "Т. Батбаяр",
            type: "Мэс заслын эмч",
            image: "/web/access/doctor-2.png",
            rating: 4,
            experience: 8,
            speciality: "Дотрын өвчин"
        },
        {
            name: "Л. Ганзориг",
            type: "Оношилгооны эмч",
            image: "/web/access/doctor-3.png",
            rating: 5,
            experience: 12,
            speciality: "Дотрын өвчин"
        }
    ];


    doctors.forEach(doctor => {
        const card = DoctorCard(doctor); // Карт үүсгэх
        doctorList.appendChild(card);    // Жагсаалт руу нэмэх
    });

    // 1. Одод дээр дарах үйлдэл
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            currentRating = index + 1;
            paintStars();
            updateSubmitButtonState();
        });
    });

    reviewText.addEventListener("input", updateSubmitButtonState);

    submitBtn.addEventListener("click", () => {
        const text = reviewText.value.trim();
        if (currentRating === 0) {
            alert("Та одоор үнэлгээ өгнө үү!");
            return;
        }
        if (!text) {
            alert("Та сэтгэгдлээ бичнэ үү!");
            return;
        }

        reviewsList.insertAdjacentHTML("afterbegin", createReviewHtml(currentRating, text));

        currentRating = 0;
        reviewText.value = "";
        paintStars();
        updateSubmitButtonState();
        alert("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
    });
});