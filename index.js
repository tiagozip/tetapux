import fs from 'fs/promises';

Bun.serve({
  port: 3000,

  async fetch(req) {
    try {
      const url = new URL(req.url);
      let path = url.pathname;

      if (path === '/') {
        path = '/index.html';
      }

      if (path === "/collect-phone") {
        const phone = url.searchParams.get("phone");
        
        if (!phone) {
            return new Response("Phone number is required", { status: 400, headers: { 'Content-Type': 'text/plain' } });
        }
        
        if (!/^\+?[0-9\s\-]+$/.test(phone.trim())) {
             return new Response("Invalid phone number format", { status: 400, headers: { 'Content-Type': 'text/plain' } });
        }

        try {
          await fs.appendFile(import.meta.dirname + "/.data/phone.txt", phone.trim() + "\n");
          return new Response("OK", { headers: { 'Content-Type': 'text/plain' } });
        } catch (error) {
            console.error("Error writing to file:", error); // Log the error
            return new Response("Failed to save phone number", { status: 500, headers: { 'Content-Type': 'text/plain' } });
        }
      }

      if (!path.includes(".")) {
        const safePath = import.meta.dirname + path;
        if (!safePath.startsWith(import.meta.dirname)) {
          return new Response("Forbidden", { status: 403, headers: { 'Content-Type': 'text/plain' } });
        }
          try {
            const entries = await fs.readdir(safePath, { withFileTypes: true });
            const htmlListItems = entries.map((entry) => {
              const entryPath = path + (path.endsWith("/") ? "" : "/") + entry.name;
              const isDir = entry.isDirectory();
              const linkText = entry.name + (isDir ? "/" : "");
              return `<li><a href="${entryPath}">${linkText}</a></li>`;
            }).join("");

            return new Response(`<ul>${htmlListItems}</ul>`, { headers: { 'Content-Type': 'text/html' } });
          } catch (error) {
            if (error.code === 'ENOENT') {
              return new Response("Not Found", { status: 404, headers: { 'Content-Type': 'text/plain' } });
            }
             return new Response("Failed to read directory", { status: 500, headers: { 'Content-Type': 'text/plain' } });
          }
      }

      const filePath = import.meta.dirname + path;
      if (!filePath.startsWith(import.meta.dirname)) {
        return new Response("Forbidden", { status: 403, headers: { 'Content-Type': 'text/plain' } });
      }
      try {
          const file = Bun.file(filePath);
          if (!(await file.exists())) {
              return new Response("File Not Found", { status: 404, headers: { 'Content-Type': 'text/plain' } });
          }
          return new Response(file, {
              headers: { 'Content-Type': file.type || 'application/octet-stream' },
          });

      } catch (error) {
        return new Response("Failed to serve file", { status: 500, headers: { 'Content-Type': 'text/plain' } });
      }
    } catch (error) {
      return new Response("Internal Server Error", { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
  },
   error(error) {
        console.error("Server error:", error);
        return new Response("Internal Server Error\n" + error.toString(), { status: 500 });
    },
});