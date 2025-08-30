import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy, _options) => {
          // Handle backend connection errors gracefully
          proxy.on('error', (err: any, _req: any, res: any) => {
            console.warn('API proxy error (backend not available):', err.message);
            
            // Only send response if headers haven't been sent yet
            if (res && res.writeHead && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              });
              res.end(JSON.stringify({ 
                error: 'Backend service unavailable',
                code: 'ECONNREFUSED',
                message: 'The backend server is not running on port 8787. Please start it with: npm run dev:backend',
                suggestion: 'Run both servers with: npm run dev'
              }));
            }
          });

          // Handle successful proxy requests
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            // Add CORS headers to all proxied responses
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization';
          });
        }
      }
    }
  },
  envPrefix: 'VITE_'
})
