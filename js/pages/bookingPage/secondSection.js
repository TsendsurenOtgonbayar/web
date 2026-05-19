export default function secondSection() {
    return `
    <aside class="booking-summary" aria-label="Захиалгын хураангуй">
        <div class="summary-card">
            <h2>Захиалгын хураангуй</h2>
            <dl>
                <div>
                    <dt>Үйлчилгээ</dt>
                    <dd id="c-service">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Эмч</dt>
                    <dd id="c-doctor">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Эмчийн хуваарь</dt>
                    <dd id="c-schedule">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Огноо</dt>
                    <dd id="c-date">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Цаг</dt>
                    <dd id="c-time">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Үнэ</dt>
                    <dd id="c-price">0₮</dd>
                </div>
            </dl>
            <button id="confirmBtn" class="confirm-btn" type="button">Захиалгаа батлах</button>
        </div>
        <section id="successBox" class="success-box" hidden aria-live="polite">
            <h2>Захиалга баталгаажлаа</h2>
            <p>Таны сонгосон мэдээлэл бүртгэгдлээ. Доорх мэдээллийг шалгаарай.</p>
            <dl>
                <div>
                    <dt>Үйлчилгээ</dt>
                    <dd id="s-service">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Эмч</dt>
                    <dd id="s-doctor">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Эмчийн хуваарь</dt>
                    <dd id="s-schedule">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Огноо</dt>
                    <dd id="s-date">Сонгоогүй</dd>
                </div>
                <div>
                    <dt>Цаг</dt>
                    <dd id="s-time">Сонгоогүй</dd>
                </div>
            </dl>
        </section>
    </aside>`;
}