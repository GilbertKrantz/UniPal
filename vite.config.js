import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://unipal.online/',
  plugins: [react()],
  define: {
    'process.env.IS_PREACT': JSON.stringify('true')
  }
})
