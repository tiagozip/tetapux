import fs from 'fs/promises';
import path from 'path';

Bun.serve({
    port: 3000,
    fetch: async (req) => {
        try {
            const url = new URL(req.url);
            let filePath = url.pathname;

            filePath = path.normalize(filePath);
            if (filePath.startsWith('..') || path.isAbsolute(filePath)) {
                return new Response('Forbidden', { status: 403 });
            }

            if (filePath === '/') {
                filePath = '/index.html';
            }

            if (filePath === "/collect-phone") {
                const phone = url.searchParams.get("phone");
                if (phone && /^\d+$/.test(phone.trim())) {
                    await fs.appendFile(path.join(import.meta.dirname, ".data/phone.txt"), phone.trim() + "\n");
                    return new Response("OK", { headers: { 'Content-Type': 'text/plain' } });
                } else {
                    return new Response("Invalid phone number", { status: 400 });
                }
            }

            if (!filePath.includes(".")) {
                const directoryPath = path.join(import.meta.dirname, filePath);
                const files = await fs.readdir(directoryPath);
                const listItems = files.map(file => `<li><a href="${filePath}${filePath.endsWith('/') ? '' : '/'}${file}">${file}</a></li>`);
                return new Response(`<ul>${listItems.join('')}</ul>`, { headers: { 'Content-Type': 'text/html' } });
            }

            const file = Bun.file(path.join(import.meta.dirname, filePath));
            return new Response(await file.arrayBuffer(), {
                headers: { 'Content-Type': file.type || 'application/octet-stream' },
            });

        } catch (error) {
            return new Response('Internal Server Error', { status: 500 });
        }
    },
});
