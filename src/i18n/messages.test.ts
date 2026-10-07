import { describe, expect, it } from 'vitest';
import { getLocaleFromPath, getMessages } from './index';
import { en } from './en';
import { es } from './es';

describe('foundation translations', () => {
	it('provides the same message keys in Spanish and English', () => {
		expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
		expect(Object.values(es).every((message) => message.trim().length > 0)).toBe(true);
		expect(Object.values(en).every((message) => message.trim().length > 0)).toBe(true);
	});

	it('includes the approved identity and foundation messages', () => {
		expect(es.artistName).toBe('Alejandro Fernández Tellería');
		expect(es.artistIdentification).toBe('Pintor · Vigo, Galicia');
		expect(en.artistName).toBe('Alejandro Fernández Tellería');
		expect(en.artistIdentification).toBe('Painter · Vigo, Galicia');
		expect(es.notFoundTitle).toBeTruthy();
		expect(es.notFoundMessage).toBeTruthy();
		expect(es.homeLink).toBeTruthy();
		expect(es.spanishLanguage).toBeTruthy();
		expect(es.englishLanguage).toBeTruthy();
		expect(en.notFoundTitle).toBeTruthy();
		expect(en.notFoundMessage).toBeTruthy();
		expect(en.homeLink).toBeTruthy();
		expect(en.spanishLanguage).toBeTruthy();
		expect(en.englishLanguage).toBeTruthy();
	});

	it('resolves only the published home routes', () => {
		expect(getLocaleFromPath('/')).toBe('es');
		expect(getLocaleFromPath('/en/')).toBe('en');
		expect(getMessages(getLocaleFromPath('/')!).artistIdentification).toBe('Pintor · Vigo, Galicia');
		expect(getMessages(getLocaleFromPath('/en/')!).artistIdentification).toBe('Painter · Vigo, Galicia');
		expect(getLocaleFromPath('/es/')).toBeUndefined();
		expect(getLocaleFromPath('/unknown/')).toBe('en');
	});
});
