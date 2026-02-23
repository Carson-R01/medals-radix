import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase =
  process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.includes("/")
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.CI ? repoBase : "/",
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
