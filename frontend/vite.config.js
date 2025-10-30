import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add envPrefix to expose VITE_GOOGLE_CLIENT_ID and VITE_API_BASE_URL
  envPrefix: ['VITE_', 'GOOGLE_CLIENT_ID'],
})
