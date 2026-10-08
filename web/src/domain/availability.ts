export const AVAILABILITY_VALUES = [
	'disponible',
	'reservada',
	'vendida',
	'en colección',
] as const;

export type Availability = (typeof AVAILABILITY_VALUES)[number];

export function isAvailability(value: unknown): value is Availability {
	return typeof value === 'string' && AVAILABILITY_VALUES.some((availability) => availability === value);
}
