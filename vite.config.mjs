import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('@fortawesome')) {
              if (id.includes('free-solid-svg-icons')) return 'vendor-fa-solid'
              if (id.includes('free-brands-svg-icons')) return 'vendor-fa-brands'
              if (id.includes('free-regular-svg-icons')) return 'vendor-fa-regular'
              return 'vendor-fa-core'
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n'
            }
            return 'vendor-others'
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
