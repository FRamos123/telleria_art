import type { APIRoute } from 'astro';
import { loadCatalogContent } from '../infrastructure/sanity/catalog-content';
import { createSitemapXml } from '../infrastructure/sitemap';

export const GET: APIRoute = async ({ site }) => {
	const catalog = await loadCatalogContent();
	const siteUrl = site ?? new URL('https://telleria-art.pages.dev');

	return new Response(createSitemapXml(catalog, siteUrl), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
