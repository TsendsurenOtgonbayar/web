export function CountElements(parentID,childType){
    const parentElement = document.getElementById(parentID);
    if(!parentElement) {
        console.error(`ID '${parentID}'-тай элемент олдсонгүй.`);
        return 0;
    }
    const childElements = parentElement.getElementsByTagName(childType);
    return childElements.length;
};
export function delElm(parentID, childSelector) {
  const parentElement = document.getElementById(parentID);
  if (!parentElement) {
    console.error(`ID '${parentID}'-тай элемент олдсонгүй`);
    return 0;
  }
  const children = parentElement.querySelectorAll(childSelector);
  if (children.length > 10) {
    const firstChild = children[0]; 
    firstChild.remove();
    return 1;
  }
  return 0;
}
export function addStarColor(StarsParentELement){
    const stars =document.querySelectorAll(StarsParentELement);
    let currentRating=0;
     stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            currentRating = index + 1; // 1-ээс 5 хүртэл
            
            // Бүх одыг шалгаж будах
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.classList.add("filled");
                } else {
                    s.classList.remove("filled");
                }
            });
        });
    });
};