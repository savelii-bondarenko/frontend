import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
    {
        ignores: ['dist/**'],
    },
    {
        files: ['src/**/*.js'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.browser,
        },
    },
]);
