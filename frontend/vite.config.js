import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    fs: {
      allow: [
        // Utilisez des chemins absolus
        path.resolve(__dirname, 'node_modules/font-awesome'),
        path.resolve(__dirname, 'src'),
      ],
    },
  },
})