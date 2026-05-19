export function DoctorCard(props){
    const card=document.createElement("article");
    card.classList.add("card");
    card.innerHTML=`
        <div class="doctor-header">
            <img src="${props.image}" alt="${props.name}" class="avatar">
            <div class"doctor-def">
                <h3>${props.name}</h3>
                <p>${props.type}</p>
            </div>
        </div>
         <div class="star-rating-display">
            ${generateStars(props.rating)}
        </div>

        <div class="info">
            <span>⏱ ${props.experience} жил</span>
            <span>🏅 ${props.speciality}</span>
        </div>
    `
    return card;
}

function generateStars(rating) {
    let stars = "";

    for (let i = 0; i < 5; i++) {
        stars += `<svg viewBox="0 0 24 24" fill="${i < rating ? "gold" : "gray"}">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>`;
    }

    return stars;
}