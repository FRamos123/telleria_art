import { describe, expect, it } from 'vitest';
import { transitionPublication, type PublicationDraft, type PublicationState } from './publication';

const draft = (content: string, complete = true, errors: string[] = []): PublicationDraft<string> => ({
	content,
	complete,
	errors,
});

const state = (
	published: PublicationState<string>['published'] = {},
	drafts: PublicationState<string>['drafts'] = {},
): PublicationState<string> => ({ published, drafts });

describe('transitionPublication — drafts and explicit publication', () => {
	it('saves a complete draft without publishing it', () => {
		const result = transitionPublication('artwork', state({ es: 'publicada anterior' }), {
			type: 'saveDraft',
			language: 'es',
			draft: draft('edición nueva'),
		});

		expect(result.publicationChanged).toBe(false);
		expect(result.state).toEqual({
			published: { es: 'publicada anterior' },
			drafts: { es: draft('edición nueva') },
		});
	});

	it('does not replace a published version when an incomplete draft is submitted for publication', () => {
		const result = transitionPublication('artwork', state(
			{ es: 'publicada anterior' },
			{ es: draft('edición incompleta', false, ['translation.title', 'translation.altText']) },
		), { type: 'publish', language: 'es' });

		expect(result.publicationChanged).toBe(false);
		expect(result.errors).toEqual(['translation.title', 'translation.altText']);
		expect(result.state).toEqual({
			published: { es: 'publicada anterior' },
			drafts: { es: draft('edición incompleta', false, ['translation.title', 'translation.altText']) },
		});
	});

	it('publishes a complete draft only after an explicit publish action', () => {
		const pending = state({}, { es: draft('nueva versión completa') });
		const saved = transitionPublication('series', pending, {
			type: 'saveDraft',
			language: 'es',
			draft: draft('nueva versión completa'),
		});
		expect(saved.state.published).toEqual({});

		const published = transitionPublication('series', saved.state, { type: 'publish', language: 'es' });
		expect(published.publicationChanged).toBe(true);
		expect(published.state).toEqual({ published: { es: 'nueva versión completa' }, drafts: {} });
	});

	it.each(['artwork', 'series', 'exhibition'] as const)(
		'requires a published Spanish version before publishing English for %s', (kind) => {
			const initial = state({}, { en: draft('complete English version') });
			const blocked = transitionPublication(kind, initial, { type: 'publish', language: 'en' });

			expect(blocked.publicationChanged).toBe(false);
			expect(blocked.errors).toEqual(['spanish.required']);
			expect(blocked.state).toEqual(initial);
		},
	);

	it('publishes English independently after Spanish is published', () => {
		const initial = state({ es: 'versión española' }, { en: draft('English version') });
		const result = transitionPublication('artwork', initial, { type: 'publish', language: 'en' });

		expect(result.state).toEqual({
			published: { es: 'versión española', en: 'English version' },
			drafts: {},
		});
	});

	it('allows a complete English draft to publish while an incomplete Spanish edit remains a draft', () => {
		const initial = state(
			{ es: 'versión española publicada', en: 'versión inglesa anterior' },
			{
				es: draft('edición ES incompleta', false, ['translation.title']),
				en: draft('nueva versión EN'),
			},
		);
		const result = transitionPublication('exhibition', initial, { type: 'publish', language: 'en' });

		expect(result.state).toEqual({
			published: { es: 'versión española publicada', en: 'nueva versión EN' },
			drafts: { es: draft('edición ES incompleta', false, ['translation.title']) },
		});
	});

	it('keeps the old version when the requested language has no draft', () => {
		const initial = state({ es: 'versión española' });
		const result = transitionPublication('series', initial, { type: 'publish', language: 'es' });

		expect(result.publicationChanged).toBe(false);
		expect(result.errors).toEqual(['draft.missing']);
		expect(result.state).toEqual(initial);
	});
});

describe('transitionPublication — critical text original-language rule', () => {
	it.each(['es', 'en'] as const)('publishes a complete critical-text original in %s', (language) => {
		const initial = state({}, { [language]: draft(`original ${language}`) });
		const result = transitionPublication('criticalText', initial, {
			type: 'publish',
			language,
		}, language);

		expect(result.state.published).toEqual({ [language]: `original ${language}` });
		expect(result.state.drafts).toEqual({});
	});

	it('does not require a Spanish translation to publish an English original', () => {
		const result = transitionPublication(
			'criticalText',
			state({}, { en: draft('English original') }),
			{ type: 'publish', language: 'en' },
			'en',
		);

		expect(result.errors).toEqual([]);
		expect(result.state.published).toEqual({ en: 'English original' });
	});

	it('blocks a critical-text translation until its original is published', () => {
		const initial = state({}, { en: draft('original'), es: draft('translation') });
		const result = transitionPublication('criticalText', initial, {
			type: 'publish',
			language: 'es',
		}, 'en');

		expect(result.errors).toEqual(['original.required']);
		expect(result.state).toEqual(initial);
	});

	it('publishes a complete optional translation without changing the original', () => {
		const initial = state({ en: 'English original' }, { es: draft('traducción española') });
		const result = transitionPublication('criticalText', initial, {
			type: 'publish',
			language: 'es',
		}, 'en');

		expect(result.state).toEqual({
			published: { en: 'English original', es: 'traducción española' },
			drafts: {},
		});
	});

	it('does not publish a secondary translation when the original language is missing', () => {
		const initial = state({}, { en: draft('English version') });
		const result = transitionPublication('criticalText', initial, {
			type: 'publish',
			language: 'en',
		});

		expect(result.errors).toEqual(['originalLanguage.required']);
		expect(result.state).toEqual(initial);
	});
});

