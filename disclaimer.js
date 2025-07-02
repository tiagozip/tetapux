(() => {
  const e = document.createElement("div");
  const i = crypto.randomUUID();
  e.innerHTML = `
    <div class="disc${i}">
      All tetapux pages are a joke and not real phishing pages.
    </div>
    <style>
      .disc${i} {
        position: fixed;
        font-family: system-ui;

        right: 5vw;
        bottom: 0px;

        max-width: 240px;
        z-index: 9999999;

        background-color: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: none;
        backdrop-filter: blur(2px);
        font-size: 12px;
        color: rgb(0, 0, 0);
        padding: 6px;
        
        text-align: right;
        pointer-events: none;
        margin-bottom: -20px;
        opacity: 0;

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        transition: opacity 0.3s ease, margin-bottom 0.3s ease, right 0.3s ease, border 0.3s ease, backdrop-filter 0.3s ease;
      }
    </style>`;

  document.body.appendChild(e);
  const disclaimer = document.querySelector(`.disc${i}`);
  setTimeout(() => {
    disclaimer.style.opacity = ".6";
    disclaimer.style.marginBottom = "0px";
  }, 200);

  setTimeout(() => {
    disclaimer.style.opacity = ".4";
    disclaimer.style.border = "1px solid rgba(0, 0, 0, 0)";
    disclaimer.style.right = "6px";
    disclaimer.style.backdropFilter = "blur(0px)";
  }, 3000);
})();
