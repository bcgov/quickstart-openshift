import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    port: parseInt(process.env.PORT),
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    // https://vitejs.dev/config/shared-options.html#resolve-alias
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      '~bootstrap': fileURLToPath(
        new URL('./node_modules/bootstrap', import.meta.url),
      ),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    // Dedupe React to ensure single instance (fixes React error #525)
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Force React to be pre-bundled and deduplicated
    include: ['react', 'react-dom'],
    // Exclude BCGov package from optimization (it should use peer deps)
    exclude: ['@bcgov/design-system-react-components'],
  },
  build: {
    // Build Target
    // https://vitejs.dev/config/build-options.html#build-target
    target: 'esnext',
    // Minify option
    // https://vitejs.dev/config/build-options.html#build-minify
    minify: 'esbuild',
    // Rollup Options
    // https://vitejs.dev/config/build-options.html#build-rollupoptions
    rollupOptions: {
      output: {
        manualChunks: {
          // Split external library from transpiled code.
          react: ['react', 'react-dom'],
          axios: ['axios'],
        },
      },
      // Explicitly externalize React to prevent bundling
      external: (id) => {
        // Don't externalize our own code
        if (id.startsWith('.') || id.startsWith('/')) return false
        // Externalize React - it should come from node_modules
        if (id === 'react' || id === 'react-dom' || id.startsWith('react/') || id.startsWith('react-dom/')) {
          return false // Let Vite handle React bundling
        }
        return false
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings caused by Bootstrap SCSS
        // which is out of our control.
        silenceDeprecations: [
          'mixed-decls',
          'color-functions',
          'global-builtin',
          'import',
        ],
      },
    },
  },
})
