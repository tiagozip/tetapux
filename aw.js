(() => {
	const SUPABASE_PROJECT_URL =
		window.TETAPUXADS_SUPABASE_PROJECT_URL ||
		"https://lfbdhntyamptnrquwbcy.supabase.co";
	const SUPABASE_KEY =
		window.TETAPUX_SUPABASE_KEY ||
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYmRobnR5YW1wdG5ycXV3YmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTczMTMsImV4cCI6MjA1NTQ3MzMxM30.HjGKnHepNoBu4o-GPAyFfO7T4vLFUs-RWMHRHzXOkQo";
	let ads;

	class TetapuxAds extends HTMLElement {
		constructor() {
			super();
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const vertical = this.getAttribute("vertical") !== null;
			const width = this.getAttribute("width") || "auto";
			const height = this.getAttribute("height") || "auto";

			div.innerHTML = `${this.getAttribute("inject") || ""}
<style>
  * {box-sizing: border-box;}

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }
  
  .a-container {
    user-select: none;
    cursor: pointer;
    display: none;
    border: 1.5px solid var(--teta-border, rgba(0, 0, 0, 0.05));
    position: relative;
    flex-direction: ${vertical ? "column" : "row"};
    align-items: center;
    ${vertical ? "justify-content: center;" : ""}
    padding: 10px;
    border-radius: 12px;
    gap: 15px;
    width: ${width};
    height: ${height};
    max-width: 100%;
    transition: transform 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    padding-right: 50px;
    max-width: 100vw;
    color: var(--teta-foreground, black)
  }
  .a-container:hover {
    background-color: var(--teta-hover-background, rgba(0, 0, 0, 0.05));
  }
  .a-container:active {
    transform: scale(0.99);
  }
  .a-container:focus, .a-container:active {
    outline: 2px solid var(--teta-foreground, black);
  }
  
  .a-container img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
  }
  
  .a-container div {
    text-align: ${vertical ? "center" : "left"};
    margin-top: ${vertical ? "10px" : "0"};
  }
  
  .a-container h4 {
    margin: 0;
    margin-bottom: 5px;
    font-weight: 600;
  }
  
  .a-container p {
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
</style>
<div class="a-container">
  <img class="cover" alt="Ad cover" loading="lazy">
  <div>
    <h4>Loading...</h4>
    <p></p>
    <a class="credit" href="https://tiagorangel1.github.io/tetapux/ads" target="_blank">Tetapux</a>
  </div>
</div>`;
			shadow.appendChild(div);

			let currentAdUrl = null;

			const reload = () => {
				const wai = setInterval(() => {
					if (!ads) {
						return;
					}

					clearInterval(wai);

					shadow.querySelector(".a-container").style.display = "flex";

					const randomAd = ads[Math.floor(Math.random() * ads.length)];
					currentAdUrl = randomAd.link;

					shadow
						.querySelector(".a-container")
						.addEventListener("click", (e) => {
							if (e.target.href) return;
							window.open(currentAdUrl, "_blank");
						});

					shadow.querySelector("img").src = randomAd.logo;
					shadow.querySelector("h4").innerText = randomAd.title;
					shadow.querySelector("p").innerText = randomAd.alt;

					setTimeout(reload, 30000);
				}, 100);
			};

			reload();
		}
	}

	customElements.define("tetapux-ads", TetapuxAds);

	fetch(`${SUPABASE_PROJECT_URL}/rest/v1/ads?select=*&published=eq.true`, {
		headers: {
			apikey: SUPABASE_KEY,
			Authorization: `Bearer ${SUPABASE_KEY}`,
		},
	}).then(async (response) => {
		ads = await response.json();
	});
})();
