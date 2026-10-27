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
const homeNavigationPath = new URL('./HomeNavigation.astro', import.meta.url);
const homeArtworkSelectionPath = new URL('./HomeArtworkSelection.astro', import.meta.url);
const homeArtworkFeaturePath = new URL('./HomeArtworkFeature.astro', import.meta.url);
const artworkCatalogPath = new URL('./ArtworkCatalog.astro', import.meta.url);
const seriesContentPath = new URL('./SeriesContent.astro', import.meta.url);
const spanishCatalogPage = readFileSync(new URL('../pages/obras/index.astro', import.meta.url), 'utf8');
const englishCatalogPage = readFileSync(new URL('../pages/en/works/index.astro', import.meta.url), 'utf8');
const spanishArtworkPage = readFileSync(new URL('../pages/obra/[artworkId].astro', import.meta.url), 'utf8');
const englishArtworkPage = readFileSync(new URL('../pages/en/work/[artworkId].astro', import.meta.url), 'utf8');
const spanishSeriesPagePath = new URL('../pages/series/[seriesId].astro', import.meta.url);
const englishSeriesPagePath = new URL('../pages/en/series/[seriesId].astro', import.meta.url);
const exhibitionIndexPath = new URL('./ExhibitionIndex.astro', import.meta.url);
const spanishHomePage = readFileSync(new URL('../pages/index.astro', import.meta.url), 'utf8');
const englishHomePage = readFileSync(new URL('../pages/en/index.astro', import.meta.url), 'utf8');
const spanishExhibitionIndexPagePath = new URL('../pages/exposiciones/index.astro', import.meta.url);
const englishExhibitionIndexPagePath = new URL('../pages/en/exhibitions/index.astro', import.meta.url);
const criticalTextIndexPath = new URL('./CriticalTextIndex.astro', import.meta.url);
const spanishCriticalTextIndexPagePath = new URL('../pages/textos-criticos/index.astro', import.meta.url);
const englishCriticalTextIndexPagePath = new URL('../pages/en/critical-texts/index.astro', import.meta.url);
const criticalTextContentPath = new URL('./CriticalTextContent.astro', import.meta.url);
const spanishCriticalTextPagePath = new URL('../pages/textos-criticos/[criticalTextId].astro', import.meta.url);
const englishCriticalTextPagePath = new URL('../pages/en/critical-texts/[criticalTextId].astro', import.meta.url);
const baseLayoutPath = new URL('../layouts/BaseLayout.astro', import.meta.url);
const siteFooterPath = new URL('./SiteFooter.astro', import.meta.url);
const contactFormPath = new URL('./ContactForm.astro', import.meta.url);
const spanishContactPage = readFileSync(new URL('../pages/contacto.astro', import.meta.url), 'utf8');
const englishContactPage = readFileSync(new URL('../pages/en/contact.astro', import.meta.url), 'utf8');
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
const homeNavigation = readOptionalComponent(homeNavigationPath);
const homeArtworkSelection = readOptionalComponent(homeArtworkSelectionPath);
const homeArtworkFeature = readOptionalComponent(homeArtworkFeaturePath);
const artworkCatalog = readOptionalComponent(artworkCatalogPath);
const seriesContent = readOptionalComponent(seriesContentPath);
const spanishSeriesPage = readOptionalComponent(spanishSeriesPagePath);
const englishSeriesPage = readOptionalComponent(englishSeriesPagePath);
const exhibitionIndex = readOptionalComponent(exhibitionIndexPath);
const spanishExhibitionIndexPage = readOptionalComponent(spanishExhibitionIndexPagePath);
const englishExhibitionIndexPage = readOptionalComponent(englishExhibitionIndexPagePath);
const criticalTextIndex = readOptionalComponent(criticalTextIndexPath);
const spanishCriticalTextIndexPage = readOptionalComponent(spanishCriticalTextIndexPagePath);
const englishCriticalTextIndexPage = readOptionalComponent(englishCriticalTextIndexPagePath);
const criticalTextContent = readOptionalComponent(criticalTextContentPath);
const spanishCriticalTextPage = readOptionalComponent(spanishCriticalTextPagePath);
const englishCriticalTextPage = readOptionalComponent(englishCriticalTextPagePath);
const baseLayout = readOptionalComponent(baseLayoutPath);
const siteFooter = readOptionalComponent(siteFooterPath);
const contactForm = readOptionalComponent(contactFormPath);

