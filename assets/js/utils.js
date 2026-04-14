// Элемент тоолох туслах функц
export function CountElements(parentID, childType) {
  const parentElement = document.getElementById(parentID);
  if (!parentElement) {
    console.error(`ID '${parentID}'-тай элемент олдсонгүй.`);
    return 0;
  }
  const childElements = parentElement.getElementsByTagName(childType);
  return childElements.length;
}

// Хүүхдийн элементүүд 10-оос их бол хам��ийн эхнийхийг устгах функц
export function delElm(parentID, childSelector) {
  const parentElement = document.querySelector(parentID);
  if (!parentElement) {
    console.error(`ID '${parentID}'-тай элемент олдсонгүй`);
    return 0;
  }
  const children = parentElement.querySelectorAll(childSelector);
  if (children.length > 10) {
    children[0].remove();
    return 1;
  }
  return 0;
}

/**
 * Одны rating UI – од дархад filled class тавьж/арилгаж, гаднаас rating авч өгөх
 * @param {string} starsSelector - жишээ нь "#UnelgeeFiveStar svg"
 * @param {(rating:number)=>void} onChange - rating өөрчлөгдөх бүрт дуудна
 */
export function addStarColor(starsSelector, onChange) {
  const stars = document.querySelectorAll(starsSelector);
  let currentRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      currentRating = index + 1; // 1–5

      // Бүх одыг будна / будгийг арилгана
      stars.forEach((s, i) => {
        if (i < currentRating) {
          s.classList.add("filled");
        } else {
          s.classList.remove("filled");
        }
      });

      if (typeof onChange === "function") {
        onChange(currentRating); // main.js рүү rating-ийг буцааж өгнө
      }
    });
  });
}
export function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    toast.textContent = message;
    
    // Өнгө тохируулах
    if(type === 'error') toast.style.backgroundColor = '#ff4757';
    if(type === 'success') toast.style.backgroundColor = '#2ed573';

    document.body.appendChild(toast);

    // 3 секундын дараа устгах
    setTimeout(() => {
        toast.remove();
    }, 3000);
}