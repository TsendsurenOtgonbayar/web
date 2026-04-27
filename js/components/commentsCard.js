export function createCommentCard(comment) {
    const article = document.createElement("article");
    article.classList.add("commentKart");

    const fiveStar = document.createElement("div");
    fiveStar.classList.add("UnelgeeFiveStar");
    fiveStar.innerHTML = `
        <svg data-value="1" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg data-value="2" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg data-value="3" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg data-value="4" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg data-value="5" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    `;

    const stars = fiveStar.querySelectorAll("svg");
    const rating = Number(comment.rating) || 0;
    stars.forEach((star, index) => {
        star.classList.toggle("filled", index < rating);
    });

    const commentText = document.createElement("p");
    commentText.classList.add("commentText");
    commentText.textContent = comment.text || "";

    const author = document.createElement("p");
    author.classList.add("commentMeta");
    author.textContent = `Бичсэн: ${comment.authorName || comment.userName || "Тодорхойгүй"}`;

    const meta = document.createElement("p");
    meta.classList.add("commentMeta");
    meta.textContent = `Огноо: ${comment.createdAt || ""}`;

    article.appendChild(fiveStar);
    article.appendChild(commentText);
    article.appendChild(author);
    article.appendChild(meta);

    return article;
}