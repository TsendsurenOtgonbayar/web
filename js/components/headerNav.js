export default function headerNav(navData) {
    return `
        <nav>
            ${navData.map(item => `<a href="${item.href}">${item.val}</a>`).join('')}
        </nav>
    `
}