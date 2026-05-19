import { ServiceCard } from "../components/ServiceCard.js";

const services = [
    {
        category: "uzleg",
        title: "Ерөнхий үзлэг eronhii uzleg",
        icon: "🩺",
        name: "Ерөнхий үзлэг",
        description: "Амьтны биеийн ерөнхий байдлыг шалгана.",
        price: "25,000–40,000₮",
        rating: "4.8",
        link: "booking.html"
    },
    {
        category: "vaccin",
        title: "Вакцинжуулалт vaccin",
        icon: "💉",
        name: "Вакцинжуулалт",
        description: "Халдварт өвчнөөс сэргийлэх вакцин.",
        price: "15,000–35,000₮",
        rating: "4.9",
        link: "booking.html"
    },
    {
        category: "uzleg",
        title: "Шүдний эмчилгээ shudnii emchilgee",
        icon: "💉",
        name: "Шүдний эмчилгээ",
        description: "Шүдний цэвэрлэгээ болон эмчилгээ.",
        price: "30,000–80,000₮",
        rating: "4.7",
        link: "booking.html"
    },
    {
        category: "mes-zasal",
        title: "Мэс засал mes zasal",
        icon: "✂️",
        name: "Мэс засал",
        description: "Бүх төрлийн мэс заслын үйлчилгээ.",
        price: "100,000–500,000₮",
        rating: "4.9",
        link: "booking.html"
    },
    {
        category: "onshilgoo",
        title: "Лабораторийн шинжилгээ laboratoriin shinjilgee",
        icon: "🔬",
        name: "Лабораторийн шинжилгээ",
        description: "Цусны болон шинжилгээ.",
        price: "20,000–60,000₮",
        rating: "4.6",
        link: "booking.html"
    },
    {
         category: "aris-vs",
        title: "Арьс үсний арчилгаа aris vsnii archilgaa",
        icon: "🔬",
        name: "Арьс үсний арчилгаа",
        description: "Арьс, үсний эрүүл мэндийн шалгалт.",
        price: "20,000–60,000₮",
        rating: "4.5",
        link: "booking.html"
    }
];

const container = document.querySelector(".cards");

services.forEach(service => {
    container.appendChild(ServiceCard(service));
});


function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
}

function cardMatchesFilter(card, selectedCategory, query) {
    const category = card.dataset.category;
    const title = normalize(card.dataset.title || card.querySelector("h3")?.textContent);

    const categoryMatch = selectedCategory === "all" || category === selectedCategory;
    const searchMatch = !query || title.includes(query);
    return categoryMatch && searchMatch;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-logo");
    const buttons = document.querySelectorAll(".cat-btn");
    const cards = document.querySelectorAll(".card");

    if (!searchInput || !buttons.length || !cards.length) {
        return;
    }

    const state = {
        selectedCategory: "all",
        searchText: "",
    };

    function renderCards() {
        const query = normalize(state.searchText);
        cards.forEach((card) => {
            card.style.display = cardMatchesFilter(card, state.selectedCategory, query) ? "" : "none";
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            state.selectedCategory = button.dataset.filter || "all";
            renderCards();
        });
    });

    searchInput.addEventListener("input", (event) => {
        state.searchText = event.target.value;
        renderCards();
    });

    renderCards();
});
     

  