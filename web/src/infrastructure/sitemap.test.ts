import { describe, expect, it } from 'vitest';
import { createSitemapXml } from './sitemap';

describe('createSitemapXml', () => {
	it('includes all indexes and only published language versions for each content type', () => {
		const xml = createSitemapXml({
			series: [
				{ id: 'serie-bilingue', translations: { es: {}, en: {} } },
				{ id: 'serie-solo-es', translations: { es: {} } },
			],
			artworks: [
				{ id: 'obra-bilingue', translations: { es: {}, en: {} } },
				{ id: 'obra-solo-en', translations: { en: {} } },
			],
			exhibitions: [
				{ id: 'exposicion-bilingue', translations: { es: {}, en: {} } },
				{ id: 'exposicion-solo-es', translations: { es: {} } },
			],
			criticalTexts: [
				{ id: 'texto-bilingue', translations: { es: {}, en: {} } },
				{ id: 'texto-solo-en', translations: { en: {} } },
			],
		}, new URL('https://example.com'));

		expect(xml).toContain('<loc>https://example.com/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/</loc>');
		expect(xml).toContain('<loc>https://example.com/obras/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/works/</loc>');
		expect(xml).toContain('<loc>https://example.com/contacto/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/contact/</loc>');
		expect(xml).toContain('<loc>https://example.com/series/serie-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/series/serie-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/series/serie-solo-es/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/en/series/serie-solo-es/</loc>');
		expect(xml).toContain('<loc>https://example.com/obra/obra-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/work/obra-bilingue/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/obra/obra-solo-en/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/work/obra-solo-en/</loc>');
		expect(xml).toContain('<loc>https://example.com/exposiciones/exposicion-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/exhibitions/exposicion-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/exposiciones/exposicion-solo-es/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/en/exhibitions/exposicion-solo-es/</loc>');
		expect(xml).toContain('<loc>https://example.com/textos-criticos/texto-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/critical-texts/texto-bilingue/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/textos-criticos/texto-solo-en/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/critical-texts/texto-solo-en/</loc>');
	});

	it('emits alternates only for published versions, including the current version', () => {
		const xml = createSitemapXml({
			series: [{ id: 'serie-es', translations: { es: {} } }],
			artworks: [{ id: 'obra-en', translations: { en: {} } }],
			exhibitions: [{ id: 'exposicion-es', translations: { es: {} } }],
			criticalTexts: [{ id: 'texto-en', translations: { en: {} } }],
		}, new URL('https://example.com'));

		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/obras/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/works/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/contacto/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/contact/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/series/serie-es/"');
		expect(xml).not.toContain('hreflang="en" href="https://example.com/en/series/serie-es/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/work/obra-en/"');
		expect(xml).not.toContain('hreflang="es" href="https://example.com/obra/obra-en/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/exposiciones/exposicion-es/"');
		expect(xml).not.toContain('hreflang="en" href="https://example.com/en/exhibitions/exposicion-es/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/critical-texts/texto-en/"');
		expect(xml).not.toContain('hreflang="es" href="https://example.com/textos-criticos/texto-en/"');
	});

	it('includes both editorial indexes even when their collections are empty', () => {
		const xml = createSitemapXml({
			series: [],
			artworks: [],
			exhibitions: [],
			criticalTexts: [],
		}, new URL('https://example.com'));

		expect(xml).toContain('<loc>https://example.com/exposiciones/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/exhibitions/</loc>');
		expect(xml).toContain('<loc>https://example.com/textos-criticos/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/critical-texts/</loc>');
	});

	it('escapes XML characters in generated URLs', () => {
		const xml = createSitemapXml({
			series: [{ id: 'serie&prueba', translations: { es: {} } }],
			artworks: [],
			exhibitions: [],
			criticalTexts: [],
		}, new URL('https://example.com'));

		expect(xml).toContain('/series/serie%26prueba/');
		expect(xml).not.toContain('&prueba');
	});
});
