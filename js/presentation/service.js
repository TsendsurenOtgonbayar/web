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
     

  