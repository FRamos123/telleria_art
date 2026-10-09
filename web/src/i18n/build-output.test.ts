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
});
