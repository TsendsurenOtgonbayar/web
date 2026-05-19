export default function thirdSection(serviceConstData,serviceDynamicData){
    return `
        <section id="serviceContent">
            <h2>Яагаад биднийг сонгох хэрэгтэй вэ?</h2>
            <p>Бид дараах үйлчилгээг танд санал болгож байна.</p>
            <section> 
                ${serviceConstData.map(item=>
                    `<article>
                        <div>
                            ${item.svg}
                        </div>
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                    </article>`
                ).join('')}
                
            </section>
            <section> 
                ${serviceDynamicData.map(item=>
                    `<article class="service-card">
                        <div>
                            ${item.svg}
                        </div>
                        <h3>${item.title}</h3>
                        <p class="nunDispley">${item.text}</p>  
                        <div class="card-detail">
                            <p>${item.hiddenText}</p>
                            <a href="${item.link}">Үйлчилгээ авах</a>
                        </div>
                    </article>`
                ).join('')}
            </section>
        </section>
    `;
}