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
            return new Response("Failed to save phone number", { status: 500, headers: { 'Content-Type': 'text/plain' } });
        }
      }

      if (!path.includes(".")) {
        const rootDir = import.meta.dirname;
        const requestedPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const safePath = `${rootDir}${requestedPath}`;
        
        if (!safePath.startsWith(rootDir)) {
            return new Response("Forbidden", { status: 403 });
        }
    
        try {
            const entries = await fs.readdir(safePath, { withFileTypes: true });
            const parentPath = requestedPath.includes('/') 
                ? requestedPath.split('/').slice(0, -1).join('/') 
                : null;
    
            const directoryEntries = [];
            if (parentPath !== null && `${rootDir}${parentPath}`.startsWith(rootDir)) {
                directoryEntries.push({ 
                    name: '..',
                    isDirectory: () => true,
                    isFile: () => false
                });
            }
            directoryEntries.push(...entries);
    
            const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${requestedPath || 'Root'} - Directory Listing</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            body {
                background: #0f172a;
                color: #e2e8f0;
                font-family: 'Inter', sans-serif;
                line-height: 1.5;
                padding: 2rem 1rem;
                max-width: 800px;
                margin: 0 auto;
            }
    
            .header {
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #1e293b;
            }
    
            .header h1 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
                background: linear-gradient(45deg, #818cf8, #3b82f6);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
    
            .directory-path {
                color: #94a3b8;
                font-size: 0.875rem;
                word-break: break-all;
            }
    
            .directory-list {
                list-style: none;
                background: #1e293b;
                border-radius: 0.5rem;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
    
            .directory-item {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #334155;
                transition: all 0.2s ease;
            }
    
            .directory-item:last-child {
                border-bottom: none;
            }
    
            .directory-item:hover {
                background: #2d3748;
                padding-left: 1.25rem;
            }
    
            .directory-link {
                color: inherit;
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
    
            .directory-link::before {
                content: '';
                display: block;
                width: 1.25rem;
                height: 1.25rem;
                background-size: contain;
                flex-shrink: 0;
            }
    
            .directory-link:not([data-is-dir])::before {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23818cf8"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/></svg>');
            }
    
            .directory-link[data-is-dir]::before {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"><path d="M20 5h-8.586l-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z"/></svg>');
            }
    
            .directory-item:first-child .directory-link::before {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"/></svg>');
            }
    
            .footer {
                margin-top: 1.5rem;
                text-align: center;
                color: #64748b;
                font-size: 0.875rem;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Directory Listing</h1>
            <div class="directory-path">/${requestedPath}</div>
        </div>
        
        <ul class="directory-list">
            ${directoryEntries.map(entry => {
                const isDir = entry.isDirectory();
                const entryName = encodeURIComponent(entry.name);
                const entryPath = entry.name === '..' 
                    ? parentPath || '/' 
                    : `${requestedPath ? `${requestedPath}/` : ''}${entryName}`;
    
                return `
                <li class="directory-item">
                    <a href="${entryPath}" 
                        class="directory-link" 
                        ${isDir ? 'data-is-dir' : ''}>
                        ${entry.name}
                    </a>
                </li>`;
            }).join('')}
        </ul>
    
        <div class="footer">
            Served by Bun • ${new Date().toLocaleDateString()}
        </div>
    </body>
    </html>`;
    
            return new Response(html, { headers: { 'Content-Type': 'text/html' } });
        } catch (error) {
            if (error.code === 'ENOENT') {
                return new Response("Not Found", { status: 404 });
            }
            return new Response("Failed to read directory", { status: 500 });
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
        return new Response("Internal Server Error\n" + error.toString(), { status: 500 });
    },
});