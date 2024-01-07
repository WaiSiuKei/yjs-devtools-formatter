import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import checker from 'vite-plugin-checker';

export default defineConfig({
    base: './',
    resolve: {
        extensions: ['.js', '.ts', '.json', '.wasm']
    },
    plugins: [
        checker({ typescript: true }),
    ],
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, './src/index.ts')
            },
            formats: ['es', 'umd'],
            name: 'YjsFormatter',
        },
    }
});
