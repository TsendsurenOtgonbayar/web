export default function firstSection() {
    return `
    <section class="booking-panel" aria-label="Сонголтын хэсэг">
        <article class="booking-stage">
            <div class="stage-header">
                <h2>Үйлчилгээ сонгох</h2>
                <p>Өөрт тохирох үйлчилгээний төрлөө сонгоорой.</p>
            </div>
            <div id="serviceList" class="service-grid"></div>
        </article>
        <article class="booking-stage">
            <div class="stage-header">
                <h2>Эмч сонгох</h2>
                <p>Сонгосон үйлчилгээнд тохирох эмч нар гарч ирнэ.</p>
            </div>
            <div id="doctorList" class="choice-group" aria-live="polite"></div>
            <div id="doctorSchedule" class="doctor-schedule" aria-live="polite"></div>
        </article>
        <article class="booking-stage">
            <div class="stage-header">
                <h2>Огноо ба цаг</h2>
                <p>Хамгийн ойрын боломжтой цагийг сонгоно уу.</p>
            </div>
            <label class="date-field" for="date">
                <span>Огноо</span>
                <input id="date" type="date">
            </label>
            <div id="timeList" class="choice-group" aria-live="polite"></div>
        </article>
    </section>`;
}