import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    root: resolve(__dirname, './'),
    publicDir: resolve(__dirname, './public'),
    build: {
      outDir: resolve(__dirname, './dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png', 'sounds/*.mp3'],
        manifest: {
          name: 'Scanner Zupy',
          short_name: 'Scanner',
          description: 'Escaneie QR codes para cartões de fidelidade e cupons',
          theme_color: '#5c2d91', // Manter a cor do tema
          background_color: '#212529', // Manter a cor de fundo
          display: 'standalone',
          icons: [ // Atualizado para usar os novos ícones pwa-icon-*
            {
              src: 'icons/pwa-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/pwa-icon-256x256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: 'icons/pwa-icon-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: 'icons/pwa-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable' // Importante para ícones adaptáveis
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.zupy\.com\/api\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 horas
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  }
});