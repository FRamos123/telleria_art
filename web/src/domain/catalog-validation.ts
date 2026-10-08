import type { InventoryNumber } from './inventory-number';

export interface CatalogArtworkInventory {
	id: string;
	inventoryNumber: InventoryNumber;
}

export interface DuplicateInventoryNumber {
	inventoryNumber: InventoryNumber;
	artworkIds: string[];
}

/** Finds every inventory number assigned to more than one artwork in the catalog. */
export function findDuplicateInventoryNumbers(
	artworks: readonly CatalogArtworkInventory[],
): DuplicateInventoryNumber[] {
	const artworkIdsByInventoryNumber = new Map<InventoryNumber, string[]>();

	for (const artwork of artworks) {
		const artworkIds = artworkIdsByInventoryNumber.get(artwork.inventoryNumber) ?? [];
		artworkIds.push(artwork.id);
		artworkIdsByInventoryNumber.set(artwork.inventoryNumber, artworkIds);
	}

	return [...artworkIdsByInventoryNumber]
		.filter(([, artworkIds]) => artworkIds.length > 1)
		.map(([inventoryNumber, artworkIds]) => ({ inventoryNumber, artworkIds }));
}

/** Throws a descriptive error so a build can stop before emitting a duplicate catalog. */
export function assertUniqueInventoryNumbers(
	artworks: readonly CatalogArtworkInventory[],
): void {
	const duplicates = findDuplicateInventoryNumbers(artworks);
	if (duplicates.length === 0) return;

	const details = duplicates
		.map(({ inventoryNumber, artworkIds }) => `${inventoryNumber} (${artworkIds.join(', ')})`)
		.join('; ');
	throw new Error(`Duplicate inventory numbers: ${details}`);
}
