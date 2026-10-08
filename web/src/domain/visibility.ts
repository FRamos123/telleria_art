import type { PublicationLanguage } from './publication';

export type VisibilityByLanguage = Partial<Record<PublicationLanguage, ReadonlySet<string>>>;

export interface VisibleArtwork {
	seriesId: string;
}

export type VisibleArtworksByLanguage = Partial<
	Record<PublicationLanguage, readonly VisibleArtwork[]>
>;

/** A series is visible only when published and associated with a visible artwork in that language. */
export function isSeriesVisible(
	seriesId: string,
	language: PublicationLanguage,
	publishedSeriesIds: VisibilityByLanguage,
	visibleArtworks: VisibleArtworksByLanguage,
): boolean {
	return publishedSeriesIds[language]?.has(seriesId) === true &&
		(visibleArtworks[language] ?? []).some((artwork) => artwork.seriesId === seriesId);
}

/** Returns only relation IDs whose destinations are visible in the requested language. */
export function filterVisibleRelations<T extends string>(
	relationIds: readonly T[] | undefined,
	language: PublicationLanguage,
	visibleDestinationIds: VisibilityByLanguage,
): T[] {
	if (!relationIds) return [];
	const visibleIds = visibleDestinationIds[language];
	if (!visibleIds) return [];
	return relationIds.filter((id) => visibleIds.has(id));
}
