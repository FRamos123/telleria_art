export type PublicationLanguage = 'es' | 'en';
export type PublicationKind = 'artwork' | 'series' | 'exhibition' | 'criticalText';

export interface PublicationDraft<T> {
	content: T;
	complete: boolean;
	errors: string[];
}

export interface PublicationState<T> {
	published: Partial<Record<PublicationLanguage, T>>;
	drafts: Partial<Record<PublicationLanguage, PublicationDraft<T>>>;
}

export type PublicationAction<T> =
	| {
		type: 'saveDraft';
		language: PublicationLanguage;
		draft: PublicationDraft<T>;
	}
	| { type: 'publish'; language: PublicationLanguage }
	| { type: 'unpublish'; language?: PublicationLanguage }
	| {
		type: 'reconcile';
		completeness: Partial<Record<PublicationLanguage, boolean>>;
	};

export interface PublicationTransition<T> {
	state: PublicationState<T>;
	publicationChanged: boolean;
	errors: string[];
}

/** Applies explicit editorial actions without exposing drafts as published content. */
export function transitionPublication<T>(
	kind: PublicationKind,
	state: PublicationState<T>,
	action: PublicationAction<T>,
	originalLanguage?: PublicationLanguage,
): PublicationTransition<T> {
	if (action.type === 'saveDraft') {
		return {
			state: {
				published: { ...state.published },
				drafts: { ...state.drafts, [action.language]: action.draft },
			},
			publicationChanged: false,
			errors: [],
		};
	}

	if (action.type === 'publish') {
		return publishVersion(kind, state, action.language, originalLanguage);
	}

	if (action.type === 'unpublish') {
		return unpublishVersion(kind, state, action.language, originalLanguage);
	}

	return reconcileVersions(kind, state, action.completeness, originalLanguage);
}

function publishVersion<T>(
	kind: PublicationKind,
	state: PublicationState<T>,
	language: PublicationLanguage,
	originalLanguage: PublicationLanguage | undefined,
): PublicationTransition<T> {
	const draft = state.drafts[language];
	if (!draft) return blocked(state, ['draft.missing']);
	if (!draft.complete) return blocked(state, draft.errors.length ? draft.errors : ['draft.incomplete']);

	if (isLocalizedKind(kind) && language === 'en' && state.published.es === undefined) {
		return blocked(state, ['spanish.required']);
	}

	if (kind === 'criticalText') {
		if (!originalLanguage) return blocked(state, ['originalLanguage.required']);
		if (language !== originalLanguage && state.published[originalLanguage] === undefined) {
			return blocked(state, ['original.required']);
		}
	}

	const published = { ...state.published, [language]: draft.content };
	const drafts = { ...state.drafts };
	delete drafts[language];
	return {
		state: { published, drafts },
		publicationChanged: true,
		errors: [],
	};
}

function unpublishVersion<T>(
	kind: PublicationKind,
	state: PublicationState<T>,
	language: PublicationLanguage | undefined,
	originalLanguage: PublicationLanguage | undefined,
): PublicationTransition<T> {
	const published = { ...state.published };
	if (!language || (isLocalizedKind(kind) && language === 'es')) {
		return {
			state: { published: {}, drafts: { ...state.drafts } },
			publicationChanged: hasPublishedVersion(published),
			errors: [],
		};
	}

	if (kind === 'criticalText' && (!originalLanguage || language === originalLanguage)) {
		return {
			state: { published: {}, drafts: { ...state.drafts } },
			publicationChanged: hasPublishedVersion(published),
			errors: [],
		};
	}

	const publicationChanged = published[language] !== undefined;
	delete published[language];
	return {
		state: { published, drafts: { ...state.drafts } },
		publicationChanged,
		errors: [],
	};
}

function reconcileVersions<T>(
	kind: PublicationKind,
	state: PublicationState<T>,
	completeness: Partial<Record<PublicationLanguage, boolean>>,
	originalLanguage: PublicationLanguage | undefined,
): PublicationTransition<T> {
	const published = { ...state.published };
	if (kind === 'criticalText') {
		if (
			!originalLanguage ||
			published[originalLanguage] === undefined ||
			completeness[originalLanguage] === false
		) {
			const publicationChanged = hasPublishedVersion(published);
			return {
				state: { published: {}, drafts: { ...state.drafts } },
				publicationChanged,
				errors: [],
			};
		}

		const optionalLanguage = oppositeLanguage(originalLanguage);
		if (completeness[optionalLanguage] === false) delete published[optionalLanguage];
	} else {
		if (completeness.es === false) {
			const publicationChanged = hasPublishedVersion(published);
			return {
				state: { published: {}, drafts: { ...state.drafts } },
				publicationChanged,
				errors: [],
			};
		}
		if (completeness.en === false || published.es === undefined) delete published.en;
	}

	return {
		state: { published, drafts: { ...state.drafts } },
		publicationChanged: hasPublishedVersion(published) !== hasPublishedVersion(state.published) ||
			published.es !== state.published.es || published.en !== state.published.en,
		errors: [],
	};
}

function blocked<T>(state: PublicationState<T>, errors: string[]): PublicationTransition<T> {
	return {
		state: { published: { ...state.published }, drafts: { ...state.drafts } },
		publicationChanged: false,
		errors,
	};
}

function isLocalizedKind(kind: PublicationKind): boolean {
	return kind !== 'criticalText';
}

function oppositeLanguage(language: PublicationLanguage): PublicationLanguage {
	return language === 'es' ? 'en' : 'es';
}

function hasPublishedVersion<T>(published: PublicationState<T>['published']): boolean {
	return Object.values(published).some((version) => version !== undefined);
}
