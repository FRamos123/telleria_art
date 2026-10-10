import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readBuildPage(path: string): string {
	return readFileSync(new URL(`../../dist/${path}`, import.meta.url), 'utf8');
}

describe('static build output', () => {
	it('contains the Spanish home, English home, and bilingual 404 page', () => {
		const spanishHome = readBuildPage('index.html');
		const englishHome = readBuildPage('en/index.html');
		const notFoundPage = readBuildPage('404.html');

		expect(spanishHome).toContain('Pintor · Vigo, Galicia');
		expect(englishHome).toContain('Painter · Vigo, Galicia');
		expect(spanishHome).toContain('<link rel="canonical" href="https://telleria-art.pages.dev/">');
		expect(englishHome).toContain('<link rel="canonical" href="https://telleria-art.pages.dev/en/">');
		expect(spanishHome).toContain('hreflang="es" href="https://telleria-art.pages.dev/"');
		expect(spanishHome).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/"');
		expect(englishHome).toContain('hreflang="es" href="https://telleria-art.pages.dev/"');
		expect(englishHome).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/"');
		expect(spanishHome).toContain('href="/" lang="es"');
		expect(spanishHome).toContain('href="/en/" lang="en"');
		expect(englishHome).toContain('href="/" lang="es"');
		expect(englishHome).toContain('href="/en/" lang="en"');
		expect(notFoundPage).toContain('Página no encontrada');
		expect(notFoundPage).toContain('Page not found');
		expect(notFoundPage).toContain('href="/"');
		expect(notFoundPage).toContain('href="/en/"');
		expect(notFoundPage).not.toContain('rel="canonical"');
		expect(notFoundPage).not.toContain('rel="alternate"');
	});

	it('generates localized artwork catalogs even when a language has no visible artworks', () => {
		const spanishCatalog = readBuildPage('obras/index.html');
		const englishCatalog = readBuildPage('en/works/index.html');

		expect(spanishCatalog).toContain('<html lang="es">');
		expect(englishCatalog).toContain('<html lang="en">');
		expect(spanishCatalog).toContain('<h1');
		expect(spanishCatalog).toContain('Obras — Alejandro Fernández Tellería');
		expect(englishCatalog).toContain('Works — Alejandro Fernández Tellería');
		expect(spanishCatalog).toContain('rel="canonical" href="https://telleria-art.pages.dev/obras/"');
		expect(englishCatalog).toContain('rel="canonical" href="https://telleria-art.pages.dev/en/works/"');
		expect(spanishCatalog).toContain('hreflang="es" href="https://telleria-art.pages.dev/obras/"');
		expect(spanishCatalog).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/works/"');
		expect(englishCatalog).toContain('hreflang="es" href="https://telleria-art.pages.dev/obras/"');
		expect(englishCatalog).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/works/"');
		expect(spanishCatalog).not.toContain('<meta name="description"');
		expect(englishCatalog).not.toContain('<meta name="description"');
		for (const [catalog, emptyMessage] of [
			[spanishCatalog, 'No hay obras que mostrar en este idioma.'],
			[englishCatalog, 'There are no artworks to show in this language.'],
		] as const) {
			if (!catalog.includes('<li class="min-w-0 list-none')) {
				expect(catalog).toContain(emptyMessage);
			}
		}
		expect(spanishCatalog).not.toMatch(/<script\b/i);
		expect(englishCatalog).not.toMatch(/<script\b/i);
	});

	it('emits the static page sitemap with both catalogs and published-language alternates', () => {
		const sitemap = readBuildPage('sitemap.xml');

		expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/obras/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/works/</loc>');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/obras/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/works/"');
		expect(sitemap).not.toContain('<loc>https://telleria-art.pages.dev/</loc>');
		expect(sitemap).toContain('</urlset>');
	});

	it('emits a static image sitemap with the sitemap image namespace', () => {
		const sitemap = readBuildPage('image-sitemap.xml');

		expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
		expect(sitemap).toContain('</urlset>');
		expect(sitemap).not.toContain('<image:loc></image:loc>');
	});

	it('renders sitemap-listed public pages as static HTML and parses their JSON-LD', () => {
		const sitemap = readBuildPage('sitemap.xml');
		const entries = parseSitemapEntries(sitemap);
		const sitemapLocations = new Set(entries.map((entry) => entry.location));
		const publicPagePaths = new Set([
			'https://telleria-art.pages.dev/',
			'https://telleria-art.pages.dev/en/',
			...sitemapLocations,
		]);

		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/obras/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/en/works/');
		expect(sitemap).not.toContain('__not-published-t14__');
		expect(sitemap).not.toContain('/404.html');

		for (const location of publicPagePaths) {
			const html = readBuildPage(staticPagePath(location));
			expect(html).toContain('<main');
			const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)];
			expect(html.match(/<script\b/giu) ?? []).toHaveLength(scripts.length);
			expect(scripts.every(([, attributes]) => attributes.includes('type="application/ld+json"'))).toBe(true);

			const structuredData = scripts.map(([, , json]) => JSON.parse(json ?? ''));
			const pathname = new URL(location).pathname;
			if (/\/(?:en\/)?series\//u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'CollectionPage' });
			}
			if (/\/(?:en\/work|obra)\//u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'VisualArtwork' });
			}
		}
	});

	it('validates sitemap XML structure and restricts alternates to emitted pages', () => {
		const pageSitemap = readBuildPage('sitemap.xml');
		const imageSitemap = readBuildPage('image-sitemap.xml');
		const pageEntries = parseSitemapEntries(pageSitemap);
		const pageLocations = new Set(pageEntries.map((entry) => entry.location));
		const imageEntries = parseSitemapEntries(imageSitemap);

		assertWellFormedXml(pageSitemap, 'urlset');
		assertWellFormedXml(imageSitemap, 'urlset');
		expect(pageEntries.length).toBeGreaterThanOrEqual(2);
		expect(new Set(pageEntries.map((entry) => entry.location)).size).toBe(pageEntries.length);

		for (const entry of pageEntries) {
			expect(entry.alternates.map((alternate) => alternate.location)).toContain(entry.location);
			for (const alternate of entry.alternates) {
				expect(pageLocations).toContain(alternate.location);
				expect(new URL(alternate.location).pathname.startsWith('/en/')).toBe(alternate.locale === 'en');
				readBuildPage(staticPagePath(alternate.location));
			}
		}

		for (const entry of imageEntries) {
			expect(pageLocations).toContain(entry.location);
			expect(entry.imageLocations.length).toBeGreaterThan(0);
			for (const imageLocation of entry.imageLocations) {
				expect(imageLocation).toMatch(/^https:\/\/cdn\.sanity\.io\//u);
				expect(imageLocation).toContain('fm=webp');
			}
		}
		expect(imageSitemap).not.toContain('__not-published-t14__');
	});
});

