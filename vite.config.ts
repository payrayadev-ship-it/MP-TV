import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          let pathname = urlObj.pathname.replace(/^\/api\//, '');
          if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);

          let modulePath = '';
          const possiblePaths = [
            path.resolve(__dirname, `api/${pathname}.ts`),
            path.resolve(__dirname, `api/${pathname}/index.ts`),
          ];

          for (const p of possiblePaths) {
            try {
              const fs = await import('fs');
              if (fs.existsSync(p)) {
                modulePath = p;
                break;
              }
            } catch {
              // ignore
            }
          }

          if (!modulePath) {
            return next();
          }

          // Parse query
          const query: Record<string, string> = {};
          urlObj.searchParams.forEach((val, key) => {
            query[key] = val;
          });

          // Parse body if JSON
          let body: any = null;
          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const dataStr = Buffer.concat(buffers).toString('utf-8');
            if (dataStr) {
              try {
                body = JSON.parse(dataStr);
              } catch {
                body = dataStr;
              }
            }
          }

          // Augment req object to match VercelRequest interface
          const vercelReq = Object.assign(req, {
            query,
            body,
            cookies: {},
          });

          // Load module
          const handlerModule = await server.ssrLoadModule(modulePath);
          const handler = handlerModule.default;

          if (typeof handler === 'function') {
            await handler(vercelReq, res);
          } else {
            next();
          }
        } catch (err: any) {
          console.error('[API Dev Plugin Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