describe('transitionPublication — unpublishing and completeness reconciliation', () => {
	it('unpublishes only English for artwork, series, or exhibition', () => {
		for (const kind of ['artwork', 'series', 'exhibition'] as const) {
			const result = transitionPublication(kind, state({ es: 'ES', en: 'EN' }), {
				type: 'unpublish',
				language: 'en',
			});
			expect(result.state.published).toEqual({ es: 'ES' });
		}
	});

	it('unpublishing Spanish removes both localized versions but preserves drafts', () => {
		const initial = state({ es: 'ES', en: 'EN' }, { en: draft('draft EN') });
		const result = transitionPublication('artwork', initial, { type: 'unpublish', language: 'es' });

		expect(result.state).toEqual({ published: {}, drafts: { en: draft('draft EN') } });
	});

	it('unpublishes a critical-text original together with every translation', () => {
		const result = transitionPublication(
			'criticalText',
			state({ en: 'original', es: 'translation' }),
			{ type: 'unpublish', language: 'en' },
			'en',
		);
		expect(result.state.published).toEqual({});
	});

	it.each(['es', 'en'] as const)('unpublishes an original critical text declared in %s', (language) => {
		const result = transitionPublication(
			'criticalText',
			state({ es: 'Spanish version', en: 'English version' }),
			{ type: 'unpublish', language },
			language,
		);
		expect(result.state.published).toEqual({});
	});

	it('unpublishes only an optional critical-text translation', () => {
		const result = transitionPublication(
			'criticalText',
			state({ en: 'original', es: 'translation' }),
			{ type: 'unpublish', language: 'es' },
			'en',
		);
		expect(result.state.published).toEqual({ en: 'original' });
	});

	it('unpublishes every version when the shared entity is unpublished', () => {
		const result = transitionPublication('exhibition', state({ es: 'ES', en: 'EN' }), {
			type: 'unpublish',
		});
		expect(result.state.published).toEqual({});
	});

	it('withdraws only English when a localized English version loses completeness', () => {
		const result = transitionPublication('series', state({ es: 'ES', en: 'EN' }), {
			type: 'reconcile',
			completeness: { es: true, en: false },
		});
		expect(result.state.published).toEqual({ es: 'ES' });
	});

	it('withdraws every localized version when Spanish loses completeness', () => {
		const result = transitionPublication('artwork', state({ es: 'ES', en: 'EN' }), {
			type: 'reconcile',
			completeness: { es: false, en: true },
		});
		expect(result.state.published).toEqual({});
	});

	it('withdraws English if an invalid state has English published without Spanish', () => {
		const result = transitionPublication('exhibition', state({ en: 'EN' }), {
			type: 'reconcile',
			completeness: {},
		});
		expect(result.state.published).toEqual({});
	});

	it('withdraws only an incomplete optional critical-text translation', () => {
		const result = transitionPublication(
			'criticalText',
			state({ en: 'original', es: 'translation' }),
			{ type: 'reconcile', completeness: { en: true, es: false } },
			'en',
		);
		expect(result.state.published).toEqual({ en: 'original' });
	});

	it('withdraws an original critical text and all translations when it loses completeness', () => {
		const result = transitionPublication(
			'criticalText',
			state({ en: 'original', es: 'translation' }),
			{ type: 'reconcile', completeness: { en: false, es: true } },
			'en',
		);
		expect(result.state.published).toEqual({});
	});

	it.each(['es', 'en'] as const)('withdraws all versions when the %s original loses completeness', (language) => {
		const optionalLanguage = language === 'es' ? 'en' : 'es';
		const result = transitionPublication(
			'criticalText',
			state({ es: 'Spanish version', en: 'English version' }),
			{ type: 'reconcile', completeness: { [language]: false, [optionalLanguage]: true } },
			language,
		);
		expect(result.state.published).toEqual({});
	});

	it('clears an invalid critical-text publication when its original language is unknown', () => {
		const result = transitionPublication(
			'criticalText',
			state({ es: 'ES', en: 'EN' }),
			{ type: 'reconcile', completeness: { es: true, en: true } },
		);
		expect(result.state.published).toEqual({});
	});
});
