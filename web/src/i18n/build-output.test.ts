import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { messages } from './index';

function readBuildPage(path: string): string {
	return readFileSync(new URL(`../../dist/${path}`, import.meta.url), 'utf8');
}

function readFirstArtworkPage(path: string): string | undefined {
	const directory = new URL(`../../dist/${path}/`, import.meta.url);
	if (!existsSync(directory)) return undefined;
	const [entry] = readdirSync(directory);
	return entry ? readBuildPage(`${path}/${entry}/index.html`) : undefined;
}

function readMetaDescription(page: string): string | undefined {
	const match = page.match(/<meta name="description" content="([^"]*)"/);
	return match ? match[1] : undefined;
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
		// Presence follows the published `siteSettings` text per language: when the approved
		// description exists only for one locale, the other catalog must stay silent (RF-20).
		const spanishCatalogDescription = readMetaDescription(spanishCatalog);
		const englishCatalogDescription = readMetaDescription(englishCatalog);
		for (const description of [spanishCatalogDescription, englishCatalogDescription]) {
			if (description !== undefined) {
				expect(description.trim().length).toBeGreaterThan(0);
			}
		}
		if (spanishCatalogDescription && englishCatalogDescription) {
			expect(spanishCatalogDescription).not.toBe(englishCatalogDescription);
		}
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

	it('emits artwork SEO descriptions only when published for each language, without fallback', () => {
		const spanishArtwork = readFirstArtworkPage('obra');
		const englishArtwork = readFirstArtworkPage('en/work');
		if (!spanishArtwork || !englishArtwork) return;

		const spanishDescription = readMetaDescription(spanishArtwork);
		const englishDescription = readMetaDescription(englishArtwork);
		for (const description of [spanishDescription, englishDescription]) {
			if (description !== undefined) {
				expect(description.trim().length).toBeGreaterThan(0);
			}
		}
		if (spanishDescription && englishDescription) {
			expect(spanishDescription).not.toBe(englishDescription);
		}
	});

	it('emits the static page sitemap with homes, both catalogs and published-language alternates', () => {
		const sitemap = readBuildPage('sitemap.xml');

		expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/obras/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/works/</loc>');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/"');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/obras/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/works/"');
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

	it('lists every published ficha and localized series page in the page and image sitemaps', () => {
		const pageLocations = parseSitemapEntries(readBuildPage('sitemap.xml')).map((entry) => entry.location);
		const imageLocations = parseSitemapEntries(readBuildPage('image-sitemap.xml')).map((entry) => entry.location);

		for (const id of publishedRouteIds('obra')) {
			expect(pageLocations).toContain(`https://telleria-art.pages.dev/obra/${id}/`);
			expect(imageLocations).toContain(`https://telleria-art.pages.dev/obra/${id}/`);
		}
		for (const id of publishedRouteIds('en/work')) {
			expect(pageLocations).toContain(`https://telleria-art.pages.dev/en/work/${id}/`);
		}
		for (const id of publishedRouteIds('series')) {
			expect(pageLocations).toContain(`https://telleria-art.pages.dev/series/${id}/`);
		}
		for (const id of publishedRouteIds('en/series')) {
			expect(pageLocations).toContain(`https://telleria-art.pages.dev/en/series/${id}/`);
		}
	});

function publishedRouteIds(directory: string): string[] {
	const directoryUrl = new URL(`../../dist/${directory}/`, import.meta.url);
	if (!existsSync(directoryUrl)) return [];
	return readdirSync(directoryUrl).sort();
}

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

	it('server-renders localized mandatory artwork fields on every emitted ficha', () => {
		for (const page of artworkFichaPages()) {
			const { locale } = page;
			const structuredData = readArtworkJsonLd(page.html);
			const unescapedHtml = page.html.replaceAll('&amp;', '&');

			expect(page.html).toContain(`<html lang="${locale}">`);
			const heading = tagsToText(/<h1\b[^>]*>([\s\S]*?)<\/h1>/u.exec(page.html)?.[1] ?? '');
			expect(heading).toBeTruthy();

			const seriesParagraph = /<p class="m-0 font-body-md[^>]*>([\s\S]*?)<\/p>/u.exec(page.html)?.[1] ?? '';
			expect(seriesParagraph).toContain(`${messages[locale].series}:`);
			expect(seriesParagraph).not.toContain(`${messages[locale === 'es' ? 'en' : 'es'].series}:`);
			expect(seriesParagraph).toMatch(/<a\b[^>]*href="\/(?:en\/)?series\/[^"]+"/u);
			expect(tagsToText(/<a\b[^>]*href="\/(?:en\/)?series\/[^"]+"[^>]*>([\s\S]*?)<\/a>/u.exec(seriesParagraph)?.[1] ?? '')).toBeTruthy();

			const image = /<img\b[^>]*>/u.exec(page.html)?.[0] ?? '';
			expect(image).toContain('loading="eager"');
			expect(image).toContain('srcset="');
			expect(image).toContain('sizes="');
			expect(image).toMatch(/\bwidth="\d+"/u);
			expect(image).toMatch(/\bheight="\d+"/u);
			expect(image).toMatch(/\bfm=webp/u);
			expect(/alt="([^"]*)"/u.exec(image)?.[1]?.trim()).toBeTruthy();
			expect(unescapedHtml).toContain(String(structuredData.image));

			const inventory = typeof structuredData.identifier === 'string' ? structuredData.identifier : '';
			expect(inventory).toMatch(/^AFT-\d{4}-\d{3}$/u);
			expect(unescapedHtml).toContain(`>${inventory}<`);
		}
	});

	it('renders every ficha technical sheet with localized labels, ordered dimensions and a localized status', () => {
		for (const page of artworkFichaPages()) {
			const { locale } = page;
			const expectation = messages[locale];
			const structuredData = readArtworkJsonLd(page.html);
			const entries = extractTechnicalSheetEntries(page.html);

			expect([...entries.keys()].sort()).toEqual([
				expectation.dimensions,
				expectation.support,
				expectation.technique,
				expectation.availability,
				expectation.year,
			].sort());
			for (const [, value] of entries) {
				expect(value).toBeTruthy();
			}

			const dimensions = entries.get(expectation.dimensions) ?? '';
			expect(dimensions).toBe(`${quantitativeValue(structuredData, 'height')} × ${quantitativeValue(structuredData, 'width')} cm`);

			const statusLabels = [
				expectation.availabilityAvailable,
				expectation.availabilityReserved,
				expectation.availabilitySold,
				expectation.availabilityInCollection,
			];
			expect(statusLabels).toContain(entries.get(expectation.availability));

			expect(page.html).toContain(`>${expectation.technicalSheet}<`);
		}
	});

	it('emits VisualArtwork structured data with only factual artwork fields', () => {
		for (const page of artworkFichaPages()) {
			const structuredData = readArtworkJsonLd(page.html);
			expect(structuredData['@context']).toBe('https://schema.org');
			expect(structuredData['@type']).toBe('VisualArtwork');
			expect(String(structuredData.name).trim()).toBeTruthy();
			expect(structuredData.dateCreated).toMatch(/^\d{4}$/u);
			expect(structuredData.inLanguage).toBe(page.locale);
			expect(String(structuredData.image)).toMatch(/\bfm=webp/u);

			const creator = structuredData.creator as Record<string, unknown> | undefined;
			expect(creator?.['@type']).toBe('Person');
			expect(creator?.name).toBe(messages[page.locale].artistName);

			const series = structuredData.isPartOf as Record<string, unknown> | undefined;
			expect(series?.['@type']).toBe('CreativeWorkSeries');
			expect(String(series?.name).trim()).toBeTruthy();

			for (const field of ['artMedium', 'artworkSurface'] as const) {
				expect(String(structuredData[field]).trim()).toBeTruthy();
			}

			expect(quantitativeValue(structuredData, 'height')).toBeGreaterThan(0);
			expect(quantitativeValue(structuredData, 'width')).toBeGreaterThan(0);

			const forbiddenCommercialKeys = /(?:offer|price|availab|potentialAction|purchase|payment|checkout|print)/iu;
			const keys: string[] = [];
			const collectKeys = (value: unknown): void => {
				if (Array.isArray(value)) return value.forEach(collectKeys);
				if (typeof value === 'object' && value !== null) {
					for (const [key, nested] of Object.entries(value)) {
						keys.push(key);
						collectKeys(nested);
					}
				}
			};
			collectKeys(structuredData);
			expect(keys.filter((key) => forbiddenCommercialKeys.test(key))).toEqual([]);
		}
	});

	it('keeps ficha HTML free of client JavaScript and commercial actions', () => {
		for (const page of artworkFichaPages()) {
			const scripts = [...page.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)];
			expect(page.html.match(/<script\b/giu) ?? []).toHaveLength(scripts.length);
			expect(scripts.length).toBeGreaterThanOrEqual(1);
			expect(scripts.every(([, attributes]) => attributes.includes('type="application/ld+json"'))).toBe(true);

			expect(page.html).not.toMatch(/<(?:button|form|input|select|textarea)\b/iu);
			expect(page.html).not.toContain('mailto:');
			for (const [, attributes] of page.html.matchAll(/<a\b([^>]*)/gu)) {
				expect(attributes).not.toMatch(/(?:checkout|cart|order|buy)/iu);
			}
		}
	});

	it('emits per-ficha metadata with canonical and alternates that exist, without cross-language fallback', () => {
		const fichas = artworkFichaPages();
		const versionsById = new Map<string, Map<string, string>>();
		for (const page of fichas) {
			const versions = versionsById.get(page.id) ?? new Map<string, string>();
			versions.set(page.locale, page.path);
			versionsById.set(page.id, versions);
		}

		for (const page of fichas) {
			const structuredData = readArtworkJsonLd(page.html);
			const inventory = typeof structuredData.identifier === 'string' ? structuredData.identifier : '';

			const title = page.html.match(/<title>([\s\S]*?)<\/title>/u)?.[1] ?? '';
			expect(title).toContain(inventory);
			expect(title).toContain(`· ${page.locale.toUpperCase()} —`);

			expect(page.html.match(/<link rel="canonical" href="([^"]*)"/u)?.[1]).toBe(
				`https://telleria-art.pages.dev/${page.path}/`,
			);

			const alternates = [...page.html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/gu)]
				.map(([, hreflang, href]) => ({ hreflang: hreflang ?? '', href: href ?? '' }));
			const expected = ['es', 'en']
				.filter((locale) => versionsById.get(page.id)?.has(locale))
				.map((locale) => ({
					hreflang: locale,
					href: `https://telleria-art.pages.dev/${versionsById.get(page.id)?.get(locale)}/`,
				}));
			const sortKey = ({ hreflang }: { hreflang: string }): string => hreflang;
			expect(alternates.sort((first, second) => sortKey(first).localeCompare(sortKey(second)))).toEqual(
				expected.sort((first, second) => sortKey(first).localeCompare(sortKey(second))),
			);
		}

		for (const [id, versions] of versionsById) {
			const descriptions = ['es', 'en']
				.filter((locale) => versions.has(locale))
				.map((locale) => readMetaDescription(readBuildPage(`${versions.get(locale)}/index.html`)));
			if (descriptions.every((description) => description !== undefined)) {
				expect(descriptions[0]).not.toBe(descriptions[1]);
			}
		}
	});

	it('renders optional editorial blocks only in their published language', () => {
		const fichas = artworkFichaPages();
		const byId = new Map(fichas.map((page) => [page.id, page]));
		for (const page of fichas) {
			for (const prose of extractOptionalProse(page.html)) {
				for (const counterpart of fichas.filter((candidate) => candidate.id === page.id && candidate.locale !== page.locale)) {
					expect(counterpart.html).not.toContain(prose);
				}
			}
		}
	});
});

