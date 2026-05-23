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
            <span><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${props.experience} жил</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg> ${props.speciality}</span>
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