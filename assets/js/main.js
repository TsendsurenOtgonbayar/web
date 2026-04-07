import { delElm,CountElements,addStarColor } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Main JS ажиллаж байна...");

    // 1. Идэвхтэй хуудсыг таньж цэсний өнгийг өөрчлөх (Active state)
    const currentUrl = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll("nav a, .mobile-bottom-nav a");
    
    navLinks.forEach(link => {
        // Хэрэв тухайн линкний href нь одоогийн URL-тай таарч байвал active класс өгөх
        if (link.getAttribute("href") === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // 2. Scroll Animation (Скролл хийх үед тоолуур эсвэл картууд гарч ирэх)
    const animateElements = document.querySelectorAll('.statistic, .commentKart, article');
    
    // Intersection Observer ашиглан элемент дэлгэцэнд орж ирэхийг таних
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    // CSS дээр эдгээр элементүүд анхнаасаа opacity: 0, transform: translateY(20px) байх хэрэгтэй
    animateElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });
    // comment bichih hesgiih arilgalaa
    const makeComment = document.getElementById("makeComments");
    makeComment.style.display="none";
});
document.getElementById("CommentButton").addEventListener("click",()=>{
    const makeComment = document.getElementById("makeComments");
    const commentSection=document.getElementById("commentRow");
    makeComment.style.display="flex";
    addStarColor("#UnelgeeFiveStar svg");
    makeComment.querySelector("#sentButton").addEventListener("click",()=>{
        const textArea =makeComment.querySelector("#commenText");
        const text=textArea.value;  
        if(text.length<5) return 0;
        //ene hesegt od bbutsadag function bichne
        const newArticle= document.createElement("article");
        newArticle.classList.add("commentKart");
        const fiveStar= document.createElement("div");
        fiveStar.id="UnelgeeFiveStar";
        fiveStar.innerHTML=`<svg data-value="1" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg data-value="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg data-value="3" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg data-value="4" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg data-value="5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        const commentText=document.createElement("p");
        commentText.classList.add("commentText");
        commentText.textContent=text;
        const userName=document.createElement("h3");
        userName.textContent="turshilt";
        const petName=document.createElement("p");
        petName.textContent="amitan";
        newArticle.appendChild(fiveStar);
        newArticle.appendChild(commentText);
        newArticle.appendChild(userName);
        newArticle.appendChild(petName);
        commentSection.appendChild(newArticle);
        delElm("commentRow","article");
        textArea.value="";  
        makeComment.style.display="none";
    });
}
);