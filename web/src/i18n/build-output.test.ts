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

function readMetaTitle(page: string): string | undefined {
	return page.match(/<title>([\s\S]*?)<\/title>/u)?.[1];
}

describe('static build output', () => {
	it('contains the Spanish home, English home, and bilingual 404 page', () => {
		const spanishHome = readBuildPage('index.html');
		const englishHome = readBuildPage('en/index.html');
		const notFoundPage = readBuildPage('404.html');

		expect(spanishHome).toContain('Pintor · Vigo, Galicia');
		expect(englishHome).toContain('Painter · Vigo, Galicia');
		expect(spanishHome).toContain('href="#main-content"');
		expect(englishHome).toContain('href="#main-content"');
		expect(spanishHome).toContain('id="main-content"');
		expect(englishHome).toContain('id="main-content"');
		expect(spanishHome).toContain('Saltar al contenido principal');
		expect(englishHome).toContain('Skip to main content');
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

	it('emits localized home navigation, complete artwork cards, unique metadata, and WebPage JSON-LD', () => {
		const siteUrl = 'https://telleria-art.pages.dev';
		const sitemapEntries = parseSitemapEntries(readBuildPage('sitemap.xml'));
		const sitemapLocations = new Set(sitemapEntries.map((entry) => entry.location));
		const homes = [
			{
				locale: 'es' as const,
				path: '/',
				htmlPath: 'index.html',
				catalogPath: '/obras/',
				worksPath: '/obras/',
				exhibitionsPath: '/exposiciones/',
				criticalTextsPath: '/textos-criticos/',
				contactPath: '/contacto/',
				artworkPathPrefix: '/obra/',
				alternatePaths: { es: '/', en: '/en/' },
			},
			{
				locale: 'en' as const,
				path: '/en/',
				htmlPath: 'en/index.html',
				catalogPath: '/en/works/',
				worksPath: '/en/works/',
				exhibitionsPath: '/en/exhibitions/',
				criticalTextsPath: '/en/critical-texts/',
				contactPath: '/en/contact/',
				artworkPathPrefix: '/en/work/',
				alternatePaths: { es: '/', en: '/en/' },
			},
		] as const;
		const pageUrl = (path: string): string => new URL(path, siteUrl).href;
		const outputPath = (path: string): string => staticPagePath(pageUrl(path));
		const outputExists = (path: string): boolean =>
			existsSync(new URL(`../../dist/${outputPath(path)}`, import.meta.url));
		const publicLocations = new Set([
			...sitemapLocations,
			pageUrl('/'),
			pageUrl('/en/'),
		]);

		for (const home of homes) {
			const expectation = messages[home.locale];
			const canonicalUrl = pageUrl(home.path);
			const html = readBuildPage(home.htmlPath);
			const homeTitle = readMetaTitle(html);
			const homeDescription = readMetaDescription(html);
			const catalogHtml = outputExists(home.catalogPath)
				? readBuildPage(outputPath(home.catalogPath))
				: '';

			expect(sitemapLocations).toContain(canonicalUrl);
			expect(html).toContain(`<html lang="${home.locale}">`);
			expect(html).toContain(`<title>${expectation.homeTitle}</title>`);
			expect(homeDescription).toBe(expectation.homeDescription);
			expect(html).toContain(`rel="canonical" href="${canonicalUrl}"`);
			expect(homeTitle).toBe(expectation.homeTitle);
			expect(homeDescription?.trim()).toBeTruthy();
			expect(html).toContain(expectation.artistName);
			expect(html).toContain(expectation.artistIdentification);

			const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gu)]
				.map(([, locale, href]) => ({ locale: locale ?? '', href: href ?? '' }))
				.sort((first, second) => first.locale.localeCompare(second.locale));
			const expectedAlternates = [
				{ locale: 'en', href: pageUrl(home.alternatePaths.en) },
				{ locale: 'es', href: pageUrl(home.alternatePaths.es) },
			].sort((first, second) => first.locale.localeCompare(second.locale));
			expect(alternates).toEqual(expectedAlternates);

			const structuredData = readJsonLd(html);
			expect(structuredData).toMatchObject({
				'@context': 'https://schema.org',
				'@type': 'WebPage',
				url: canonicalUrl,
				name: expectation.homeTitle,
				description: expectation.homeDescription,
				inLanguage: home.locale,
			});
			const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)];
			expect(scripts).toHaveLength(1);
			expect(scripts[0]?.[1]).toContain('type="application/ld+json"');

			const navigation = /<nav\b([^>]*)>([\s\S]*?)<\/nav>/u.exec(html);
			const navigationLabel = navigation?.[1]?.match(/\baria-label="([^"]+)"/u)?.[1];
			const navigationLinks = [...(navigation?.[2] ?? '').matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gu)]
				.map(([, href, label]) => ({ href: href ?? '', label: tagsToText(label ?? '') }));
			const expectedNavigationLinks: Array<{ href: string; label: string }> = [];
			if (outputExists(home.worksPath)) {
				expectedNavigationLinks.push({ href: home.worksPath, label: expectation.homeWorksLink });
				if (catalogHtml.includes('id="series-directory"')) {
					expectedNavigationLinks.push({
						href: `${home.worksPath}#series-directory`,
						label: expectation.homeSeriesLink,
					});
				}
			}
			if (outputExists(home.exhibitionsPath)) {
				expectedNavigationLinks.push({ href: home.exhibitionsPath, label: expectation.homeExhibitionsLink });
			}
			if (outputExists(home.contactPath)) {
				expectedNavigationLinks.push({ href: home.contactPath, label: expectation.homeContactLink });
			}
			if (expectedNavigationLinks.length > 0) {
				expect(navigationLabel).toBe(expectation.homeNavigationLabel);
			} else {
				expect(navigation).toBeNull();
			}
			expect(navigationLinks).toEqual(expectedNavigationLinks);

			for (const link of navigationLinks) {
				const [pathname = '', fragment] = link.href.split('#');
				expect(outputExists(pathname)).toBe(true);
				const target = readBuildPage(outputPath(pathname));
				if (fragment) expect(target).toContain(`id="${fragment}"`);
			}

			const hasSelectionSection = html.includes('aria-labelledby="home-artwork-selection-heading"');
			const artworkArticles = [...html.matchAll(/<article\b[^>]*>\s*<figure\b[\s\S]*?<\/article>/gu)]
				.map(([article]) => article ?? '');
			const artworkCount = artworkArticles.length;
			const availabilityLabels = [
				expectation.availabilityAvailable,
				expectation.availabilityReserved,
				expectation.availabilitySold,
				expectation.availabilityInCollection,
			];
			expect(artworkCount).toBeLessThanOrEqual(3);
			if (artworkCount === 0) {
				expect(hasSelectionSection).toBe(false);
			} else {
				expect(hasSelectionSection).toBe(true);
				expect(html).toContain(expectation.homeArtworkSelectionTitle);
			}

			for (const [index, feature] of artworkArticles.entries()) {
				const featureImage = /<img\b[^>]*>/u.exec(feature)?.[0] ?? '';
				const featureWorkPath = /<h3\b[^>]*>[\s\S]*?<a\b[^>]*href="([^"]+)"/u.exec(feature)?.[1] ?? '';
				const featureSeriesPath = [...feature.matchAll(/href="([^"]+)"/gu)]
					.map(([, href]) => href ?? '')
					.find((href) => href.includes('/series/')) ?? '';
				const featureTitle = /<h3\b[^>]*>\s*<a\b[^>]*>([\s\S]*?)<\/a>/u.exec(feature)?.[1] ?? '';
				const statusMatches = [...feature.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gu)]
					.map(([, text]) => tagsToText(text ?? ''));
				expect(featureWorkPath.startsWith(home.artworkPathPrefix)).toBe(true);
				expect(outputExists(featureWorkPath)).toBe(true);
				expect(sitemapLocations).toContain(pageUrl(featureWorkPath));
				expect(featureSeriesPath).toContain('/series/');
				expect(outputExists(featureSeriesPath)).toBe(true);
				expect(featureImage).toContain('srcset="');
				expect(featureImage).toContain('sizes="');
				expect(featureImage).toContain('fm=webp');
				expect(featureImage).toMatch(/\bwidth="\d+"/u);
				expect(featureImage).toMatch(/\bheight="\d+"/u);
				expect(featureImage.match(/\balt="([^"]*)"/u)?.[1]?.trim()).toBeTruthy();
				for (const label of [
					expectation.technique,
					expectation.support,
					expectation.dimensions,
					expectation.availability,
					expectation.homeArtworkDetailAction,
				]) {
					expect(feature).toContain(label);
				}
				if (outputExists(home.contactPath)) {
					expect(feature).toContain(expectation.contactArtworkAction);
					expect(feature).toContain(`${home.contactPath}?artwork=`);
				}
				expect(availabilityLabels.filter((label) => statusMatches.includes(label))).toHaveLength(1);
				if (index % 2 === 1) {
					expect(feature).toContain('desktop:order-2 desktop:col-span-7');
					expect(feature).toContain('desktop:order-1 desktop:col-span-5');
				} else {
					expect(feature).not.toContain('desktop:order-2');
					expect(feature).not.toContain('desktop:order-1');
				}
				const detail = readBuildPage(outputPath(featureWorkPath));
				const artworkData = readArtworkJsonLd(detail);
				expect(tagsToText(featureTitle)).toBe(String(artworkData.name));
				expect(statusMatches).toContain(String(artworkData.identifier));
			}

			const exhibitionsBlock = /<section\b[^>]*aria-labelledby="home-exhibitions-title"[^>]*>[\s\S]*?<\/section>/u.exec(html)?.[0];
			const homeExhibitionLinks = [...(exhibitionsBlock ?? '').matchAll(/<a\b[^>]*href="([^"]+)"/gu)]
				.map(([, href]) => href ?? '');
			expect(homeExhibitionLinks.length).toBeLessThanOrEqual(3);
			for (const href of homeExhibitionLinks) expect(outputExists(href)).toBe(true);

			const contactBlock = /<section\b[^>]*aria-labelledby="home-contact-title"[^>]*>[\s\S]*?<\/section>/u.exec(html)?.[0];
			if (outputExists(home.contactPath)) {
				expect(contactBlock).toBeDefined();
				expect(contactBlock).toContain(expectation.homeContactTitle);
				expect(contactBlock).toContain(`href="${home.contactPath}"`);
			} else {
				expect(contactBlock).toBeUndefined();
			}

			for (const otherLocation of publicLocations) {
				if (otherLocation === canonicalUrl) continue;
				const otherHtml = readBuildPage(staticPagePath(otherLocation));
				expect(readMetaTitle(otherHtml)).not.toBe(homeTitle);
				const otherDescription = readMetaDescription(otherHtml);
				if (otherDescription !== undefined) expect(otherDescription).not.toBe(homeDescription);
			}
		}
	});

	it('preloads only home fonts and reserves the first selected artwork image', () => {
		const expectedFonts = [
			'/fonts/bodoni-moda-400-latin.woff2',
			'/fonts/geist-latin.woff2',
			'/fonts/newsreader-400-latin.woff2',
		].sort();
		for (const path of ['index.html', 'en/index.html']) {
			const html = readBuildPage(path);
			const fontPreloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"[^>]*>/gu)]
				.map(([, href]) => href ?? '')
				.sort();
			expect(fontPreloads).toEqual(expectedFonts);

			const artworkArticles = [...html.matchAll(/<article\b[^>]*>\s*<figure\b[\s\S]*?<\/article>/gu)]
				.map(([article]) => article ?? '');
			for (const [index, article] of artworkArticles.entries()) {
				const image = /<img\b[^>]*>/u.exec(article)?.[0] ?? '';
				const figure = /<figure\b[^>]*>/u.exec(article)?.[0] ?? '';
				expect(image).toContain(index === 0 ? 'loading="eager"' : 'loading="lazy"');
				const width = image.match(/\bwidth="(\d+)"/u)?.[1];
				const height = image.match(/\bheight="(\d+)"/u)?.[1];
				expect(width).toBeDefined();
				expect(height).toBeDefined();
				expect(figure).toMatch(new RegExp(`style="[^"]*aspect-ratio:\\s*${width}\\s*\\/\\s*${height}`, 'u'));
			}
		}

		for (const path of ['obras/index.html', 'en/works/index.html']) {
			const catalog = readBuildPage(path);
			for (const font of expectedFonts) expect(catalog).not.toContain(`rel="preload" href="${font}"`);
			const cardList = /<ul class="m-0 grid list-none[\s\S]*?<\/ul>/u.exec(catalog)?.[0] ?? '';
			const cardImages = [...cardList.matchAll(/<img\b[^>]*>/gu)].map(([image]) => image ?? '');
			for (const [index, image] of cardImages.entries()) {
				expect(image).toContain(index < 3 ? 'loading="eager"' : 'loading="lazy"');
			}
		}
	});

	it('generates localized artwork catalogs even when a language has no visible artworks', () => {
		const spanishCatalog = readBuildPage('obras/index.html');
		const englishCatalog = readBuildPage('en/works/index.html');

		expect(spanishCatalog).toContain('<html lang="es">');
		expect(englishCatalog).toContain('<html lang="en">');
		expect(spanishCatalog).toContain('<h1');
		expect(spanishCatalog).toContain('Obras — Alex Tellería');
		expect(englishCatalog).toContain('Works — Alex Tellería');
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

	 it('generates localized exhibition indexes with unique metadata and published alternates', () => {
		const spanishIndex = readBuildPage('exposiciones/index.html');
		const englishIndex = readBuildPage('en/exhibitions/index.html');

		expect(spanishIndex).toContain('<html lang="es">');
		expect(englishIndex).toContain('<html lang="en">');
		expect(spanishIndex).toContain(`<title>${messages.es.exhibitionsTitle}</title>`);
		expect(englishIndex).toContain(`<title>${messages.en.exhibitionsTitle}</title>`);
		expect(readMetaDescription(spanishIndex)).toBe(messages.es.exhibitionsMetaDescription);
		expect(readMetaDescription(englishIndex)).toBe(messages.en.exhibitionsMetaDescription);
		expect(spanishIndex).toContain('rel="canonical" href="https://telleria-art.pages.dev/exposiciones/"');
		expect(englishIndex).toContain('rel="canonical" href="https://telleria-art.pages.dev/en/exhibitions/"');
		expect(spanishIndex).toContain('hreflang="es" href="https://telleria-art.pages.dev/exposiciones/"');
		expect(spanishIndex).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/exhibitions/"');
		expect(englishIndex).toContain('hreflang="es" href="https://telleria-art.pages.dev/exposiciones/"');
		expect(englishIndex).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/exhibitions/"');
		expect(spanishIndex).toContain('<h1');
		expect(englishIndex).toContain('<h1');
		expect(spanishIndex).not.toMatch(/<script\b/i);
		expect(englishIndex).not.toMatch(/<script\b/i);

		for (const [index, emptyMessage] of [
			[spanishIndex, messages.es.exhibitionsEmpty],
			[englishIndex, messages.en.exhibitionsEmpty],
		] as const) {
			if (!index.includes('<li')) expect(index).toContain(emptyMessage);
		}
	});

	it('renders the localized contact draft as static HTML with accessible fields and sending disabled', () => {
		const spanishPage = readBuildPage('contacto/index.html');
		const englishPage = readBuildPage('en/contact/index.html');

		for (const [page, locale, title, description, canonical, alternate] of [
			[
				spanishPage,
				'es',
				messages.es.contactTitle,
				messages.es.contactMetaDescription,
				'https://telleria-art.pages.dev/contacto/',
				'https://telleria-art.pages.dev/en/contact/',
			],
			[
				englishPage,
				'en',
				messages.en.contactTitle,
				messages.en.contactMetaDescription,
				'https://telleria-art.pages.dev/en/contact/',
				'https://telleria-art.pages.dev/contacto/',
			],
		] as const) {
			expect(page).toContain(`<html lang="${locale}">`);
			for (const font of [
				'/fonts/bodoni-moda-400-latin.woff2',
				'/fonts/newsreader-400-latin.woff2',
				'/fonts/geist-latin.woff2',
			]) {
				expect(page).toContain(`rel="preload" href="${font}" as="font"`);
			}
			expect(page).toContain(`<title>${title}</title>`);
			expect(page).toContain(messages[locale].contactPageHeading);
			expect(readMetaDescription(page)).toBe(description);
			expect(page).toContain(`rel="canonical" href="${canonical}"`);
			expect(page).toContain(`rel="alternate" hreflang="${locale === 'es' ? 'en' : 'es'}" href="${alternate}"`);
			expect(page).toContain('id="contact-form"');
			expect(page.indexOf('id="contact-privacy-notice"')).toBeLessThan(page.indexOf('id="contact-form"'));
			expect(page).toContain(messages[locale].contactFormHeading);
			expect(page).toContain(`mailto:${messages[locale].contactEmailAddress}`);
			expect(page).toContain('name="name"');
			expect(page).toContain('name="email"');
			expect(page).toContain('name="institution"');
			expect(page).toContain('name="phone"');
			expect(page).toContain('name="artworkId"');
			expect(page).toContain('name="message"');
			expect(page).not.toContain('name="consent"');
			expect(page).not.toContain('contactConsentRequired');
			expect(page).toContain('id="contact-privacy-notice"');
			expect(page).toContain(messages[locale].contactPrivacyNoticeTitle);
			expect(page).toContain(messages[locale].contactPrivacyRights);
			expect(page).not.toMatch(/<(?:a|button)[^>]*>[^<]*(?:comprar|buy|purchase|checkout|reservar|price|precio)/iu);
			expect(page).not.toMatch(/BORRADOR|DRAFT|PENDIENTE DE APROBACIÓN|PENDING APPROVAL|\[(?:Confirmar|Confirm)/u);
			expect(page).not.toContain('contact-form-draft-status');
			expect(page).not.toContain('contactFormDraftOnly');
		}
	})

	it('projects only localized contact artwork options from the deployed artwork index', () => {
		const index = JSON.parse(readBuildPage('contact-artworks.json')) as Record<'es' | 'en', string[]>;
		const pages = [
			{ page: readBuildPage('contacto/index.html'), locale: 'es' as const },
			{ page: readBuildPage('en/contact/index.html'), locale: 'en' as const },
		];

		for (const { page, locale } of pages) {
			const optionIds = [...page.matchAll(/<option value="([^"]+)"/gu)]
				.map(([, id]) => id ?? '')
				.filter(Boolean);
			expect(optionIds).toEqual(index[locale]);
		}
	})

	it('generates localized critical-text indexes with functional metadata and published alternates', () => {
		const spanishIndex = readBuildPage('textos-criticos/index.html');
		const englishIndex = readBuildPage('en/critical-texts/index.html');

		expect(spanishIndex).toContain('<html lang="es">');
		expect(englishIndex).toContain('<html lang="en">');
		expect(spanishIndex).toContain(`<title>${messages.es.criticalTextsTitle}</title>`);
		expect(englishIndex).toContain(`<title>${messages.en.criticalTextsTitle}</title>`);
		expect(readMetaDescription(spanishIndex)).toBe(messages.es.criticalTextsMetaDescription);
		expect(readMetaDescription(englishIndex)).toBe(messages.en.criticalTextsMetaDescription);
		expect(spanishIndex).toContain('rel="canonical" href="https://telleria-art.pages.dev/textos-criticos/"');
		expect(englishIndex).toContain('rel="canonical" href="https://telleria-art.pages.dev/en/critical-texts/"');
		expect(spanishIndex).toContain('hreflang="es" href="https://telleria-art.pages.dev/textos-criticos/"');
		expect(spanishIndex).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/critical-texts/"');
		expect(englishIndex).toContain('hreflang="es" href="https://telleria-art.pages.dev/textos-criticos/"');
		expect(englishIndex).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/critical-texts/"');
		expect(spanishIndex).toContain('<h1');
		expect(englishIndex).toContain('<h1');
		expect(spanishIndex).not.toMatch(/<script\b/i);
		expect(englishIndex).not.toMatch(/<script\b/i);

		for (const [index, emptyMessage] of [
			[spanishIndex, messages.es.criticalTextsEmpty],
			[englishIndex, messages.en.criticalTextsEmpty],
		] as const) {
			if (!index.includes('<li')) expect(index).toContain(emptyMessage);
		}
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
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/contacto/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/contact/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/exposiciones/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/exhibitions/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/textos-criticos/</loc>');
		expect(sitemap).toContain('<loc>https://telleria-art.pages.dev/en/critical-texts/</loc>');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/"');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/obras/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/works/"');
		expect(sitemap).toContain('hreflang="es" href="https://telleria-art.pages.dev/contacto/"');
		expect(sitemap).toContain('hreflang="en" href="https://telleria-art.pages.dev/en/contact/"');
		expect(sitemap).toContain('</urlset>');
	});

	it('emits a static image sitemap with the sitemap image namespace', () => {
		const sitemap = readBuildPage('image-sitemap.xml');

		expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
		expect(sitemap).toContain('</urlset>');
		expect(sitemap).not.toContain('<image:loc></image:loc>');
	});

	it('ships local WOFF2 files and OFL notices for every design font family', () => {
		const assetDirectory = new URL('../../dist/_astro/', import.meta.url);
		const stylesheets = readdirSync(assetDirectory)
			.filter((file) => file.endsWith('.css'))
			.map((file) => readFileSync(new URL(`../../dist/_astro/${file}`, import.meta.url), 'utf8'));
		const css = stylesheets.join('\n');
		const fontUrls = [...css.matchAll(/url\((?:"|')?(\/fonts\/[^)"']+\.woff2)(?:"|')?\)/gu)]
			.map(([, url]) => url ?? '');

		expect(css).toContain('font-display:swap');
		for (const family of ['Bodoni Moda', 'Newsreader', 'Geist']) expect(css).toContain(family);
		expect(fontUrls).toHaveLength(10);
		expect(css).not.toMatch(/fonts\.(?:googleapis|gstatic)\.com/iu);
		for (const url of fontUrls) {
			const path = url.replace(/^\/+/, '');
			expect(readFileSync(new URL(`../../dist/${path}`, import.meta.url)).byteLength).toBeGreaterThan(0);
		}

		for (const file of ['OFL-Bodoni-Moda.txt', 'OFL-Newsreader.txt', 'OFL-Geist.txt']) {
			const license = readBuildPage(`fonts/licenses/${file}`);
			expect(license).toContain('SIL OPEN FONT LICENSE');
		}
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
		const editorialDetailPages = [
			...publishedDetailPages('exposiciones'),
			...publishedDetailPages('en/exhibitions'),
			...publishedDetailPages('textos-criticos'),
			...publishedDetailPages('en/critical-texts'),
		];

		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/obras/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/en/works/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/exposiciones/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/en/exhibitions/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/textos-criticos/');
		expect(sitemapLocations).toContain('https://telleria-art.pages.dev/en/critical-texts/');
		for (const page of editorialDetailPages) {
			expect(sitemapLocations).toContain(`https://telleria-art.pages.dev${page.path}`);
		}
		expect(sitemap).not.toContain('__not-published-t14__');
		expect(sitemap).not.toContain('/404.html');

		for (const location of publicPagePaths) {
			const html = readBuildPage(staticPagePath(location));
			expect(html).toContain('<main');
			const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)];
			expect(html.match(/<script\b/giu) ?? []).toHaveLength(scripts.length);
			const structuredDataScripts = scripts.filter(([, attributes]) => attributes.includes('type="application/ld+json"'));
			const clientScripts = scripts.filter(([, attributes]) => attributes.includes('type="module"'));
			const pathname = new URL(location).pathname;
			const isContactPage = /\/(?:en\/contact|contacto)\/$/u.test(pathname);
			const isArtworkPage = /\/(?:en\/work|obra)\/[^/]+\/$/u.test(pathname);
			expect(clientScripts).toHaveLength(isContactPage || isArtworkPage ? 1 : 0);
			expect(scripts).toHaveLength(structuredDataScripts.length + clientScripts.length);

			const structuredData = structuredDataScripts.map(([, , json]) => JSON.parse(json ?? ''));
			if (/\/(?:en\/)?series\//u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'CollectionPage' });
			}
			if (/\/(?:en\/work|obra)\//u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'VisualArtwork' });
			}
			if (/\/(?:en\/exhibitions|exposiciones)\/[^/]+\/$/u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'Event' });
			}
			if (/\/(?:en\/critical-texts|textos-criticos)\/[^/]+\/$/u.test(pathname)) {
				expect(structuredData).toHaveLength(1);
				expect(structuredData[0]).toMatchObject({ '@context': 'https://schema.org', '@type': 'Article' });
			}
		}
	});

	it('renders published editorial details with complete content, localized metadata, and visible relations', () => {
		const sitemapLocations = new Set(parseSitemapEntries(readBuildPage('sitemap.xml')).map((entry) => entry.location));
		const imageLocations = new Set(parseSitemapEntries(readBuildPage('image-sitemap.xml')).map((entry) => entry.location));
		const criticalTextPages = [
			...publishedDetailPages('textos-criticos'),
			...publishedDetailPages('en/critical-texts'),
		];
		const exhibitionPages = [
			...publishedDetailPages('exposiciones'),
			...publishedDetailPages('en/exhibitions'),
		];

		for (const page of criticalTextPages) {
			const data = readJsonLd(page.html);
			const body = String(data.articleBody ?? '');
			const description = tagsToText(readMetaDescription(page.html) ?? '');
			const visibleBody = tagsToText(
				/<div class="whitespace-pre-line[^"]*">([\s\S]*?)<\/div>/u.exec(page.html)?.[1] ?? '',
			);

			expect(data).toMatchObject({
				'@context': 'https://schema.org',
				'@type': 'Article',
				inLanguage: page.locale,
			});
			expect(String(data.headline).trim()).toBeTruthy();
			expect(body.trim()).toBeTruthy();
			expect(typeof data.author).toBe('string');
			expect(visibleBody.replaceAll(/\s+/gu, ' ').trim()).toBe(body.replaceAll(/\s+/gu, ' ').trim());
			if (description) {
				expect(Array.from(description).length).toBeLessThanOrEqual(155);
				expect(body.startsWith(description)).toBe(true);
			}
			expect(sitemapLocations).toContain(`https://telleria-art.pages.dev${page.path}`);
			for (const relation of (Array.isArray(data.about) ? data.about : [])) {
				expect(sitemapLocations).toContain(String((relation as Record<string, unknown>).url));
			}
		}

		for (const page of exhibitionPages) {
			const data = readJsonLd(page.html);
			const image = /<img\b[^>]*>/u.exec(page.html)?.[0];

			expect(data).toMatchObject({
				'@context': 'https://schema.org',
				'@type': 'Event',
				inLanguage: page.locale,
			});
			expect(String(data.name).trim()).toBeTruthy();
			expect(String((data.location as Record<string, unknown> | undefined)?.name).trim()).toBeTruthy();
			expect(data.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
			expect(sitemapLocations).toContain(`https://telleria-art.pages.dev${page.path}`);
			if (image) {
				expect(imageLocations).toContain(`https://telleria-art.pages.dev${page.path}`);
				expect(image).toMatch(/\bwidth="\d+"/u);
				expect(image).toMatch(/\bheight="\d+"/u);
				expect(image).toMatch(/\bsrcset="/u);
				expect(image).toMatch(/\balt="[^"]+"/u);
			} else {
				expect(imageLocations).not.toContain(`https://telleria-art.pages.dev${page.path}`);
			}
			for (const property of ['workFeatured', 'about'] as const) {
				for (const relation of (Array.isArray(data[property]) ? data[property] : [])) {
					expect(sitemapLocations).toContain(String((relation as Record<string, unknown>).url));
				}
			}
		}
	});

	it('links an artwork critical-text title to the emitted same-language detail and keeps its body', () => {
		const detailPages = [
			...publishedDetailPages('textos-criticos'),
			...publishedDetailPages('en/critical-texts'),
		];
		const detailsByPath = new Map(detailPages.map((page) => [page.path, page]));

		for (const artworkPage of artworkFichaPages()) {
			const section = /<section aria-labelledby="artwork-critical-texts-title"[\s\S]*?<\/section>/u.exec(artworkPage.html)?.[0];
			if (!section) continue;

			const links = [...section.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gu)];
			expect(links.length).toBeGreaterThan(0);
			for (const [, href, linkedTitle] of links) {
				const detailPath = href ?? '';
				expect(detailPath.startsWith(artworkPage.locale === 'es' ? '/textos-criticos/' : '/en/critical-texts/')).toBe(true);
				const detailPage = detailsByPath.get(detailPath);
				expect(detailPage).toBeDefined();
				if (!detailPage) continue;

				const data = readJsonLd(detailPage.html);
				expect(tagsToText(linkedTitle ?? '')).toBe(String(data.headline));
				expect(tagsToText(section)).toContain(tagsToText(String(data.author)));
				expect(section).toContain(escapeHtmlText(String(data.articleBody)));
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

function publishedDetailPages(directory: string): Array<{
	id: string;
	locale: 'es' | 'en';
	path: string;
	html: string;
}> {
	const directoryUrl = new URL(`../../dist/${directory}/`, import.meta.url);
	if (!existsSync(directoryUrl)) return [];
	return readdirSync(directoryUrl, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => ({
			id: entry.name,
			locale: directory.startsWith('en/') ? 'en' as const : 'es' as const,
			path: `/${directory}/${entry.name}/`,
			html: readBuildPage(`${directory}/${entry.name}/index.html`),
		}));
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
			expect(dimensions).toBe(`${quantitativeValue(structuredData, 'height')} × ${quantitativeValue(structuredData, 'width')} ${expectation.centimeterUnit}`);
			expect((structuredData.height as Record<string, unknown>).unitText).toBe(expectation.centimeterUnit);
			expect((structuredData.width as Record<string, unknown>).unitText).toBe(expectation.centimeterUnit);

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

	it('renders the interactive examination viewer and darkroom modal on every ficha while keeping it free of commercial actions', () => {
		for (const page of artworkFichaPages()) {
			const expectation = messages[page.locale];
			const scripts = [...page.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/giu)];
			expect(page.html.match(/<script\b/giu) ?? []).toHaveLength(scripts.length);
			const structuredDataScripts = scripts.filter(([, attributes]) => attributes.includes('type="application/ld+json"'));
			const clientScripts = scripts.filter(([, attributes]) => attributes.includes('type="module"'));
			expect(structuredDataScripts).toHaveLength(1);
			expect(clientScripts).toHaveLength(1);

			expect(page.html).toContain('id="darkroom-modal"');
			expect(page.html).toContain('role="dialog"');
			expect(page.html).toContain('aria-modal="true"');
			expect(page.html).toContain('data-open-darkroom');
			expect(page.html).toContain('data-cite-artwork');
			expect(page.html).toContain('data-darkroom-minimap-rect');
			expect(page.html).toContain(expectation.artworkOpenDarkroom);
			expect(page.html).toContain(expectation.artworkCloseDarkroom);
			expect(page.html).toContain(expectation.artworkCiteAction);
			expect(page.html).toContain(expectation.artworkViewerLightGallery);
			expect(page.html).toContain(expectation.artworkViewerLightRaking);
			expect(page.html).toContain(expectation.artworkViewerGrid);
			expect(page.html).not.toContain('data-viewer-toggle-frame');
			expect(page.html).not.toContain('data-darkroom-toggle-frame');

			expect(page.html).not.toMatch(/<(?:form|input|select|textarea)\b/iu);
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

function readJsonLd(html: string): Record<string, unknown> {
	const script = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/iu.exec(html)?.[1];
	expect(script).toBeDefined();
	return JSON.parse(script ?? '{}') as Record<string, unknown>;
}

function escapeHtmlText(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
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
