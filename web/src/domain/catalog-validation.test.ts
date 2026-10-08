import { describe, expect, it } from 'vitest';
import { createInventoryNumber } from './inventory-number';
import {
	assertUniqueInventoryNumbers,
	findDuplicateInventoryNumbers,
	type CatalogArtworkInventory,
} from './catalog-validation';

const artwork = (id: string, value: string): CatalogArtworkInventory => {
	const inventoryNumber = createInventoryNumber(value, 2026);
	if (!inventoryNumber) throw new Error(`Invalid test inventory number: ${value}`);
	return { id, inventoryNumber };
};

describe('findDuplicateInventoryNumbers', () => {
	it('returns no duplicates for a catalog with unique inventory numbers', () => {
		const catalog = [
			artwork('artwork-1', 'AFT-2023-001'),
			artwork('artwork-2', 'AFT-2024-002'),
		];

		expect(findDuplicateInventoryNumbers(catalog)).toEqual([]);
	});

	it('reports every duplicate inventory value and all artwork IDs using it', () => {
		const catalog = [
			artwork('artwork-1', 'AFT-2023-001'),
			artwork('artwork-2', 'AFT-2024-002'),
			artwork('artwork-3', 'AFT-2023-001'),
			artwork('artwork-4', 'AFT-2024-002'),
			artwork('artwork-5', 'AFT-2023-001'),
		];

		expect(findDuplicateInventoryNumbers(catalog)).toEqual([
			{ inventoryNumber: 'AFT-2023-001', artworkIds: ['artwork-1', 'artwork-3', 'artwork-5'] },
			{ inventoryNumber: 'AFT-2024-002', artworkIds: ['artwork-2', 'artwork-4'] },
		]);
	});
});

describe('assertUniqueInventoryNumbers', () => {
	it('allows a catalog with unique inventory numbers through the build gate', () => {
		expect(() => assertUniqueInventoryNumbers([
			artwork('artwork-1', 'AFT-2023-001'),
			artwork('artwork-2', 'AFT-2024-002'),
		])).not.toThrow();
	});

	it('throws a build-blocking error that identifies duplicate values and artwork IDs', () => {
		expect(() => assertUniqueInventoryNumbers([
			artwork('artwork-1', 'AFT-2023-001'),
			artwork('artwork-2', 'AFT-2023-001'),
		])).toThrow(/AFT-2023-001.*artwork-1.*artwork-2/);
	});
});
