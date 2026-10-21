import { describe, expect, it } from 'vitest'
import { validateContactInquiry, type ContactInquiryInput } from './contact-inquiry'

const validInput: ContactInquiryInput = {
	name: 'Alejandra Rivera',
	email: 'alejandra@example.org',
	message: 'Me gustaría recibir información sobre una obra.',
	locale: 'es',
}

describe('validateContactInquiry', () => {
	it('trims required values and accepts a valid email without mutating the input', () => {
		const input: ContactInquiryInput = {
			...validInput,
			name: '  Alejandra Rivera  ',
			email: '  Alejandra+portfolio@example.org  ',
			message: '  Consulta sobre una obra.  ',
		}
		const original = { ...input }

		const result = validateContactInquiry(input)

		expect(result).toEqual({
			inquiry: {
				name: 'Alejandra Rivera',
				email: 'Alejandra+portfolio@example.org',
				message: 'Consulta sobre una obra.',
				locale: 'es',
			},
			errors: {},
		})
		expect(input).toEqual(original)
	})

	it('trims optional values and omits optional fields that are empty', () => {
		const result = validateContactInquiry({
			...validInput,
			institution: '  Museo de ejemplo  ',
			phone: '  +34 (612) 345-678  ',
			artworkId: '  artwork-123  ',
		})

		expect(result).toEqual({
			inquiry: {
				...validInput,
				institution: 'Museo de ejemplo',
				phone: '+34 (612) 345-678',
				artworkId: 'artwork-123',
			},
			errors: {},
		})
		expect(validateContactInquiry({
			...validInput,
			institution: '  ',
			phone: '',
			artworkId: ' ',
		}).inquiry).toEqual(validInput)
	})

	it.each([
		['name', { name: '  ' }],
		['email', { email: '\t ' }],
		['message', { message: '\n ' }],
	] as const)('reports a required-field error for blank %s', (field, update) => {
		const input = { ...validInput, ...update }
		const original = { ...input }

		const result = validateContactInquiry(input)

		expect(result.inquiry).toBeUndefined()
		expect(result.errors).toEqual({ [field]: 'required' })
		expect(input).toEqual(original)
	})

	it.each(['not-an-email', 'name@@example.org', 'name@localhost', 'name @example.org']) (
		'rejects an invalid email format: %s',
		(email) => {
			expect(validateContactInquiry({ ...validInput, email }).errors.email)
				.toBe('invalidFormat')
		},
	)

	it('accepts exact maximum lengths for every bounded field', () => {
		const maximumEmail = `a@${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(60)}`
		const maximumPhone = `+${'1-'.repeat(14)}1`
		const input: ContactInquiryInput = {
			...validInput,
			name: 'n'.repeat(100),
			email: maximumEmail,
			institution: 'i'.repeat(150),
			phone: maximumPhone,
			message: 'm'.repeat(5_000),
		}

		const result = validateContactInquiry(input)

		expect(maximumEmail).toHaveLength(254)
		expect(maximumPhone).toHaveLength(30)
		expect(result.errors).toEqual({})
		expect(result.inquiry).toEqual(input)
	})

	it('rejects values over their maximum lengths with field-specific errors', () => {
		const result = validateContactInquiry({
			...validInput,
			name: 'n'.repeat(101),
			email: `a@${'b'.repeat(253)}`,
			institution: 'i'.repeat(151),
			phone: `+${'1-'.repeat(14)}1-`,
			message: 'm'.repeat(5_001),
		})

		expect(result.inquiry).toBeUndefined()
		expect(result.errors).toEqual({
			name: 'tooLong',
			email: 'tooLong',
			institution: 'tooLong',
			phone: 'tooLong',
			message: 'tooLong',
		})
	})

	it.each([
		'+1234567',
		'123 456 789',
		'+34 (612) 345-678',
		'+1-2-3-4-5-6-7-8-9-0-1-2-3-4-5',
	])('accepts a phone with 7–15 digits and permitted separators: %s', (phone) => {
		expect(validateContactInquiry({ ...validInput, phone }).errors).toEqual({})
	})

	it.each([
		'123456',
		'1234567890123456',
		'12+34567',
		'123-45A7',
		'(1234567',
		'1234567)',
	])('rejects an invalid phone value: %s', (phone) => {
		expect(validateContactInquiry({ ...validInput, phone }).errors.phone)
			.toBe('invalidFormat')
	})

	it('keeps the original values available to the caller when validation fails', () => {
		const input: ContactInquiryInput = {
			...validInput,
			name: '  Name as entered  ',
			email: 'bad address',
			message: '  Original message  ',
			phone: '12+34567',
		}
		const original = { ...input }

		const result = validateContactInquiry(input)

		expect(result.errors).toEqual({ email: 'invalidFormat', phone: 'invalidFormat' })
		expect(input).toEqual(original)
	})
})
