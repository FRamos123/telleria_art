import type { PublicationLanguage } from './publication'

export interface ContactInquiryInput {
	name: string
	email: string
	message: string
	locale: PublicationLanguage
	institution?: string
	phone?: string
	artworkId?: string
}

export interface ContactInquiry extends ContactInquiryInput {}

export type ContactInquiryField = 'name' | 'email' | 'message' | 'institution' | 'phone'
export type ContactInquiryError = 'required' | 'tooLong' | 'invalidFormat'
export type ContactInquiryErrors = Partial<Record<ContactInquiryField, ContactInquiryError>>

export interface ContactInquiryValidation {
	inquiry?: ContactInquiry
	errors: ContactInquiryErrors
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Normalizes a contact form submission and returns field-level, locale-neutral errors. */
export function validateContactInquiry(input: ContactInquiryInput): ContactInquiryValidation {
	const name = input.name.trim()
	const email = input.email.trim()
	const message = input.message.trim()
	const institution = normalizeOptional(input.institution)
	const phone = normalizeOptional(input.phone)
	const artworkId = normalizeOptional(input.artworkId)
	const errors: ContactInquiryErrors = {}

	if (!name) errors.name = 'required'
	else if (name.length > 100) errors.name = 'tooLong'

	if (!email) errors.email = 'required'
	else if (email.length > 254) errors.email = 'tooLong'
	else if (!EMAIL_PATTERN.test(email)) errors.email = 'invalidFormat'

	if (!message) errors.message = 'required'
	else if (message.length > 5_000) errors.message = 'tooLong'

	if (institution && institution.length > 150) errors.institution = 'tooLong'

	if (phone) {
		if (phone.length > 30) errors.phone = 'tooLong'
		else if (!isValidPhone(phone)) errors.phone = 'invalidFormat'
	}

	if (Object.keys(errors).length > 0) return { errors }

	return {
		inquiry: {
			name,
			email,
			message,
			locale: input.locale,
			...(institution ? { institution } : {}),
			...(phone ? { phone } : {}),
			...(artworkId ? { artworkId } : {}),
		},
		errors,
	}
}

function normalizeOptional(value: string | undefined): string | undefined {
	const normalized = value?.trim()
	return normalized || undefined
}

function isValidPhone(value: string): boolean {
	if (!/^\+?[0-9 ()-]+$/.test(value)) return false

	const digitCount = value.replace(/[^0-9]/g, '').length
	if (digitCount < 7 || digitCount > 15) return false

	let insideParentheses = false
	for (const character of value) {
		if (character === '(') {
			if (insideParentheses) return false
			insideParentheses = true
		} else if (character === ')') {
			if (!insideParentheses) return false
			insideParentheses = false
		}
	}

	return !insideParentheses
}
