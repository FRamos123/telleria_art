import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getMessages, type Locale } from '../i18n';

const availabilityLabel = readFileSync(new URL('./AvailabilityLabel.astro', import.meta.url), 'utf8');
const editorialImage = readFileSync(new URL('./EditorialImage.astro', import.meta.url), 'utf8');
const artworkContent = readFileSync(new URL('./ArtworkContent.astro', import.meta.url), 'utf8');
const artworkTechnicalSheet = readFileSync(new URL('./ArtworkTechnicalSheet.astro', import.meta.url), 'utf8');
const artworkCriticalTextsPath = new URL('./ArtworkCriticalTexts.astro', import.meta.url);
const artworkCardPath = new URL('./ArtworkCard.astro', import.meta.url);
const seriesDirectoryPath = new URL('./SeriesDirectory.astro', import.meta.url);
const artworkCatalogPath = new URL('./ArtworkCatalog.astro', import.meta.url);
const seriesContentPath = new URL('./SeriesContent.astro', import.meta.url);
const spanishCatalogPage = readFileSync(new URL('../pages/obras/index.astro', import.meta.url), 'utf8');
const englishCatalogPage = readFileSync(new URL('../pages/en/works/index.astro', import.meta.url), 'utf8');
const spanishArtworkPage = readFileSync(new URL('../pages/obra/[artworkId].astro', import.meta.url), 'utf8');
const englishArtworkPage = readFileSync(new URL('../pages/en/work/[artworkId].astro', import.meta.url), 'utf8');
const spanishSeriesPagePath = new URL('../pages/series/[seriesId].astro', import.meta.url);
const englishSeriesPagePath = new URL('../pages/en/series/[seriesId].astro', import.meta.url);
const readOptionalComponent = (path: URL): string => {
	try {
		return readFileSync(path, 'utf8');
	} catch {
		return '';
	}
};
const artworkCard = readOptionalComponent(artworkCardPath);
const artworkCriticalTexts = readOptionalComponent(artworkCriticalTextsPath);
const seriesDirectory = readOptionalComponent(seriesDirectoryPath);
const artworkCatalog = readOptionalComponent(artworkCatalogPath);
const seriesContent = readOptionalComponent(seriesContentPath);
const spanishSeriesPage = readOptionalComponent(spanishSeriesPagePath);
const englishSeriesPage = readOptionalComponent(englishSeriesPagePath);

const availabilityCases = [
	{ availability: 'disponible', messageKey: 'availabilityAvailable', classEntry: "disponible: 'text-primary'", es: 'Disponible', en: 'Available' },
	{ availability: 'reservada', messageKey: 'availabilityReserved', classEntry: "reservada: 'text-status-reserved'", es: 'Reservada', en: 'Reserved' },
	{ availability: 'vendida', messageKey: 'availabilitySold', classEntry: "vendida: 'text-status-sold'", es: 'Vendida', en: 'Sold' },
	{ availability: 'en colección', messageKey: 'availabilityInCollection', classEntry: "'en colección': 'text-status-collection'", es: 'En colección', en: 'In collection' },
] as const;