const availabilityCases = [
	{ availability: 'disponible', messageKey: 'availabilityAvailable', classEntry: "disponible: 'text-primary'", es: 'Disponible', en: 'Available' },
	{ availability: 'reservada', messageKey: 'availabilityReserved', classEntry: "reservada: 'text-status-reserved'", es: 'Reservada', en: 'Reserved' },
	{ availability: 'vendida', messageKey: 'availabilitySold', classEntry: "vendida: 'text-status-sold'", es: 'Vendida', en: 'Sold' },
	{ availability: 'en colección', messageKey: 'availabilityInCollection', classEntry: "'en colección': 'text-status-collection'", es: 'En colección', en: 'In collection' },
] as const;

describe('catalog presentation components', () => {
	it.each([
		{
			locale: 'es',
			source: spanishHomePage,
			worksRoute: './obras/index.astro',
			exhibitionsRoute: './exposiciones/index.astro',
			contactRoute: './contacto.astro',
			canonicalPath: 'canonicalPath="/"',
			artworkPath: '`/obra/${encodeURIComponent(artwork.id)}/`',
		},
		{
			locale: 'en',
			source: englishHomePage,
			worksRoute: './works/index.astro',
			exhibitionsRoute: './exhibitions/index.astro',
			contactRoute: './contact.astro',
			canonicalPath: 'canonicalPath="/en/"',
			artworkPath: '`/en/work/${encodeURIComponent(artwork.id)}/`',
		},
	])('prepares the published $locale home with only eligible localized destinations', ({
		locale,
		source,
		worksRoute,
		exhibitionsRoute,
		contactRoute,
		canonicalPath,
		artworkPath,
	}) => {
		expect(source).toContain(`const locale = '${locale}' as const;`);
		expect(source).toContain('await loadCatalogContent()');
		expect(source).toContain(`'${worksRoute}'`);
		expect(source).toContain(`'${exhibitionsRoute}'`);
		expect(source).toContain(`'${contactRoute}'`);
		expect(source).toContain('Object.hasOwn(localizedRouteModules');
		expect(source).toContain('catalog.series.some((series) => series.translations[locale] !== undefined)');
		expect(source).toContain('generatedArtworkIds');
		expect(source).toContain('artwork.translations[locale]');
		expect(source).toContain('translation.title.trim()');
		expect(source).toContain('isValidAlternativeText(translation.altText, translation.title)');
		expect(source).toContain('isAvailability(artwork.availability)');
		expect(source).toContain('selectRecentHomeArtworks(eligibleArtworks)');
		expect(source).toContain('createResponsiveImage(artwork.mainImage.projection, imageOptions)');
		expect(source).toContain(artworkPath);
		expect(source).not.toContain('<HomeNavigation');
		expect(source).toContain('<HomeArtworkSelection locale={locale} cards={cards} />');
		expect(source).toContain('<HomeContactSection locale={locale} hasContactRoute={hasContactRoute} />');
		expect(source).toContain("'@type': 'WebPage'");
		expect(source).toContain('url: canonicalUrl');
		expect(source).toContain('name: messages.homeTitle');
		expect(source).toContain('description: messages.homeDescription');
		expect(source).toContain('inLanguage: locale');
		expect(source).toContain(canonicalPath);
		expect(source).toContain('messages.artistName');
		expect(source).toContain('messages.artistIdentification');
	});

	it('renders exhibition entries in the 12-column retrospective archive layout with localized fields, optional image/relations, and an empty message', () => {
		expect(exhibitionIndex).toContain('entries.length > 0');
		expect(exhibitionIndex).toContain('{messages.exhibitionsEmpty}');
		expect(exhibitionIndex).toContain('{messages.exhibitionVenue}');
		expect(exhibitionIndex).toContain('{messages.exhibitionDates}');
		expect(exhibitionIndex).toContain('{messages.exhibitionsArchiveTitle}');
		expect(exhibitionIndex).toContain('{messages.exhibitionsDetailAction}');
		expect(exhibitionIndex).toContain('href={exhibition.href}');
		expect(exhibitionIndex).toContain('border-b border-surface-variant');
		expect(exhibitionIndex).toContain('focus-visible:outline-primary');
		expect(exhibitionIndex).toContain('EditorialImage');
		expect(exhibitionIndex).toContain('<HomeContactSection');
		expect(exhibitionIndex).not.toMatch(/<(?:button|form)\b|\b(?:price|precio|isbn)\b/i);
	});

	it('places a localized keyboard skip link before the header and targets main content', () => {
		expect(baseLayout).toContain('href="#main-content"');
		expect(baseLayout).toContain('{messages.skipToContent}');
		expect(baseLayout).toContain('id="main-content"');
		expect(baseLayout.indexOf('href="#main-content"')).toBeLessThan(baseLayout.indexOf('<SiteHeader'));
		expect(baseLayout).toContain('sr-only');
		expect(baseLayout).toContain('focus:not-sr-only');
		expect(baseLayout).toContain('focus-visible:outline-primary');
	});

	it.each([
		{
			locale: 'es',
			source: spanishExhibitionIndexPage,
			canonicalPath: 'canonicalPath="/exposiciones/"',
			alternatePath: "en: '/en/exhibitions/'",
		},
		{
			locale: 'en',
			source: englishExhibitionIndexPage,
			canonicalPath: 'canonicalPath="/en/exhibitions/"',
			alternatePath: "es: '/exposiciones/'",
		},
	])('prepares the published $locale exhibition index without a content fallback', ({ locale, source, canonicalPath, alternatePath }) => {
		expect(source).toContain(`const locale = '${locale}' as const;`);
		expect(source).toContain('sortExhibitionsForIndex');
		expect(source).toContain('loadCatalogContent()');
		expect(source).toContain(canonicalPath);
		expect(source).toContain(alternatePath);
		expect(source).toContain('messages.exhibitionsMetaDescription');
		expect(source).toContain('<ExhibitionIndex locale={locale} exhibitions={exhibitions} />');
	});

	it('renders critical text index entries as localized title links with author and no body excerpts', () => {
		expect(criticalTextIndex).toContain('entries.length > 0');
		expect(criticalTextIndex).toContain('{messages.criticalTextsEmpty}');
		expect(criticalTextIndex).toContain('messages.criticalTextAuthor');
		expect(criticalTextIndex).toContain('href={text.href}');
		expect(criticalTextIndex).toContain('{text.title}');
		expect(criticalTextIndex).toContain('{text.author}');
		expect(criticalTextIndex).toContain('border-b border-surface-variant');
		expect(criticalTextIndex).toContain('focus-visible:outline-primary');
		expect(criticalTextIndex).not.toContain('{text.body}');
		expect(criticalTextIndex).not.toMatch(/<(?:button|form)\b/i);
	});

	it.each([
		{
			locale: 'es',
			source: spanishCriticalTextIndexPage,
			canonicalPath: 'canonicalPath="/textos-criticos/"',
			alternatePath: "en: '/en/critical-texts/'",
			detailPath: '`/textos-criticos/${encodeURIComponent(criticalText.id)}/`',
		},
		{
			locale: 'en',
			source: englishCriticalTextIndexPage,
			canonicalPath: 'canonicalPath="/en/critical-texts/"',
			alternatePath: "es: '/textos-criticos/'",
			detailPath: '`/en/critical-texts/${encodeURIComponent(criticalText.id)}/`',
		},
	])('prepares the published $locale critical-text index without a content fallback', ({ locale, source, canonicalPath, alternatePath, detailPath }) => {
		expect(source).toContain(`const locale = '${locale}' as const;`);
		expect(source).toContain('sortCriticalTextsForIndex(');
		expect(source).toContain('catalog.criticalTexts.filter((criticalText) => criticalText.translations[locale] !== undefined)');
		expect(source).toContain(detailPath);
		expect(source).toContain(canonicalPath);
		expect(source).toContain(alternatePath);
		expect(source).toContain('messages.criticalTextsMetaDescription');
		expect(source).toContain('<CriticalTextIndex locale={locale} criticalTexts={criticalTexts} />');
	});

	it('presents the complete localized critical-text content and only non-empty visible relations', () => {
		expect(criticalTextContent).toContain('{title}');
		expect(criticalTextContent).toContain('{body}');
		expect(criticalTextContent).toContain('{author}');
		expect(criticalTextContent).toContain('{relatedArtworks.length > 0 && (');
		expect(criticalTextContent).toContain('{relatedSeries.length > 0 && (');
		expect(criticalTextContent).toContain('artworkIds.has(id)');
		expect(criticalTextContent).toContain('seriesIds.has(id)');
	});

	it.each([
		{
			locale: 'es',
			source: spanishCriticalTextPage,
			canonicalPath: '`/textos-criticos/${encodeURIComponent(criticalText.id)}/`',
			alternatePath: 'criticalText.translations.en',
			artworkPath: '`/obra/${encodeURIComponent(artwork.id)}/`',
			seriesPath: '`/series/${encodeURIComponent(series.id)}/`',
		},
		{
			locale: 'en',
			source: englishCriticalTextPage,
			canonicalPath: '`/en/critical-texts/${encodeURIComponent(criticalText.id)}/`',
			alternatePath: 'criticalText.translations.es',
			artworkPath: '`/en/work/${encodeURIComponent(artwork.id)}/`',
			seriesPath: '`/en/series/${encodeURIComponent(series.id)}/`',
		},
	])('generates only published $locale critical-text pages with localized visible relations', ({ locale, source, canonicalPath, alternatePath, artworkPath, seriesPath }) => {
		const getStaticPaths = source.match(
			/export async function getStaticPaths\(\) \{([\s\S]*?)\n\}/,
		)?.[1] ?? '';

		expect(getStaticPaths).toContain(`const locale = '${locale}' as const;`);
		expect(getStaticPaths).toContain('criticalText.translations[locale]');
		expect(getStaticPaths).toContain('if (!translation) return [];');
		expect(getStaticPaths).toContain('translation.artworkIds.includes(artwork.id) && artworkTranslation');
		expect(getStaticPaths).toContain('translation.seriesIds.includes(series.id) && seriesTranslation');
		expect(getStaticPaths).toContain(artworkPath);
		expect(getStaticPaths).toContain(seriesPath);
		expect(source).toContain(canonicalPath);
		expect(source).toContain(alternatePath);
		expect(source).toContain('deriveCriticalTextMetaDescription(translation.body)');
		expect(source).toContain('description={description || undefined}');
		expect(source).toContain('<CriticalTextContent');
		expect(source).toContain('criticalText={criticalText}');
	});

	it.each([
		{ locale: 'es', source: spanishCriticalTextPage },
		{ locale: 'en', source: englishCriticalTextPage },
	])('emits factual Article JSON-LD in $locale without inferring an author type', ({ locale, source }) => {
		const structuredDataStart = source.indexOf('const relatedWorks = [');
		const structuredDataEnd = source.indexOf('const articleJsonLd');
		const structuredData = source.slice(structuredDataStart, structuredDataEnd);

		expect(source).toContain('<script type="application/ld+json" set:html={articleJsonLd} />');
		expect(structuredData).toContain("'@type': 'Article'");
		expect(structuredData).toContain('headline: translation.title');
		expect(structuredData).toContain('articleBody: translation.body');
		expect(structuredData).toContain('author: translation.author');
		expect(structuredData).toContain(`inLanguage: locale`);
		expect(structuredData).toContain('visibleArtworks.map');
		expect(structuredData).toContain('visibleSeries.map');
		expect(structuredData).not.toMatch(/'@type': '(?:Person|Organization)'/);
		expect(source).toContain("replaceAll('<', '\\\\u003c')");
	});

	it.each([
		{ locale: 'es', source: spanishSeriesPage },
		{ locale: 'en', source: englishSeriesPage },
		{ locale: 'es', source: spanishArtworkPage },
		{ locale: 'en', source: englishArtworkPage },
	])('declares the $locale locale inside getStaticPaths for dynamic routes', ({ locale, source }) => {
		const getStaticPaths = source.match(
			/export async function getStaticPaths\(\) \{([\s\S]*?)\n\}/,
		)?.[1] ?? '';

		expect(getStaticPaths).toContain(`const locale = '${locale}' as const;`);
	});

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
		expect(artworkTechnicalSheet).toContain('format(heightCm)} × ${numberFormat.format(widthCm)} ${messages.centimeterUnit}');
		expect(artworkContent).not.toContain('catalogLine');
		expect(artworkContent).toContain('data-open-darkroom');
		expect(artworkContent).toContain('data-cite-artwork');
		expect(artworkContent).toContain('id="darkroom-modal"');
		expect(artworkContent).toContain('role="dialog"');
		expect(artworkContent).toContain('aria-modal="true"');
		expect(artworkContent).toContain('data-darkroom-minimap-rect');
		expect(artworkContent).not.toMatch(/<form\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
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

	it('links each selected critical-text title to its same-locale detail and keeps body and author', () => {
		expect(artworkContent).toContain("locale === 'es'");
		expect(artworkContent).toContain('`/textos-criticos/${encodeURIComponent(criticalText.id)}/`');
		expect(artworkContent).toContain('`/en/critical-texts/${encodeURIComponent(criticalText.id)}/`');
		expect(artworkContent).toContain('author, href');
		expect(artworkCriticalTexts).toContain('href={text.href}');
		expect(artworkCriticalTexts).toContain('{text.title}');
		expect(artworkCriticalTexts).toContain('{text.author}');
		expect(artworkCriticalTexts).toContain('{text.body}');
		expect(artworkCriticalTexts).toContain('focus-visible:outline-primary');
		expect(artworkCriticalTexts).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir)\b/i);
	});

	it('gets the visible centimeter suffix and structured unit text from i18n', () => {
		expect(artworkTechnicalSheet).toContain('messages.centimeterUnit');
		expect(artworkTechnicalSheet).not.toContain('widthCm)} cm`');

		const structuredDataStart = artworkContent.indexOf('const visualArtwork = {');
		const structuredDataEnd = artworkContent.indexOf('const visualArtworkJsonLd');
		const structuredData = artworkContent.slice(structuredDataStart, structuredDataEnd);
		expect(structuredData).toContain('unitText: messages.centimeterUnit');
		expect(structuredData).toContain("unitCode: 'CMT'");
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
		expect(source).toContain('description={translation.seoDescription}');
	});

	it('emits safely serialized factual VisualArtwork JSON-LD without commercial properties', () => {
		const structuredDataStart = artworkContent.indexOf('const visualArtwork = {');
		const structuredDataEnd = artworkContent.indexOf('const visualArtworkJsonLd');
		const structuredData = artworkContent.slice(structuredDataStart, structuredDataEnd);

		expect(artworkContent).toContain('<script type="application/ld+json" set:html={visualArtworkJsonLd} />');
		expect(structuredData).toContain("'@context': 'https://schema.org'");
		expect(structuredData).toContain("'@type': 'VisualArtwork'");
		expect(structuredData).toContain('translation.title');
		expect(structuredData).toContain('dateCreated: artwork.year.toString()');
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
		expect(artworkCriticalTexts).toContain('href={text.href}');
	});

	it('renders an enriched linked artwork card with image, textual availability, inventory/series metadata, technical details, and no commercial actions', () => {
		expect(artworkCard).toContain('EditorialImage');
		expect(artworkCard).toContain('translation?.title.trim()');
		expect(artworkCard).toContain('artwork.year');
		expect(artworkCard).toContain('artwork.inventoryNumber');
		expect(artworkCard).toContain('translation.technique');
		expect(artworkCard).toContain('translation.support');
		expect(artworkCard).toContain('dimensions');
		expect(artworkCard).toContain('href={destination}');
		expect(artworkCard).toContain('tablet:col-span-4 desktop:col-span-4');
		expect(artworkCard).toContain('focus-visible:outline-primary');
		expect(artworkCard).not.toContain('loading="eager"');
		expect(artworkCard).not.toMatch(/<(?:button|form|dialog)\b|\b(?:price|precio|buy|comprar|adquirir|checkout)\b/i);
	});

	it('links only the supplied visible series and does not render a catalog filter', () => {
		expect(seriesDirectory).toContain('visibleSeries');
		expect(seriesDirectory).toContain('href={series.href}');
		expect(seriesDirectory).toContain('{series.name}');
		expect(seriesDirectory).toContain('messages.series');
		expect(seriesDirectory).not.toMatch(/<(?:select|button)\b|\bfilter\b/i);
	});

	it('exposes the series-directory anchor only when the directory is rendered', () => {
		expect(seriesDirectory).toMatch(/\{links\.length > 0 && \(\s*<section id="series-directory"/);
	});

	it('renders localized home navigation only for available routes and anchors', () => {
		expect(homeNavigation).toContain('aria-label={messages.homeNavigationLabel}');
		expect(homeNavigation).toContain('hidden tablet:block');
		expect(homeNavigation).toContain("{ works: '/obras/', exhibitions: '/exposiciones/', criticalTexts: '/textos-criticos/', contact: '/contacto/' }");
		expect(homeNavigation).toContain("{ works: '/en/works/', exhibitions: '/en/exhibitions/', criticalTexts: '/en/critical-texts/', contact: '/en/contact/' }");
		expect(homeNavigation).toMatch(/if \(hasWorksRoute\) \{\s*links\.push\(\{ href: localizedPaths\.works, label: messages\.homeWorksLink \}\);/);
		expect(homeNavigation).toMatch(/if \(hasWorksRoute && hasSeriesDirectory\) \{\s*links\.push\(\{ href: `\$\{localizedPaths\.works\}#series-directory`, label: messages\.homeSeriesLink \}\);/);
		expect(homeNavigation).toMatch(/if \(hasExhibitionsRoute\) \{\s*links\.push\(\{ href: localizedPaths\.exhibitions, label: messages\.homeExhibitionsLink \}\);/);
		expect(homeNavigation).toMatch(/if \(hasCriticalTextsRoute\) \{\s*links\.push\(\{ href: localizedPaths\.criticalTexts, label: messages\.homeCriticalTextsLink \}\);/);
		expect(homeNavigation).toMatch(/if \(hasContactRoute\) \{\s*links\.push\(\{ href: localizedPaths\.contact, label: messages\.homeContactLink \}\);/);
		expect(homeNavigation).toContain('messages.homeWorksLink');
		expect(homeNavigation).toContain('messages.homeSeriesLink');
		expect(homeNavigation).toContain('messages.homeExhibitionsLink');
		expect(homeNavigation).toContain('messages.homeCriticalTextsLink');
		expect(homeNavigation).toContain('messages.homeContactLink');
		expect(homeNavigation).toContain('links.length > 0 && (');
		expect(homeNavigation).toContain('flex list-none flex-wrap');
		expect(homeNavigation).toContain('focus-visible:outline-primary');
		expect(homeNavigation).not.toMatch(/<(?:button|form)\b|client:[\w-]+/i);
	});

	it('omits an empty home selection and maps all selected artworks through HomeArtworkFeature with alternating columns', () => {
		expect(homeArtworkSelection).toMatch(/\{cards\.length > 0 && \([\s\S]*?<section/);
		expect(homeArtworkSelection).toContain('messages.homeArtworkSelectionTitle');
		expect(homeArtworkSelection).toContain('cards.map((card, index) =>');
		expect(homeArtworkSelection).toContain('<HomeArtworkFeature');
		expect(homeArtworkSelection).toContain('reversed={index % 2 === 1}');
		expect(homeArtworkSelection).toContain("loading={index === 0 ? 'eager' : 'lazy'}");
		expect(homeArtworkSelection).not.toContain('<ArtworkCard');
		expect(homeArtworkFeature).toContain("loading = 'eager'");
		expect(homeArtworkFeature).toContain('aspect-ratio: ${image.width} / ${image.height}');
		expect(homeArtworkFeature).toContain('<InventoryBadge inventoryNumber={artwork.inventoryNumber} />');
		expect(artworkCard).toContain('focus-visible:outline-primary');
		expect(artworkCard).toContain("loading = 'lazy'");
		expect(artworkCard).toContain('<EditorialImage');
		expect(artworkCard).toContain('loading={loading}');
		expect(homeArtworkSelection).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
		expect(artworkCard).toContain('<AvailabilityLabel availability={artwork.availability} locale={locale} />');
	});

	it('presents each home artwork with localized series, inventory badge, technical data, alternating columns, optional note, and actions', () => {
		const feature = readOptionalComponent(homeArtworkFeaturePath);
		expect(feature).toContain('<EditorialImage');
		expect(feature).toContain('<InventoryBadge inventoryNumber={artwork.inventoryNumber} />');
		expect(feature).toContain('altText={translation.altText}');
		expect(feature).toContain('href={series.href}');
		expect(feature).toContain('{series.name}');
		expect(feature).toContain('<ArtworkTechnicalSheet');
		expect(feature).toContain('headingId={technicalSheetHeadingId}');
		expect(feature).toContain('headingLevel={3}');
		expect(feature).toContain('technique={translation.technique}');
		expect(feature).toContain('support={translation.support}');
		expect(feature).toContain('heightCm={artwork.heightCm}');
		expect(feature).toContain('widthCm={artwork.widthCm}');
		expect(feature).toContain('href={destination}');
		expect(feature).toContain('translation.workshopNote?.trim()');
		expect(feature).toMatch(/\{workshopNote && \(/);
		expect(feature).toContain('<blockquote');
		expect(feature).toContain('messages.homeArtworkDetailAction');
		expect(feature).toContain('messages.contactArtworkAction');
		expect(feature).toContain('loading={loading}');
		expect(feature).toContain('tablet:col-span-8 desktop:col-span-7');
		expect(feature).toContain('desktop:order-2 desktop:col-span-7');
		expect(feature).toContain('desktop:order-1 desktop:col-span-5');
		expect(feature).toContain('desktop:col-span-5');
		expect(artworkTechnicalSheet).toContain('headingId?: string');
		expect(artworkTechnicalSheet).toContain('headingLevel?: 2 | 3');
		expect(artworkTechnicalSheet).toContain('headingLevel = 2');
		expect(artworkTechnicalSheet).toContain('headingLevel === 3');
		expect(feature).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
	});

	it('renders localized home exhibitions in 12-column rows only when valid entries exist', () => {
		const exhibitions = readOptionalComponent(new URL('./HomeExhibitions.astro', import.meta.url));
		expect(exhibitions).toMatch(/\{items\.length > 0 && \(/);
		expect(exhibitions).toContain('messages.homeExhibitionsEyebrow');
		expect(exhibitions).toContain('messages.homeExhibitionsTitle');
		expect(exhibitions).toContain('exhibition.title');
		expect(exhibitions).toContain('exhibition.venue');
		expect(exhibitions).toContain('formatDate(exhibition.startDate)');
		expect(exhibitions).toContain('href={exhibition.href}');
		expect(exhibitions).toContain('desktop:col-span-3');
		expect(exhibitions).toContain('desktop:col-span-5');
		expect(exhibitions).toContain('desktop:col-span-4');
		expect(exhibitions).toContain('timeZone: \'UTC\'');
	});

	it('renders the localized home contact closing section only when the contact route exists', () => {
		const contactSection = readOptionalComponent(new URL('./HomeContactSection.astro', import.meta.url));
		expect(contactSection).toMatch(/\{hasContactRoute && \(/);
		expect(contactSection).toContain('messages.homeContactEyebrow');
		expect(contactSection).toContain('messages.homeContactTitle');
		expect(contactSection).toContain('messages.homeContactBody');
		expect(contactSection).toContain('messages.homeContactAction');
		expect(contactSection).toContain("locale === 'es' ? '/contacto/' : '/en/contact/'");
		expect(contactSection).not.toMatch(/<(?:button|form)\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
	});

	it('preloads local editorial fonts only on home and contact pages when requested', () => {
		expect(baseLayout).toContain('preloadEditorialFonts?: boolean');
		expect(baseLayout).toContain('preloadEditorialFonts = false');
		expect(baseLayout).toContain('preloadEditorialFonts &&');
		for (const font of [
			'/fonts/bodoni-moda-400-latin.woff2',
			'/fonts/newsreader-400-latin.woff2',
			'/fonts/geist-latin.woff2',
		]) {
			expect(baseLayout).toContain(font);
		}
		expect(spanishHomePage).toContain('preloadEditorialFonts={true}');
		expect(englishHomePage).toContain('preloadEditorialFonts={true}');
		expect(spanishContactPage).toContain('preloadEditorialFonts={true}');
		expect(englishContactPage).toContain('preloadEditorialFonts={true}');
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

	it('links from a localized artwork page to contact with only that published artwork ID', () => {
		expect(artworkContent).toContain('messages.contactArtworkAction');
		expect(artworkContent).toContain('encodeURIComponent(artwork.id)');
		expect(artworkContent).toContain('`/contacto/?artwork=');
		expect(artworkContent).toContain('`/en/contact/?artwork=');
		expect(artworkContent).not.toMatch(/<form\b|\b(?:buy|purchase|checkout|comprar|adquirir|precio|price)\b/i);
	});

	it('passes published exhibitions, series artwork count, and optional next artwork in series into the artwork page', () => {
		for (const source of [spanishArtworkPage, englishArtworkPage]) {
			expect(source).toContain('exhibitions: catalog.exhibitions');
			expect(source).toContain('exhibitions={exhibitions}');
			expect(source).toContain('seriesArtworkCount');
			expect(source).toContain('nextArtwork');
		}
		expect(artworkContent).toContain('relatedExhibitions');
		expect(artworkContent).toContain('nextArtwork');
		expect(artworkContent).toContain('messages.artworkExhibitionsHistoryTitle');
		expect(artworkContent).toContain('messages.artworkNextInSeriesTitle');
		expect(artworkContent).toContain('messages.artworkOpenDarkroom');
		expect(artworkContent).toContain('messages.artworkCloseDarkroom');
	});

	it('adds a localized contact link to the existing footer and preselects only localized artwork options', () => {
		expect(baseLayout).toContain('<SiteFooter locale={locale}');
		expect(siteFooter).toContain('messages.contactFooterLink');
		expect(siteFooter).toContain("locale === 'es'");
		expect(siteFooter).toContain("'/contacto/'");
		expect(siteFooter).toContain("'/en/contact/'");
		expect(contactForm).toContain('new URLSearchParams(window.location.search)');
		expect(contactForm).toContain('option.value === artworkId');
		expect(contactForm).toContain('contactArtworkSelect.value = artworkId');
	});

	it('presents contact in an asymmetric editorial layout while preserving the complete privacy notice and existing form', () => {
		for (const source of [spanishContactPage, englishContactPage]) {
			expect(source).toContain('messages.contactPageHeading');
			expect(source).toContain('messages.contactIntro');
			expect(source).toContain('<ContactForm');
			expect(source).toContain('desktop:grid-cols-12');
		}

		expect(contactForm).toContain('messages.contactChannelTitle');
		expect(contactForm).toContain('messages.contactEmailAddress');
		expect(contactForm).toContain('mailto:${messages.contactEmailAddress}');
		expect(contactForm).toContain('id="contact-privacy-notice"');
		expect(contactForm).toContain('{messages.contactPrivacyRetention}');
		expect(contactForm.indexOf('id="contact-privacy-notice"')).toBeLessThan(contactForm.indexOf('id="contact-form"'));
		expect(contactForm).toContain('id="contact-form"');
		expect(contactForm).toContain('name="name"');
		expect(contactForm).toContain('name="email"');
		expect(contactForm).toContain('name="institution"');
		expect(contactForm).toContain('name="phone"');
		expect(contactForm).toContain('name="artworkId"');
		expect(contactForm).toContain('name="message"');
		expect(contactForm).toContain('data-turnstile-container');
		expect(contactForm).toContain('border-b border-outline-variant bg-transparent');
		expect(contactForm).not.toMatch(/<(?:dialog)\b|name="consent"|(?:adquisici[oó]n|confidencialidad|72 horas|SSL 256)/iu);
	});

	it('marks the Turnstile token with the stable contact action', () => {
		expect(contactForm).toContain("action: 'contact'");
	});

	it('submits general inquiries without a consent checkbox or consent response contract', () => {
		expect(contactForm).not.toContain('name="consent"');
		expect(contactForm).not.toContain("'consent'");
		expect(contactForm).not.toContain("requestBody.set('consent'");
		expect(contactForm).not.toContain('showConsentError');
		expect(contactForm).not.toContain('consentRequired');
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

	it.each([
		{ locale: 'es', source: spanishCatalogPage },
		{ locale: 'en', source: englishCatalogPage },
	])('passes only the $locale catalog SEO description to BaseLayout, without fallback', ({ locale, source }) => {
		expect(source).toContain('loadCatalogSeoDescriptions()');
		expect(source).toContain('description={catalogSeoDescriptions[locale]}');
	});

	it('keeps the catalog SEO description off series and artwork pages', () => {
		for (const source of [spanishArtworkPage, englishArtworkPage, spanishSeriesPage, englishSeriesPage]) {
			expect(source).not.toContain('catalogSeoDescriptions');
		}
	});

	it.each([
		{ source: spanishArtworkPage },
		{ source: englishArtworkPage },
	])('passes only its own translation SEO description to BaseLayout', ({ source }) => {
		expect(source).toContain('description={translation.seoDescription}');
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
