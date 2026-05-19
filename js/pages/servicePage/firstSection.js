export default function firstSection() {
    return `<section class="filters-section">
    <h1>Үйлчилгээнүүд</h1>
    <p>Бидний үзүүлж буй мэргэжлийн үйлчилгээнүүд</p>
    <div class="filters">
      <label for="search-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input id="search-logo" type="text" placeholder="Үйлчилгээний нэр хайх...">
      </label>
      <div>
        <button class="cat-btn is-active" data-filter="all">Бүгд</button>
        <button class="cat-btn" data-filter="uzleg">Үзлэг</button>
        <button class="cat-btn" data-filter="vaccin">Вакцин</button>
        <button class="cat-btn" data-filter="mes-zasal">Мэс засал</button>
        <button class="cat-btn" data-filter="onshilgoo">Оншилгоо</button>
        <button class="cat-btn" data-filter="aris-vs">Арьс үс</button>
      </div>
      </div>
    </div>
  </section>`;
}