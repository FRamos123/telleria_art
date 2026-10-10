import type { Locale } from '../i18n';

type SitemapEntity = {
	id: string;
	translations: Partial<Record<Locale, unknown>>;
};

type SitemapContent = {
	artworks: readonly SitemapEntity[];
	series: readonly SitemapEntity[];
};

type SitemapPage = {
	path: string;
	alternates: Partial<Record<Locale, string>>;
};

const locales: readonly Locale[] = ['es', 'en'];

export function createSitemapXml(content: SitemapContent, siteUrl: URL): string {
	const pages: SitemapPage[] = [];
	addLocalizedPages(pages, { es: '/obras/', en: '/en/works/' });
	addEntityPages(pages, content.series, (id, locale) =>
		locale === 'es' ? `/series/${id}/` : `/en/series/${id}/`,
	);
	addEntityPages(pages, content.artworks, (id, locale) =>
		locale === 'es' ? `/obra/${id}/` : `/en/work/${id}/`,
	);

	const urls = pages
		.sort((first, second) => first.path.localeCompare(second.path))
		.map(({ path, alternates }) => {
			const alternateLinks = locales
				.flatMap((locale) => {
					const alternatePath = alternates[locale];
					return alternatePath
						? [`    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(new URL(alternatePath, siteUrl).href)}" />`]
						: [];
				})
				.join('\n');

			return [
				'  <url>',
				`    <loc>${escapeXml(new URL(path, siteUrl).href)}</loc>`,
				alternateLinks,
				'  </url>',
			].filter(Boolean).join('\n');
		})
		.join('\n');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		urls,
		'</urlset>',
	].filter(Boolean).join('\n');
}

function addLocalizedPages(pages: SitemapPage[], paths: Partial<Record<Locale, string>>): void {
	for (const locale of locales) {
		const path = paths[locale];
		if (path) pages.push({ path, alternates: paths });
	}
}

function addEntityPages(
	pages: SitemapPage[],
	entities: readonly SitemapEntity[],
	pathFor: (id: string, locale: Locale) => string,
): void {
	for (const entity of entities) {
		const paths: Partial<Record<Locale, string>> = {};
		for (const locale of locales) {
			if (entity.translations[locale] !== undefined && entity.translations[locale] !== null) {
				paths[locale] = pathFor(encodeURIComponent(entity.id), locale);
			}
		}
		addLocalizedPages(pages, paths);
	}
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
