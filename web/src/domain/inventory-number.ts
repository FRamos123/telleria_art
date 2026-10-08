export type InventoryNumber = string & { readonly __inventoryNumber: unique symbol };

export function createInventoryNumber(
	value: unknown,
	currentYear: number,
): InventoryNumber | undefined {
	if (typeof value !== 'string') {
		return undefined;
	}

	const match = /^AFT-(\d{4})-(\d{3})$/.exec(value);
	if (!match) {
		return undefined;
	}

	const year = Number(match[1]);
	const sequence = Number(match[2]);
	if (year < 1900 || year > currentYear || sequence < 1 || sequence > 999) {
		return undefined;
	}

	return value as InventoryNumber;
}
