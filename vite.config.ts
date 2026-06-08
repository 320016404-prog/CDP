import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          calendario: path.resolve(__dirname, 'calendario.html'),
          clube: path.resolve(__dirname, 'clube.html'),
          contacto: path.resolve(__dirname, 'contacto.html'),
          formacao: path.resolve(__dirname, 'formacao.html'),
          galeria: path.resolve(__dirname, 'galeria.html'),
          noticias: path.resolve(__dirname, 'noticias.html'),
          plantel: path.resolve(__dirname, 'plantel.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
