import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      components: path.resolve(import.meta.dirname, './src/components'),
      modules: path.resolve(import.meta.dirname, './src/modules'),
      pages: path.resolve(import.meta.dirname, './src/pages'),
      stores: path.resolve(import.meta.dirname, './src/stores'),
      constant: path.resolve(import.meta.dirname, './src/constant'),
      context: path.resolve(import.meta.dirname, './src/context'),
      App: path.resolve(import.meta.dirname, './src/App'),
      src: path.resolve(import.meta.dirname, './src'),
      scss: path.resolve(import.meta.dirname, './src/scss'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('tinymce') || id.includes('@tinymce')) {
              return 'vendor-tinymce'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n'
            }
            return 'vendor-others'
          }

          if (id.includes('/modules/Redactor/')) {
            return 'vendor-tinymce'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
