export function ServiceCard(props){
    const card=document.createElement("article");

    card.classList.add("card");

    card.dataset.category = props.category;
    card.dataset.title = props.title;

    card.innerHTML=`

        <div class="icon">${props.icon}</div>
        <h3>${props.name}</h3>
        <p>${props.description}</p>
        <span class="price">${props.price}</span>
        <div class="bottom">
            <span class="unelgee">⭐ ${props.rating}</span>
            <a href="${props.link}"><button>Цаг авах</button></a>
        </div>
    `;       
    return card;
}
