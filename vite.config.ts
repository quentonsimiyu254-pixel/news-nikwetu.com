import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Force base to root to prevent 404s on nested routes or mobile testing
    base: '/',
    
    server: {
      port: 3000,
      host: '0.0.0.0', // Accessible on your local network
      strictPort: false,
      hmr: {
        // Helps with HMR stability when using host 0.0.0.0
        clientPort: 3000,
      },
    },

    plugins: [
      react(),
      tailwindcss(),
    ],

    // Global constant replacements
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        // Standardizing the alias to the 'src' directory is safer for imports
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Ensures the output is compatible with older browsers
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
    },
  };
});