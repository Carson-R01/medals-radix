import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isCI = process.env.CI === "true";
const repoBase = "/medals-radix/";

// https://vitejs.dev/config/
export default defineConfig({
  base: isCI ? repoBase : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://medalapi-bbesdff7ftbsc3gk.northcentralus-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
      "/Country": {
        target:
          "https://medalapi-bbesdff7ftbsc3gk.northcentralus-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
      "/countries": {
        target:
          "https://medalapi-bbesdff7ftbsc3gk.northcentralus-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
