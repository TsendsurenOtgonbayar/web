export function petCard(props){
    const petCard=document.createElement("div");
    petCard.classList.add("item-card");
    petCard.innerHTML=`
            <h3>${props.Name}</h3>
            <p><strong>Төрөл:</strong>${props.type}</p>
            <p><strong>Нас:</strong>${props.age} нас ${props.month} сар. </p>
            <p><strong>Хүйс:</strong>${props.Gender}</p
    `
    return petCard;
}
