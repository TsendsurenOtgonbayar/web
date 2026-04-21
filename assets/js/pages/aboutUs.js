import { DoctorCard } from "../components/DoctorCard.js";

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
            image: "assets/doctor-1.png",
            rating: 5,
            experience: 12,
            speciality: "Дотрын өвчин"
        },
        {
            name: "Т. Батбаярг",
            type: "Мэс заслын эмч",
            image: "assets/doctor-2.png",
            rating: 4,
            experience: 8,
            speciality: "Дотрын өвчин"
        },
        {
            name: "Л. Ганзориг",
            type: "Оношилгооны эмч",
            image: "assets/doctor-3.png",
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
            currentRating = index + 1; // 1-ээс 5 хүртэл
            
            // Бүх одыг шалгаж будах
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.classList.add("filled");
                } else {
                    s.classList.remove("filled");
                }
            });

            checkFormValidity();
        });
    });

    // 2. Текст бичих үед товчийг идэвхжүүлэх
    reviewText.addEventListener("input", checkFormValidity);

    function checkFormValidity() {
        if (currentRating > 0 && reviewText.value.trim().length > 0) {
            submitBtn.classList.add("active");
        } else {
            submitBtn.classList.remove("active");
        }
    }

    // 3. Илгээх товч дарах үйлдэл
    submitBtn.addEventListener("click", () => {
        if (currentRating === 0) {
            alert("Та одоор үнэлгээ өгнө үү!");
            return;
        }
        if (reviewText.value.trim() === "") {
            alert("Та сэтгэгдлээ бичнэ үү!");
            return;
        }

        // Шинэ сэтгэгдэл угсрах
        let starsHtml = "";
        for(let i=0; i<5; i++) {
            if(i < currentRating) {
                // Бүтэн од
                starsHtml += `<svg viewBox="0 0 24 24" style="fill: #e08545; width: 18px; height: 18px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
            } else {
                // Хоосон од
                starsHtml += `<svg viewBox="0 0 24 24" fill="none" stroke="#e08545" style="width: 18px; height: 18px; stroke-width: 2px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
            }
        }

        const today = new Date().toISOString().split('T')[0].replace(/-/g, '.'); // ЖЖЖЖ.СС.ӨӨ
        
        const newReviewHTML = `
            <div class="review-item" style="animation: fadeIn 0.5s;">
                <div class="review-header">
                    <div class="reviewer-name">
                        Зочин (Та)
                        <div class="star-rating-display">
                            ${starsHtml}
                        </div>
                    </div>
                    <div class="review-date">${today}</div>
                </div>
                <p class="review-text">${reviewText.value}</p>
            </div>
        `;

        // Хамгийн дээр нь нэмэх
        reviewsList.insertAdjacentHTML('afterbegin', newReviewHTML);

        // Формыг цэвэрлэх
        currentRating = 0;
        stars.forEach(s => s.classList.remove("filled"));
        reviewText.value = "";
        submitBtn.classList.remove("active");
        
        alert("Таны сэтгэгдэл амжилттай нэмэгдлээ!");
    });
});