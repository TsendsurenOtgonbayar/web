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
});