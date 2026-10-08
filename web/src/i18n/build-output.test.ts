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
		expect(notFoundPage).toContain('Página no encontrada');
		expect(notFoundPage).toContain('Page not found');
		expect(notFoundPage).toContain('href="/"');
		expect(notFoundPage).toContain('href="/en/"');
	});
});
