import fs from 'fs/promises'
Bun.serve({
    port: 3000,

    fetch: async function (req) {
        const url = new URL(req.url);
        let path = url.pathname;
        if (path === '/') {
            path = '/index.html';
        };

        if (!path.includes(".")) {
            return new Response(`<ul>${(await fs.readdir(import.meta.dirname + path)).map((e) => {
                return `<li><a href="${path + (path.endsWith("/") ? "" : "/") + e}">${e}</a></li>`;
            })}</ul>`, {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        const file = Bun.file(import.meta.dirname + path);
        return new Response(await file.bytes(), {
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
        });
    },
});