function parseSitemapEntries(xml: string): Array<{
	location: string;
	alternates: Array<{ locale: string; location: string }>;
	imageLocations: string[];
}> {
	const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(([, block]) => block ?? '');
	expect(xml.match(/<url>/gu) ?? []).toHaveLength(blocks.length);

	return blocks.map((block) => {
		const location = block.match(/<loc>([\s\S]*?)<\/loc>/u)?.[1];
		expect(location).toBeDefined();
		const alternates = [...block.matchAll(/<xhtml:link\b[^>]*>/gu)]
			.map(([tag]) => ({
				locale: tag.match(/\bhreflang="([^"]*)"/u)?.[1] ?? '',
				location: decodeXmlAttribute(tag.match(/\bhref="([^"]*)"/u)?.[1] ?? ''),
			}));
		const imageLocations = [...block.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/gu)]
			.map(([, imageLocation]) => decodeXmlAttribute(imageLocation ?? ''));

		return {
			location: decodeXmlAttribute(location ?? ''),
			alternates,
			imageLocations,
		};
	});
}

function staticPagePath(pageUrl: string): string {
	const pathname = new URL(pageUrl).pathname;
	return pathname === '/' ? 'index.html' : `${pathname.slice(1)}index.html`;
}

function decodeXmlAttribute(value: string): string {
	return value
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&apos;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>');
}

function assertWellFormedXml(xml: string, rootName: string): void {
	expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
	expect((xml.match(new RegExp(`<${rootName}\\b`, 'gu')) ?? [])).toHaveLength(1);
	expect((xml.match(new RegExp(`<\\/${rootName}>`, 'gu')) ?? [])).toHaveLength(1);
	expect(xml.trim()).toMatch(new RegExp(`^<\\?xml[^?]*\\?>\\s*<${rootName}\\b[\\s\\S]*<\\/${rootName}>$`, 'u'));
	const tokens = xml.match(/<[^>]+>|[^<]+/gu) ?? [];
	const openElements: string[] = [];

	for (const token of tokens) {
		if (!token.startsWith('<')) {
			expect(token).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/iu);
			continue;
		}
		if (token.startsWith('<?')) continue;

		const closing = token.match(/^<\/([\w:.-]+)>$/u);
		if (closing) {
			expect(openElements.pop()).toBe(closing[1]);
			continue;
		}

		const opening = token.match(/^<([\w:.-]+)([\s\S]*?)>$/u);
		expect(opening).not.toBeNull();
		if (!opening) continue;
		const [, elementName, rawAttributes = ''] = opening;
		const selfClosing = rawAttributes.trimEnd().endsWith('/');
		const attributes = selfClosing ? rawAttributes.trimEnd().slice(0, -1) : rawAttributes;
		const attributePattern = /\s+([\w:.-]+)="([^"]*)"/gu;
		const parsedAttributes = [...attributes.matchAll(attributePattern)];
		expect(attributes.replace(attributePattern, '').trim()).toBe('');
		for (const [, , value] of parsedAttributes) {
			expect(value).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/iu);
		}
		if (!selfClosing) openElements.push(elementName ?? '');
	}

	expect(openElements).toEqual([]);
	expect(tokens.find((token) => token.startsWith('<urlset'))).toMatch(new RegExp(`^<${rootName}\\b`, 'u'));
}
