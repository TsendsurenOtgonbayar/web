const buttons = document.querySelectorAll(".cat-btn");
      const cards = document.querySelectorAll(".card");

      function applyFilter(filter) {
        cards.forEach((card) => {
          const cat = card.dataset.category; // data-category
          const show = filter === "all" || cat === filter;
          card.style.display = show ? "" : "none"; // эсвэл "block" / "flex" (танаас шалтгаална)
        });
      }

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          // active class
          buttons.forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");

          // filter
          applyFilter(btn.dataset.filter);
        });
      });