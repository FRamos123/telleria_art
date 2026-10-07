import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://telleria-art.pages.dev',
	output: 'static',
	vite: {
		plugins: [tailwindcss()],
	},
});