describe('catalog presentation components', () => {
	it('composes every required catalog field and requires a localized series', () => {
		expect(artworkContent).toContain('visibleSeries: { id: string; name: string; href: string }');
		expect(artworkContent).toContain('{translation.title}');
		expect(artworkContent).toContain('{visibleSeries.name}');
		expect(artworkContent).toContain('<InventoryBadge inventoryNumber={artwork.inventoryNumber} />');
		expect(artworkContent).toContain('<EditorialImage');
		expect(artworkContent).toContain('altText={translation.altText}');
		expect(artworkContent).toContain('<ArtworkTechnicalSheet');
		expect(artworkContent).toContain('availability={artwork.availability}');
		expect(artworkContent).toContain('support={translation.support}');
		expect(artworkContent).toContain('technique={translation.technique}');
		expect(artworkContent).toContain('heightCm={artwork.heightCm}');
		expect(artworkContent).toContain('widthCm={artwork.widthCm}');
		expect(artworkContent).toContain('year={artwork.year}');
		expect(artworkTechnicalSheet).toContain('format(heightCm)} × ${numberFormat.format(widthCm)} cm');
		expect(artworkContent).not.toContain('catalogLine');
		expect(artworkContent).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
	});

	it('renders only a non-empty workshop note from the selected translation', () => {
		expect(artworkContent).toContain('const translation = artwork.translations[locale];');
		expect(artworkContent).toContain('const workshopNote = translation.workshopNote?.trim();');
		expect(artworkContent).toContain('{workshopNote && (');
		expect(artworkContent).toContain('{workshopNote}</p>');
		expect(artworkContent).not.toContain('artwork.optional.workshopNote');
	});

	it('selects associated critical texts only when the active locale has title, body, and author', () => {
		expect(artworkContent).toContain('criticalTexts: readonly MappedCriticalText[]');
		expect(artworkContent).toContain('artwork.optional.criticalTextIds ?? []');
		expect(artworkContent).toContain('criticalTexts.flatMap((criticalText) =>');
		expect(artworkContent).toContain('criticalText.translations[locale]');
		expect(artworkContent).toContain('return title && body && author');
		expect(artworkContent).toContain('<ArtworkCriticalTexts texts={relatedCriticalTexts} locale={locale} />');
		expect(artworkContent).not.toContain('visibleCriticalTexts');
	});

	it('presents critical text title, body, and author without rendering an empty section', () => {
		expect(artworkCriticalTexts).toContain('texts.length > 0');
		expect(artworkCriticalTexts).toContain('{text.title}');
		expect(artworkCriticalTexts).toContain('{text.author}');
		expect(artworkCriticalTexts).toContain('{text.body}');
		expect(artworkCriticalTexts).toContain('messages.criticalTexts');
	});

	it.each([
		{ locale: 'es', source: spanishArtworkPage },
		{ locale: 'en', source: englishArtworkPage },
	])('passes the published $locale critical text catalog into the artwork page', ({ source }) => {
		expect(source).toContain('criticalTexts: catalog.criticalTexts');
		expect(source).toContain('criticalTexts={criticalTexts}');
	});

	it.each([
		{
			locale: 'es',
			source: spanishArtworkPage,
			canonicalPath: '`/obra/${encodeURIComponent(artwork.id)}/`',
			alternatePath: 'artwork.translations.en',
		},
		{
			locale: 'en',
			source: englishArtworkPage,
			canonicalPath: '`/en/work/${encodeURIComponent(artwork.id)}/`',
			alternatePath: 'es: `/obra/${encodeURIComponent(artwork.id)}/`',
		},
	])('sets unique localized SEO metadata for the $locale artwork route', ({ source, canonicalPath, alternatePath }) => {
		expect(source).toContain('const title =');
		expect(source).toContain('translation.title');
		expect(source).toContain('artwork.inventoryNumber');
		expect(source).toContain('locale.toUpperCase()');
		expect(source).toContain('messages.brandName');
		expect(source).toContain(canonicalPath);
		expect(source).toContain(alternatePath);
		expect(source).toContain('canonicalPath={canonicalPath}');
		expect(source).toContain('alternatePaths={alternatePaths}');
		expect(source).not.toContain('description=');
	});

	it('emits safely serialized factual VisualArtwork JSON-LD without commercial properties', () => {
		const structuredDataStart = artworkContent.indexOf('const visualArtwork = {');
		const structuredDataEnd = artworkContent.indexOf('const visualArtworkJsonLd');
		const structuredData = artworkContent.slice(structuredDataStart, structuredDataEnd);

		expect(artworkContent).toContain('<script type="application/ld+json" set:html={visualArtworkJsonLd} />');
		expect(structuredData).toContain("'@context': 'https://schema.org'");
		expect(structuredData).toContain("'@type': 'VisualArtwork'");
		expect(structuredData).toContain('translation.title');
		expect(structuredData).toContain('messages.artistName');
		expect(structuredData).toContain('artwork.inventoryNumber');
		expect(structuredData).toContain('translation.technique');
		expect(structuredData).toContain('translation.support');
		expect(structuredData).toContain('artwork.heightCm');
		expect(structuredData).toContain('artwork.widthCm');
		expect(structuredData).toContain("unitCode: 'CMT'");
		expect(structuredData).toContain('image.src');
		expect(structuredData).toContain('inLanguage: locale');
		expect(structuredData).toContain('visibleSeries.name');
		expect(structuredData).not.toMatch(/\b(?:offers|price|availability|potentialAction|purchase|product)\b/i);
		expect(artworkContent).toContain("replaceAll('<', '\\\\u003c')");
		expect(spanishArtworkPage).toContain('canonicalUrl={canonicalUrl}');
		expect(englishArtworkPage).toContain('canonicalUrl={canonicalUrl}');
		expect(spanishArtworkPage).toContain('const canonicalUrl = new URL(canonicalPath, Astro.site');
		expect(englishArtworkPage).toContain('const canonicalUrl = new URL(canonicalPath, Astro.site');
	});

	it('omits the English alternate from the Spanish artwork route when no English translation exists', () => {
		expect(spanishArtworkPage).toContain('const alternatePaths = artwork.translations.en');
		expect(spanishArtworkPage).toContain(': {};');
	});

	it('uses the design token for each textual availability state without acquisition actions', () => {
		expect(availabilityLabel).toContain("disponible: 'text-primary'");
		expect(availabilityLabel).toContain("reservada: 'text-status-reserved'");
		expect(availabilityLabel).toContain("vendida: 'text-status-sold'");
		expect(availabilityLabel).toContain("'en colección': 'text-status-collection'");
		expect(availabilityLabel).toContain('{label}');
		expect(availabilityLabel).not.toMatch(/<(?:a|button)\b/i);
	});

	it('keeps image alt and dimensions, lazy-loads by default, and allows the visible artwork image to load eagerly', () => {
		expect(editorialImage).toContain("loading?: 'lazy' | 'eager'");
		expect(editorialImage).toContain("loading = 'lazy'");
		expect(editorialImage).toContain('width={image.width}');
		expect(editorialImage).toContain('height={image.height}');
		expect(editorialImage).toContain('alt={altText.trim()}');
		expect(editorialImage).toContain('loading={loading}');
		expect(artworkContent).toContain('loading="eager"');
	});

	it.each(availabilityCases.flatMap((testCase) => ([
		{ ...testCase, locale: 'es' as const, expectedLabel: testCase.es },
		{ ...testCase, locale: 'en' as const, expectedLabel: testCase.en },
	])))('shows the localized $availability label without acquisition actions in $locale', ({
		availability,
		messageKey,
		classEntry,
		locale,
		expectedLabel,
	}) => {
		const localizedLocale: Locale = locale;
		expect(getMessages(localizedLocale)[messageKey]).toBe(expectedLabel);
		expect(availabilityLabel).toContain(classEntry);
		expect(artworkCard).toContain('<AvailabilityLabel availability={artwork.availability} locale={locale} />');
		expect(artworkCard).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir)\b/i);
	});

	it('renders a linked artwork card with only its image, title, year, and textual availability', () => {
		expect(artworkCard).toContain('EditorialImage');
		expect(artworkCard).toContain('translation?.title.trim()');
		expect(artworkCard).toContain('artwork.year');
		expect(artworkCard).toContain('href={destination}');
		expect(artworkCard).toContain('tablet:col-span-4 desktop:col-span-4');
		expect(artworkCard).toContain('focus-visible:outline-primary');
		expect(artworkCard).not.toContain('loading="eager"');
		expect(artworkCard).not.toMatch(/\b(?:inventoryNumber|technique|support|dimensions|price|precio)\b/);
	});

	it('links only the supplied visible series and does not render a catalog filter', () => {
		expect(seriesDirectory).toContain('visibleSeries');
		expect(seriesDirectory).toContain('href={series.href}');
		expect(seriesDirectory).toContain('{series.name}');
		expect(seriesDirectory).toContain('messages.series');
		expect(seriesDirectory).not.toMatch(/<(?:select|button)\b|\bfilter\b/i);
	});

	it('composes the series directory, responsive artwork grid, and localized empty state', () => {
		expect(artworkCatalog).toContain('<SeriesDirectory');
		expect(artworkCatalog).toContain('<ArtworkCard');
		expect(artworkCatalog).toContain('messages.catalogEmpty');
		expect(artworkCatalog).toContain('artworks.length === 0');
		expect(artworkCatalog).toContain('grid-cols-1');
		expect(artworkCatalog).toContain('tablet:grid-cols-8');
		expect(artworkCatalog).toContain('desktop:grid-cols-12');
	});

	it.each([
		{ locale: 'es', source: spanishCatalogPage, path: '/obras/' },
		{ locale: 'en', source: englishCatalogPage, path: '/en/works/' },
	])('selects and sorts visible $locale artworks and declares $path', ({ locale, source, path }) => {
		expect(source).toContain('sortArtworksForCatalog(');
		expect(source).toContain('catalog.artworks.filter((artwork) => artwork.translations[locale] !== undefined)');
		expect(source).toContain(`locale = '${locale}'`);
		expect(source).toContain(`canonicalPath="${path}"`);
		expect(source).toContain('alternatePaths=');
		expect(source).toContain('first.name.localeCompare(second.name, locale)');
		expect(source).toContain('first.id.localeCompare(second.id)');
	});

	it('uses the provisional localized artwork destinations from the approved plan', () => {
		expect(spanishCatalogPage).toContain('href: `/obra/${encodeURIComponent(artwork.id)}/`');
		expect(englishCatalogPage).toContain('href: `/en/work/${encodeURIComponent(artwork.id)}/`');
	});

	it.each([
		{ locale: 'es' as const, source: spanishSeriesPage, route: '/series/', catalog: '/obras/' },
		{ locale: 'en' as const, source: englishSeriesPage, route: '/en/series/', catalog: '/en/works/' },
	])('generates only visible $locale series with localized artwork cards and route alternates', ({ locale, source, route, catalog }) => {
		expect(source).toContain('getStaticPaths');
		expect(source).toContain('loadCatalogContent()');
		expect(source).toContain('series.translations[locale]');
		expect(source).toContain('sortArtworksForCatalog(');
		expect(source).toContain('artwork.seriesId === series.id');
		expect(source).toContain(`seriesPath = \`${route}\${encodeURIComponent(series.id)}/\``);
		expect(source).toContain('canonicalPath={seriesPath}');
		expect(source).toContain(`catalogHref = '${catalog}'`);
		expect(source).toContain(catalog);
		expect(source).toContain('alternatePaths=');
		expect(source).toContain('createResponsiveImage(');
	})

	it('renders a localized return link, optional series image, artwork cards, and CollectionPage JSON-LD', () => {
		expect(getMessages('es').backToCatalog).toBe('Volver al catálogo');
		expect(getMessages('en').backToCatalog).toBe('Back to works');
		expect(seriesContent).toContain('messages.backToCatalog');
		expect(seriesContent).toContain('href={catalogHref}');
		expect(seriesContent).toContain('focus-visible:outline-primary');
		expect(seriesContent).toContain('<ArtworkCard');
		expect(seriesContent).toContain('responsiveImage && seriesImage');
		expect(seriesContent).toContain('description &&');
		expect(seriesContent).toContain('application/ld+json');
		expect(seriesContent).toContain('CollectionPage');
		expect(seriesContent).toContain('ItemList');
		expect(seriesContent).toContain("artwork.translations[locale]?.title");
		expect(seriesContent).not.toMatch(/<script\b(?![^>]*type="application\/ld\+json")/i);
	})
});