function artworkFichaPages(): Array<{ id: string; path: string; html: string; locale: 'es' | 'en' }> {
	const pages: Array<{ id: string; path: string; html: string; locale: 'es' | 'en' }> = [];
	for (const [locale, directory] of [
		['es', 'obra'],
		['en', 'en/work'],
	] as const) {
		const directoryUrl = new URL(`../../dist/${directory}/`, import.meta.url);
		if (!existsSync(directoryUrl)) continue;
		for (const id of readdirSync(directoryUrl)) {
			pages.push({
				id,
				locale,
				path: `${directory}/${id}`,
				html: readBuildPage(`${directory}/${id}/index.html`),
			});
		}
	}
	return pages;
}

function readArtworkJsonLd(html: string): Record<string, unknown> {
	const script = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/iu.exec(html)?.[1];
	expect(script).toBeDefined();
	return JSON.parse(script ?? '{}') as Record<string, unknown>;
}

function extractTechnicalSheetEntries(html: string): Map<string, string> {
	const entries = new Map<string, string>();
	for (const [, label, value] of html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt><dd\b[^>]*>([\s\S]*?)<\/dd>/gu)) {
		entries.set(tagsToText(label ?? ''), tagsToText(value ?? ''));
	}
	return entries;
}

function extractOptionalProse(html: string): string[] {
	return [...html.matchAll(/<section aria-labelledby="artwork-(?:workshop-note|critical-texts)-title"[\s\S]*?<\/section>/gu)]
		.map(([section]) => tagsToText(section))
		.filter((text) => text.length > 0);
}

function quantitativeValue(structuredData: Record<string, unknown>, key: string): number {
	const value = structuredData[key] as Record<string, unknown> | undefined;
	expect(value?.['@type']).toBe('QuantitativeValue');
	expect(value?.unitCode).toBe('CMT');
	return typeof value?.value === 'number' ? value.value : NaN;
}

function tagsToText(fragment: string): string {
	return fragment
		.replaceAll(/<[^>]*>/gu, ' ')
		.replaceAll(/&amp;/gu, '&')
		.replaceAll(/&quot;/gu, '"')
		.replaceAll(/&apos;/gu, "'")
		.replaceAll(/&lt;/gu, '<')
		.replaceAll(/&gt;/gu, '>')
		.replaceAll(/\s+/gu, ' ')
		.trim();
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
