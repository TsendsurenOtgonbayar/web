export function doctorCard(props){
    const doctorCard=document.createElement("article");
    doctorCard.classList.add("card");
    doctorCard.innerHTML=`
        <img src="${props.Image}" alt="${props.Name}">
        <h3>${props.Name}</h3>
        <p>${props.Specialist}</p>
        <div>${props.rating}</div>
        <span>${props.experience}</span>
    `
    return doctorCard;
}