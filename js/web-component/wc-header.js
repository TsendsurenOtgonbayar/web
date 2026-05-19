import  {navData}  from "../data/nav.js";
import headerNav from "../components/headerNav.js";
class WcHeader extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.querySelector('nav').addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                this.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                const href = link.getAttribute('href');
                window.location.hash = href;
            }
        });
    }

    connectedCallback() {//component n html huudsand orj ireh uyd ajillana
        this.querySelector('nav').addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                this.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                const href = link.getAttribute('href');
                window.location.hash = href;
            }
        });
    }
    render() {
            this.innerHTML = `
            <header>
                <div id="logo">
                    <a href="index.html">
                        <div id="logo-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5 text-primary-foreground"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                        </div>
                        <span>Pet Care Clinic</span>
                    </a>
                </div>
                ${headerNav(navData)}
                <div id="log-in">
                    <a onclick="switchTab('login')"><button id="ehni-button">Нэвтрэх</button></a>
                    <a onclick="switchTab('register')"><button id="udaah-button">Бүртгүүлэх</button></a>
                </div>
            </header>`;
        }
    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }
    
}

window.customElements.define('wc-header', WcHeader);