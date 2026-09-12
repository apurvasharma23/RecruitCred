import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {
  handleBackendCreateOrder,
  handleBackendVerifyPayment,
  handleBackendWebhook,
  getBackendPaymentConfig
} from './src/server/paymentBackend';

function paymentApiPlugin() {
  return {
    name: 'payment-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/payments')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET' && pathname === '/api/payments/config') {
          const config = getBackendPaymentConfig();
          res.end(JSON.stringify({
            keyId: config.keyId,
            planPriceINR: config.planPriceINR,
            amountInPaise: config.amountInPaise,
            currency: config.currency,
            mode: config.mode,
            isRealKeysConfigured: config.isRealKeysConfigured
          }));
          return;
        }

        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              let body: any = {};
              try { body = JSON.parse(bodyStr); } catch {}

              if (pathname === '/api/payments/create-order') {
                const result = await handleBackendCreateOrder(body);
                res.writeHead(200);
                res.end(JSON.stringify(result));
                return;
              }

              if (pathname === '/api/payments/verify') {
                const result = await handleBackendVerifyPayment(body);
                res.writeHead(200);
                res.end(JSON.stringify(result));
                return;
              }

              if (pathname === '/api/payments/webhook') {
                const signature = (req.headers['x-razorpay-signature'] as string) || '';
                const result = await handleBackendWebhook(bodyStr, signature);
                res.writeHead(200);
                res.end(JSON.stringify(result));
                return;
              }

              res.writeHead(404);
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err: any) {
              console.error('[Payment API Server Error]:', err.message);
              res.writeHead(400);
              res.end(JSON.stringify({ error: err.message || 'Payment server processing error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), paymentApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) return 'charts';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
          }
        }
      }
    }
  }
});

