import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  base: '/fknrandom',
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              test: /node_modules\/canvas-confetti/,
              name: 'canvas-confetti'
            },
            {
              test: /node_modules\/normalize.css/,
              name: 'normalize'
            },
            {
              test: /node_modules\/vue-options-api-constants-plugin/,
              name: 'vue-options-api-constants-plugin'
            },
            {
              test: /node_modules\/vue/,
              name: 'vue'
            },
            {
              test: /node_modules/,
              name: 'lib'
            },
            {
              test: /index\.js/,
              name: 'index'
            }
          ]
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
