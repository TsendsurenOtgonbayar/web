import firstSection from "./firstSection.js";
import secondSection from "./secondSection.js";
import cssChanger from "../../components/pagesCSS.js";

export default function serviceRender() {
    cssChanger("service");
    return `
    ${firstSection()}
    ${secondSection()}
    `;
}