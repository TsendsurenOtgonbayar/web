import firstSection from "./firstSection.js";
import secondSection from "./secondSection.js";
import cssChanger from "../../components/pagesCSS.js";

export default function contactPage() {
    cssChanger("contact");
    return `
    <main class="contact-page">
        ${firstSection()}
        ${secondSection()}
    </main>`;
}