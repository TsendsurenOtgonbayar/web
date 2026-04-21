export function petCard(props){
    const petCard=document.createElement("div");
    petCard.classList.add("item-card");
    petCard.innerHTML=`
        <h3>${props.Name}</h3>
        <p><strong>Төрөл:</strong>${props.Type}</p>
        <p><strong>Нас:</strong>${props.Age.age} нас ${props.Age.month} сар. </p>
        <p><strong>Хүйс:</strong>${props.Gender}</p>
    `
    return petCard;
}
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