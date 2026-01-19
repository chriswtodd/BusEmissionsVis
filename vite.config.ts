import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7076',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
