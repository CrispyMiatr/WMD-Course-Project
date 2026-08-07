import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            // This manually maps your tilde aliases to the absolute paths
            '~': path.resolve(__dirname, './resources/js'),
            '~assets': path.resolve(__dirname, './resources/assets'),
            '~styles': path.resolve(__dirname, './resources/css'),
            '~types': path.resolve(__dirname, './resources/types'),
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/main.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
        },
        cors: {
            origin: '*',
        },
    },
});