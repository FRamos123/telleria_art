import { describe, expect, it } from 'vitest';
import { createSitemapXml } from './sitemap';

describe('createSitemapXml', () => {
	it('includes both catalogs and only published series and artwork language versions', () => {
		const xml = createSitemapXml({
			series: [
				{ id: 'serie-bilingue', translations: { es: {}, en: {} } },
				{ id: 'serie-solo-es', translations: { es: {} } },
			],
			artworks: [
				{ id: 'obra-bilingue', translations: { es: {}, en: {} } },
				{ id: 'obra-solo-en', translations: { en: {} } },
			],
		}, new URL('https://example.com'));

		expect(xml).toContain('<loc>https://example.com/obras/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/works/</loc>');
		expect(xml).toContain('<loc>https://example.com/series/serie-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/series/serie-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/series/serie-solo-es/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/en/series/serie-solo-es/</loc>');
		expect(xml).toContain('<loc>https://example.com/obra/obra-bilingue/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/work/obra-bilingue/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/obra/obra-solo-en/</loc>');
		expect(xml).toContain('<loc>https://example.com/en/work/obra-solo-en/</loc>');
		expect(xml).not.toContain('<loc>https://example.com/</loc>');
	});

	it('emits alternates only for published versions, including the current version', () => {
		const xml = createSitemapXml({
			series: [{ id: 'serie-es', translations: { es: {} } }],
			artworks: [{ id: 'obra-en', translations: { en: {} } }],
		}, new URL('https://example.com'));

		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/obras/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/works/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es" href="https://example.com/series/serie-es/"');
		expect(xml).not.toContain('hreflang="en" href="https://example.com/en/series/serie-es/"');
		expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/work/obra-en/"');
		expect(xml).not.toContain('hreflang="es" href="https://example.com/obra/obra-en/"');
	});

	it('escapes XML characters in generated URLs', () => {
		const xml = createSitemapXml({
			series: [{ id: 'serie&prueba', translations: { es: {} } }],
			artworks: [],
		}, new URL('https://example.com'));

		expect(xml).toContain('/series/serie%26prueba/');
		expect(xml).not.toContain('&prueba');
	});
});
