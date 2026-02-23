import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [react(), commonjs()],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    outDir: 'C:/built/bevferle/ui',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7076',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true
    }
  }
})
