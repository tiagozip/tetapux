/*
 * Tetapux Ads —— see tetapux.vercel.app
 */

(function () {
    const API_ENDPOINT = window.TETAPUXADS_API_ENDPOINT || "https://cdn.jsdelivr.net/gh/tiagorangel1/tetapux/ads/ads.json";
    let ads;

    class TetapuxAds extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const div = document.createElement('div');
            div.innerHTML = `
                <style>
                    a {
                        display: block;
                        text-decoration: none;
                        color: inherit;
                    }
                    .ad-container {
                        display: flex;
                        border: 1.5px solid rgba(0, 0, 0, 0.05);
                        position: relative;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                        border-radius: 8px;
                        gap: 15px;
                        width: fit-content;
                        max-width: 100%;
                        transition: transform 0.2s;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
                    }
                    .ad-container:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                    .ad-container:active {
                        transform: scale(0.99);
                    }
                    .ad-container:focus, .ad-container:active {
                        outline: 2px solid black;
                    }
                    .ad-container img {
                        width: 80px;
                        height: 80px;
                        border-radius: 8px;
                        object-fit: cover;
                    }
                    .ad-container div {
                        text-align: center;
                        margin-top: 10px;
                        padding-right: 50px;
                    }
                    .ad-container h4 {
                        margin: 0;
                        margin-bottom: 5px;
                        font-weight: 600;
                    }
                    .ad-container p {
                        margin: 0;
                        font-size: .95rem;
                    }
                    .credit {
                        position: absolute;
                        bottom: 5px;
                        right: 5px;
                        color: black;
                        font-size: 12px;
                        text-decoration: underline;
                    }
                    @media (min-width: 400px) {
                        .ad-container {
                            flex-direction: row;
                        }
                        .ad-container div {
                            text-align: left;
                            margin-top: 0;
                        }
                    }
                </style>
                <a target="_blank" href="#" rel="nofollow noopener">
                    <div class="ad-container">
                        <img class="cover" alt="Ad cover" loading="lazy">
                        <div>
                            <h4>Loading...</h4>
                            <p></p>
                            <a class="credit" href="https://tetapux.vercel.app/ads" target="_blank">FOSS ads</a>
                        </div>
                    </div>
                </a>`;
            shadow.appendChild(div);

            const wai = setInterval(() => {
                if (!ads) {
                    return;
                }

                clearInterval(wai);

                const randomAd = ads[Math.floor(Math.random() * ads.length)];
                shadow.querySelector('a').href = randomAd.url;
                shadow.querySelector('img').src = randomAd.img;
                shadow.querySelector('h4').innerText = randomAd.title;
                shadow.querySelector('p').innerText = randomAd.alt;
            }, 100);
        }
    }

    customElements.define('tetapux-ads', TetapuxAds);

    fetch(API_ENDPOINT).then(async (response) => {
        ads = await response.json();
    });
})();
