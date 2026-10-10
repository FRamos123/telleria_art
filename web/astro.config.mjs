import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { assertUniqueSeoMetadata } from './src/domain/catalog-presentation.ts';
import { createSeoMetadataBuildGate } from './src/infrastructure/seo-metadata-build-gate.mjs';

export default defineConfig({
	site: 'https://telleria-art.pages.dev',
	output: 'static',
	integrations: [createSeoMetadataBuildGate(assertUniqueSeoMetadata)],
	vite: {
		plugins: [tailwindcss()],
	},
});
