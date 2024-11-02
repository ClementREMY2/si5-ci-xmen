import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/orders': {
        target: 'http://localhost:3005',
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/orders/, '/orders'), 
      },
    },
  },
});
