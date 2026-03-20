import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const portfolio = JSON.parse(
  readFileSync(new URL('./src/content/portfolio.json', import.meta.url), 'utf8')
)

const htmlReplacements = {
  '%SITE_NAME%': portfolio.site.name,
  '%SITE_ROLE%': portfolio.site.role,
  '%SITE_TITLE%': `${portfolio.site.name} | ${portfolio.site.role}`,
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-html-content',
      transformIndexHtml(html) {
        return Object.entries(htmlReplacements).reduce(
          (output, [token, value]) => output.replaceAll(token, value),
          html
        )
      },
    },
  ],
  resolve: {
    alias: {
      'react-icons/si': fileURLToPath(
        new URL('./node_modules/react-icons/si/index.js', import.meta.url)
      ),
      'react-icons/tb': fileURLToPath(
        new URL('./node_modules/react-icons/tb/index.js', import.meta.url)
      ),
    },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
