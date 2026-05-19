export default function firstSection(statisticData) {
    return `
       <section>
            <div class="hero">
                <!-- zuun taliin textuud -->
                <div class="hero-left">
                    <h1>Бидний тухай</h1>
                    <p><strong>Манай жижиг амьтны эмнэлэг</strong> нь 2012 онд байгуулагдсан бөгөөд Монголын анхны жижиг амьтанд зориулсан мэргэжлийн эмнэлгүүдийн нэг юм. Бид нохой, муур, туулай зэрэг гэрийн тэжээвэр амьтдад ерөнхий үзлэг, вакцинжуулалт, мэс засал, лабораторийн шинжилгээ зэрэг өргөн хүрээний үйлчилгээ үзүүлдэг. </p>
                    <p>Манай эмнэлэг БНСУ, Япон улсын тоног төхөөрөмжөөр бүрэн тоноглогдсон, олон улсын стандартад нийцсэн орчинд үйл ажиллагаа явуулдаг.</p>
                    <div class="stats">
                        ${statisticData.map(item=>
                            `<div class="stat">
                                <h2 class="stat-number">${item.val}</h2>
                                <span>${item.text}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>    
                <!-- baruun taliin zurag -->
                <div class="hero-right">
                    <img src="./access/clinic.png" alt="Эмнэлэг зураг">
                </div>
            </div>
        </section>
    `
}