export default function cssChanger(fileName){
    const link =document.createElement('link');
    link.rel='stylesheet';
    link.href=`./css/${fileName}.css`;
    document.head.appendChild(link);
}