export interface Dimensions {
	heightCm: number;
	widthCm: number;
}

export function createDimensions(heightCm: unknown, widthCm: unknown): Dimensions | undefined {
	if (!isValidDimension(heightCm) || !isValidDimension(widthCm)) {
		return undefined;
	}

	return { heightCm, widthCm };
}

function isValidDimension(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value > 0 && Number.isInteger(value * 10);
}
