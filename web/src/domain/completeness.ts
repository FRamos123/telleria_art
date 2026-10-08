import { isAvailability } from './availability';
import { createExhibitionDates, type ExhibitionDates } from './calendar-date';
import { createDimensions } from './dimensions';
import { createInventoryNumber } from './inventory-number';

export interface EditorialImage {
	assetId: string;
	altText: string;
}

export interface SeriesOptionalContent {
	description?: string;
	image?: EditorialImage;
}

export interface SeriesCompletenessResult {
	complete: boolean;
	errors: string[];
	optional: SeriesOptionalContent;
}

export interface ExhibitionOptionalContent {
	image?: EditorialImage;
	artworkIds?: string[];
	seriesIds?: string[];
}

export interface ExhibitionCompletenessResult {
	complete: boolean;
	errors: string[];
	dates: ExhibitionDates | undefined;
	optional: ExhibitionOptionalContent;
}

export type CriticalTextLanguage = 'es' | 'en';

export interface CriticalTextTranslation {
	title: string;
	body: string;
	author: string;
}

export interface CriticalTextOptionalContent {
	artworkIds?: string[];
	seriesIds?: string[];
}

export interface CriticalTextCompletenessResult {
	complete: boolean;
	errors: string[];
	originalLanguage?: CriticalTextLanguage;
	translations: Partial<Record<CriticalTextLanguage, CriticalTextTranslation>>;
	optional: CriticalTextOptionalContent;
}

export interface ArtworkOptionalContent {
	workshopNote?: string;
	criticalTextIds?: string[];
}

export interface ArtworkCompletenessResult {
	complete: boolean;
	errors: string[];
	optional: ArtworkOptionalContent;
}

/** Validates shared artwork data and the localized fields required for one language. */
export function checkArtworkCompleteness(
	input: unknown,
	currentYear: number,
): ArtworkCompletenessResult {
	const artwork = asRecord(input);
	const translation = asRecord(artwork?.translation);
	const errors: string[] = [];

	if (!hasText(artwork?.seriesId)) errors.push('seriesId');
	if (!hasImageAsset(artwork?.mainImage)) errors.push('mainImage');
	if (!isValidYear(artwork?.year, currentYear)) errors.push('year');
	if (!createDimensions(artwork?.heightCm, artwork?.widthCm)) errors.push('dimensions');
	if (!createInventoryNumber(artwork?.inventoryNumber, currentYear)) {
		errors.push('inventoryNumber');
	}
	if (!isAvailability(artwork?.availability)) errors.push('availability');

	const title = normalizedText(translation?.title);
	if (!title) errors.push('translation.title');
	if (!hasText(translation?.technique)) errors.push('translation.technique');
	if (!hasText(translation?.support)) errors.push('translation.support');
	if (!isValidAlternativeText(translation?.altText, title)) {
		errors.push('translation.altText');
	}

	return {
		complete: errors.length === 0,
		errors,
		optional: normalizeOptionalContent(artwork),
	};
}

/** Validates one localized series version and normalizes its optional content. */
export function checkSeriesCompleteness(input: unknown): SeriesCompletenessResult {
	const series = asRecord(input);
	const translation = asRecord(series?.translation);
	const name = normalizedText(translation?.name);
	const errors: string[] = [];
	if (!name) errors.push('translation.name');

	const optional: SeriesOptionalContent = {};
	const description = normalizedText(translation?.description);
	if (description) optional.description = description;

	const image = normalizeEditorialImage(series?.image, translation?.imageAlt, name);
	if (image) optional.image = image;

	return { complete: errors.length === 0, errors, optional };
}

/** Validates one localized exhibition version, its shared dates, and optional relations. */
export function checkExhibitionCompleteness(input: unknown): ExhibitionCompletenessResult {
	const exhibition = asRecord(input);
	const translation = asRecord(exhibition?.translation);
	const title = normalizedText(translation?.title);
	const errors: string[] = [];
	if (!title) errors.push('translation.title');
	if (!hasText(translation?.venue)) errors.push('translation.venue');

	const endDate = normalizedText(exhibition?.endDate);
	const dates = createExhibitionDates(exhibition?.startDate, endDate);
	if (!dates) errors.push('dates');

	const optional: ExhibitionOptionalContent = {};
	const image = normalizeEditorialImage(exhibition?.image, translation?.imageAlt, title);
	if (image) optional.image = image;

	const artworkIds = normalizeIds(exhibition?.artworkIds);
	if (artworkIds) optional.artworkIds = artworkIds;
	const seriesIds = normalizeIds(exhibition?.seriesIds);
	if (seriesIds) optional.seriesIds = seriesIds;

	return { complete: errors.length === 0, errors, dates, optional };
}

