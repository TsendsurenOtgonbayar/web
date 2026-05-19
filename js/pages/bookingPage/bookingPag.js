import firstSection from "./firstSection.js";
import secondSection from "./secondSection.js";
import cssChanger from "../../components/pagesCSS.js";

export default function bookingPage() {
    cssChanger("booking");
    return `
    <main class="booking-page">
    <section class="booking-layout" aria-label="Цаг захиалах хэсэг">
        ${firstSection()}
        ${secondSection()}
    </section>
    </main>`;
}