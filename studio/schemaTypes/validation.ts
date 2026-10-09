import { createCalendarDate, createExhibitionDates } from '../../web/src/domain/calendar-date'
import { createInventoryNumber } from '../../web/src/domain/inventory-number'

export const validationMessages = {
  requiredText: 'Este campo es obligatorio y no puede contener solo espacios.',
  language: 'Selecciona español (ES) o inglés (EN).',
  artworkYear: 'Indica un año entero de cuatro cifras entre 1900 y el año actual.',
  inventoryNumber: 'Usa el formato AFT-AAAA-NNN con año válido y secuencia entre 001 y 999.',
  duplicateInventoryNumber: 'Este número de inventario ya está asignado a otra obra.',
  imageAsset: 'Selecciona una imagen existente.',
  dimensions: 'Indica alto y ancho positivos, con un máximo de un decimal.',
  alternativeText: 'El texto alternativo debe ser distinto del título y tener entre 1 y 150 caracteres.',
  exhibitionDate: 'Indica una fecha real de calendario y que el fin no sea anterior al inicio.',
} as const

export function hasRequiredText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === ''
}

export function isEditorialLanguage(value: unknown): boolean {
  return value === 'es' || value === 'en'
}

export function isValidArtworkYear(value: unknown, currentYear = new Date().getFullYear()): boolean {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= 1900
    && value <= currentYear
}

export function isValidEditorialInventoryNumber(
  value: unknown,
  currentYear = new Date().getFullYear(),
): boolean {
  return createInventoryNumber(value, currentYear) !== undefined
}

export function isValidDimensionValue(value: unknown): boolean {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value > 0
    && Number.isInteger(value * 10)
}

export function hasImageAsset(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const asset = (value as { asset?: unknown }).asset
  if (typeof asset !== 'object' || asset === null) return false
  const reference = (asset as { _ref?: unknown })._ref
  return typeof reference === 'string' && reference.trim().length > 0
}

export function isValidExhibitionDateRange(
  startDate: unknown,
  endDate: unknown,
): boolean {
  if (!createCalendarDate(startDate)) return false
  return endDate === undefined || endDate === null || endDate === ''
    ? createExhibitionDates(startDate) !== undefined
    : createExhibitionDates(startDate, endDate) !== undefined
}