/** Validates a critical text's declared original and retains only complete translations. */
export function checkCriticalTextCompleteness(input: unknown): CriticalTextCompletenessResult {
	const criticalText = asRecord(input);
	const translations = asRecord(criticalText?.translations);
	const originalLanguage = isCriticalTextLanguage(criticalText?.originalLanguage)
		? criticalText.originalLanguage
		: undefined;

	if (!originalLanguage) {
		return {
			complete: false,
			errors: ['originalLanguage'],
			translations: {},
			optional: {},
		};
	}

	const original = validateCriticalTextTranslation(translations?.[originalLanguage], originalLanguage);
	if (!original.translation) {
		return {
			complete: false,
			errors: original.errors,
			originalLanguage,
			translations: {},
			optional: {},
		};
	}

	const optionalLanguage = originalLanguage === 'es' ? 'en' : 'es';
	const optionalTranslation = validateCriticalTextTranslation(
		translations?.[optionalLanguage],
		optionalLanguage,
	);
	const validTranslations: Partial<Record<CriticalTextLanguage, CriticalTextTranslation>> = {
		[originalLanguage]: original.translation,
	};
	if (optionalTranslation.translation) {
		validTranslations[optionalLanguage] = optionalTranslation.translation;
	}

	const artworkIds = normalizeIds(criticalText?.artworkIds);
	const seriesIds = normalizeIds(criticalText?.seriesIds);
	const optional: CriticalTextOptionalContent = {};
	if (artworkIds) optional.artworkIds = artworkIds;
	if (seriesIds) optional.seriesIds = seriesIds;

	return {
		complete: true,
		errors: [],
		originalLanguage,
		translations: validTranslations,
		optional,
	};
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: undefined;
}

function normalizedText(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const text = value.trim();
	return text.length > 0 ? text : undefined;
}

function hasText(value: unknown): boolean {
	return normalizedText(value) !== undefined;
}

function hasImageAsset(value: unknown): boolean {
	const image = asRecord(value);
	return hasText(image?.assetId);
}

function normalizeEditorialImage(
	imageValue: unknown,
	altTextValue: unknown,
	title: string | undefined,
): EditorialImage | undefined {
	const image = asRecord(imageValue);
	const assetId = normalizedText(image?.assetId);
	const altText = normalizedText(altTextValue);
	if (!assetId || !altText || !isValidAlternativeText(altText, title)) return undefined;
	return { assetId, altText };
}

function isValidYear(value: unknown, currentYear: number): value is number {
	return (
		typeof value === 'number' &&
		Number.isInteger(value) &&
		value >= 1900 &&
		value <= currentYear &&
		value <= 9999
	);
}

export function isValidAlternativeText(value: unknown, titleValue?: unknown): boolean {
	const alternativeText = normalizedText(value);
	const title = normalizedText(titleValue);
	return (
		alternativeText !== undefined &&
		[...alternativeText].length <= 150 &&
		(title === undefined || alternativeText !== title)
	);
}

function normalizeOptionalContent(artwork: Record<string, unknown> | undefined): ArtworkOptionalContent {
	const optional: ArtworkOptionalContent = {};
	const workshopNote = normalizedText(artwork?.workshopNote);
	if (workshopNote) optional.workshopNote = workshopNote;

	if (Array.isArray(artwork?.criticalTextIds)) {
		const criticalTextIds = artwork.criticalTextIds
			.map(normalizedText)
			.filter((id): id is string => id !== undefined);
		if (criticalTextIds.length > 0) optional.criticalTextIds = criticalTextIds;
	}

	return optional;
}

function normalizeIds(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const ids = value.map(normalizedText).filter((id): id is string => id !== undefined);
	return ids.length > 0 ? ids : undefined;
}

function isCriticalTextLanguage(value: unknown): value is CriticalTextLanguage {
	return value === 'es' || value === 'en';
}

function validateCriticalTextTranslation(
	value: unknown,
	language: CriticalTextLanguage,
): { translation?: CriticalTextTranslation; errors: string[] } {
	const translation = asRecord(value);
	const title = normalizedText(translation?.title);
	const body = normalizedText(translation?.body);
	const author = normalizedText(translation?.author);
	const errors: string[] = [];
	if (!title) errors.push(`translations.${language}.title`);
	if (!body) errors.push(`translations.${language}.body`);
	if (!author) errors.push(`translations.${language}.author`);

	if (!title || !body || !author) return { errors };
	return { translation: { title, body, author }, errors };
}
