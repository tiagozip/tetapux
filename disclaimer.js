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
        z-index: 999999999999999;

        background-color: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: none;
        backdrop-filter: blur(8px);
        font-size: 12px;
        color: rgb(0, 0, 0);
        padding: 6px;
        
        text-align: right;
        pointer-events: none;
        margin-bottom: -20px;
        opacity: 0;

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        transition: opacity 0.3s ease, margin-bottom 0.3s ease, right 0.3s ease, border 0.3s ease, backdrop-filter 0.3s ease, background-color 0.3s ease;
      }
    </style>`;

  document.body.appendChild(e);
  const disclaimer = document.querySelector(`.disc${i}`);
  setTimeout(() => {
    disclaimer.style.opacity = ".6";
    disclaimer.style.marginBottom = "0px";
  }, 200);

  function isBodyBackgroundDark() {
    let bgColor =
      getComputedStyle(document.body).backgroundColor || "rgb(255, 255, 255)";
    if (bgColor === "rgba(0, 0, 0, 0)") {
      bgColor = "rgb(255, 255, 255)"; // Fallback to white if transparent
    }

    // Extract RGB values from 'rgb(r, g, b)' or 'rgba(r, g, b, a)'
    const rgb = bgColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) return false; // fallback

    const r = parseInt(rgb[0], 10);
    const g = parseInt(rgb[1], 10);
    const b = parseInt(rgb[2], 10);

    // Calculate luminance according to ITU-R BT.709
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Threshold can be ~128, below means dark, above means light
    return luminance < 128;
  }
  if (isBodyBackgroundDark()) {
    disclaimer.style.color = "white";
    disclaimer.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  }
  setTimeout(() => {
    disclaimer.style.opacity = ".4";
    disclaimer.style.border = "1px solid rgba(0, 0, 0, 0)";
    disclaimer.style.right = "6px";
    disclaimer.style.backdropFilter = "blur(0px)";
    disclaimer.style.backgroundColor = "rgba(255, 255, 255, 0)";
  }, 3000);
})();
