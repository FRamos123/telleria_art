import { describe, expect, it } from 'vitest';
import { getLocaleFromPath, getMessages } from './index';
import { en } from './en';
import { es } from './es';

describe('foundation translations', () => {
	it('provides non-empty Spanish and English messages for the contact form and marks legal copy pending', () => {
		const contactMessageKeys = [
			'contactTitle',
			'contactMetaDescription',
			'contactIntro',
			'contactNameLabel',
			'contactEmailLabel',
			'contactInstitutionLabel',
			'contactPhoneLabel',
			'contactArtworkLabel',
			'contactArtworkNone',
			'contactMessageLabel',
			'contactRequired',
			'contactOptional',
			'contactPhoneHelp',
			'contactArtworkHelp',
			'contactArtworkAction',
			'contactFooterLink',
			'contactFormDraftOnly',
			'contactAntiSpamLabel',
			'contactAntiSpamPending',
			'contactSubmit',
			'contactSubmitting',
			'contactSuccess',
			'contactSendFailed',
			'contactSpamRejected',
			'contactSpamExpired',
			'contactErrorSummary',
			'contactArtworkUnavailable',
			'contactConsentRequired',
			'contactInvalidRequest',
			'contactPrivacyNoticeLink',
			'contactConsentHelp',
			'contactNameRequired',
			'contactNameTooLong',
			'contactEmailRequired',
			'contactEmailInvalid',
			'contactEmailTooLong',
			'contactInstitutionTooLong',
			'contactPhoneInvalid',
			'contactPhoneTooLong',
			'contactMessageRequired',
			'contactMessageTooLong',
			'contactPrivacyNoticeTitle',
			'contactPrivacyNoticeStatus',
			'contactPrivacyControllerLabel',
			'contactPrivacyController',
			'contactPrivacyContactLabel',
			'contactPrivacyContact',
			'contactPrivacyPurposeLabel',
			'contactPrivacyPurpose',
			'contactPrivacyDataLabel',
			'contactPrivacyData',
			'contactPrivacyLegalBasisLabel',
			'contactPrivacyLegalBasis',
			'contactPrivacyProvidersLabel',
			'contactPrivacyProviders',
			'contactPrivacyRetentionLabel',
			'contactPrivacyRetention',
			'contactPrivacyRightsLabel',
			'contactPrivacyRights',
			'contactConsentDraft',
		] as const
		const spanish = es as unknown as Record<string, string>
		const english = en as unknown as Record<string, string>

		for (const key of contactMessageKeys) {
			expect(spanish[key]?.trim().length, `Spanish ${key}`).toBeGreaterThan(0)
			expect(english[key]?.trim().length, `English ${key}`).toBeGreaterThan(0)
		}
		expect(es.contactPrivacyNoticeStatus).toContain('PENDIENTE')
		expect(en.contactPrivacyNoticeStatus).toContain('PENDING')
	})

	it('provides non-empty localized labels for every artwork availability state', () => {
		const availabilityKeys = [
			'availabilityAvailable',
			'availabilityReserved',
			'availabilitySold',
			'availabilityInCollection',
		] as const;

		for (const key of availabilityKeys) {
			expect(es[key].trim().length, `Spanish ${key}`).toBeGreaterThan(0);
			expect(en[key].trim().length, `English ${key}`).toBeGreaterThan(0);
		}
	});

	it('uses the approved localized labels for all four availability states', () => {
		expect([
			es.availabilityAvailable,
			es.availabilityReserved,
			es.availabilitySold,
			es.availabilityInCollection,
		]).toEqual(['Disponible', 'Reservada', 'Vendida', 'En colección']);
		expect([
			en.availabilityAvailable,
			en.availabilityReserved,
			en.availabilitySold,
			en.availabilityInCollection,
		]).toEqual(['Available', 'Reserved', 'Sold', 'In collection']);
	});

	it('provides localized catalog-empty messages and a series SEO template', () => {
		expect(es.catalogTitle).toBe('Obras — Alejandro Fernández Tellería');
		expect(en.catalogTitle).toBe('Works — Alejandro Fernández Tellería');
		expect(es.catalogEmpty).toBe('No hay obras que mostrar en este idioma.');
		expect(en.catalogEmpty).toBe('There are no artworks to show in this language.');
		expect(es.seriesMetaDescriptionTemplate).toBe('Obras de la serie {seriesName} de {artistName}.');
		expect(en.seriesMetaDescriptionTemplate).toBe('Works from the {seriesName} series by {artistName}.');
	});

	it('provides localized exhibition index titles, descriptions, and empty messages', () => {
		expect(es.exhibitionsTitle).toBe('Exposiciones — Alejandro Fernández Tellería');
		expect(en.exhibitionsTitle).toBe('Exhibitions — Alejandro Fernández Tellería');
		expect(es.exhibitionsMetaDescription).toContain('Exposiciones de Alejandro Fernández Tellería');
		expect(en.exhibitionsMetaDescription).toContain('Exhibitions by Alejandro Fernández Tellería');
		expect(es.exhibitionsEmpty).toBe('No hay exposiciones que mostrar en este idioma.');
		expect(en.exhibitionsEmpty).toBe('There are no exhibitions to show in this language.');
	});

	it('provides localized critical-text index titles, descriptions, author labels, and empty messages', () => {
		expect(es.criticalTextsTitle).toBe('Textos críticos — Alejandro Fernández Tellería');
		expect(en.criticalTextsTitle).toBe('Critical texts — Alejandro Fernández Tellería');
		expect(es.criticalTextsMetaDescription).toBeTruthy();
		expect(en.criticalTextsMetaDescription).toBeTruthy();
		expect(es.criticalTextAuthor).toBe('Autoría');
		expect(en.criticalTextAuthor).toBe('Author');
		expect(es.criticalTextsEmpty).toBe('No hay textos críticos que mostrar en este idioma.');
		expect(en.criticalTextsEmpty).toBe('There are no critical texts to show in this language.');
	});

	it('provides localized skip-to-content text', () => {
		expect(es.skipToContent).toBe('Saltar al contenido principal');
		expect(en.skipToContent).toBe('Skip to main content');
	});

	it('provides the standard centimeter unit in both locales', () => {
		expect(es.centimeterUnit).toBe('cm');
		expect(en.centimeterUnit).toBe('cm');
	});

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
		expect(getLocaleFromPath('/unknown/')).toBeUndefined();
	});
});
