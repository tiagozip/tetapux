/*
 * Tetapux Ads —— see tetapux.vercel.app
 */

class TetapuxAds extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.textContent = 'Happy phone';
        shadow.appendChild(div);
    }
}

customElements.define('tetapux-ads', TetapuxAds);