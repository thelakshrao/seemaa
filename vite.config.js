import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4010,
  },
  // Used only by the build-time prerender step (`vite build --ssr ...`).
  // Bundle everything except React itself so Node never has to load
  // browser-oriented packages (react-icons, emailjs, ...) directly.
  ssr: {
    noExternal: true,
    external: ['react', 'react-dom'],
  },
})
