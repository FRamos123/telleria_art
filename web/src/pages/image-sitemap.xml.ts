import type { APIRoute } from 'astro';
import { createImageSitemapXml } from '../infrastructure/image-sitemap';
import { loadCatalogContent } from '../infrastructure/sanity/catalog-content';

export const GET: APIRoute = async ({ site }) => {
	const catalog = await loadCatalogContent();
	const siteUrl = site ?? new URL('https://telleria-art.pages.dev');
	const imageOptions = {
		projectId: import.meta.env.SANITY_PROJECT_ID ?? '',
		dataset: import.meta.env.SANITY_DATASET ?? '',
	};

	return new Response(createImageSitemapXml(catalog, siteUrl, imageOptions), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
