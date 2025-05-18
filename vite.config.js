import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  base: '/fknrandom',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'normalize.css': ['normalize.css'],
          vue: ['vue'],
          'vue-options-api-constants-plugin': ['vue-options-api-constants-plugin']
        }
      }
    },
    sourcemap: true
  },
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'subl'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
