const searchInput = document.getElementById("search-logo");
const buttons = document.querySelectorAll(".cat-btn");
const cards = document.querySelectorAll(".card");

let selectedCategory = "all";
let searchText = "";

    function normalize(str) {
        return (str || "").toString().trim().toLowerCase();
    }

    function render() {
        const q = normalize(searchText);

        cards.forEach((card) => {
        const cat = card.dataset.category; // "vaksin" гэх мэт
        // Нэрийг 2 янзаар авч болно:
        // 1) data-title ашиглах
        // 2) h3 дээрх textContent ашиглах
        const title = normalize(card.dataset.title || card.querySelector(".card-title")?.textContent);

        const matchCategory = selectedCategory === "all" || cat === selectedCategory;
        const matchSearch = q === "" || title.includes(q);

        const show = matchCategory && matchSearch;

        // Хэрвээ card чинь flex байвал "flex" гэж соль
        card.style.display = show ? "" : "none";
        });
    }

  // Category click
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        selectedCategory = btn.dataset.filter; // "all" | "vaksin" ...
        render();
        });
    });

  // Search input
    searchInput.addEventListener("input", (e) => {
        searchText = e.target.value;
        render();
    });

    // Initial render
    render();
     
  