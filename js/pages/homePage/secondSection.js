export default function secondSection(scrollAnimationData){
    return `
        <div id="scrollAnimation">
            <section class="statistic">
                ${scrollAnimationData.map(item=> `<article> <h2>${item.val}</h2> <p>${item.text}</p> </article>`).join('')}
                ${scrollAnimationData.map(item=>
                    `<article>
                        <h2>${item.val}</h2>
                        <p>${item.text}</p>
                    </article>`
                ).join('')}
            </section>
        </div>
    `
}