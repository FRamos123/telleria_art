import type { PublicationLanguage } from '../../src/domain/publication'
import { validateContactInquiry } from '../../src/domain/contact-inquiry'
import { isPublishedArtworkId } from './contact-artwork'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const PLACEHOLDER_RECIPIENT = 'consultas@example.invalid'

export interface ContactEnvironment {
	CONTACT_RECIPIENT?: string
	CONTACT_FROM?: string
	RESEND_API_KEY?: string
	TURNSTILE_SECRET_KEY?: string
	TURNSTILE_HOSTNAMES?: string
	ASSETS?: { fetch: (request: Request) => Promise<Response> }
}

export interface ContactRequestContext {
	request: Request
	env: ContactEnvironment
}

export type ContactFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

type ContactRequestValidation =
	| { ok: true; inquiry: NonNullable<ReturnType<typeof validateContactInquiry>['inquiry']> }
	| { ok: false; response: Response }

/** Cloudflare Pages Function entry point. */
export async function onRequest(
	{ request, env }: ContactRequestContext,
	fetcher: ContactFetch = fetch,
): Promise<Response> {
	const resendApiKey = env.RESEND_API_KEY?.trim()
	const sender = env.CONTACT_FROM?.trim()
	if (!resendApiKey || !isValidSender(sender)) {
		return jsonResponse({ ok: false, code: 'deliveryUnavailable' }, 503)
	}

	const validation = await validateContactRequest(request, env, fetcher)
	if (!validation.ok) return validation.response

	return sendInquiryViaResend(validation.inquiry, env, sender, resendApiKey, fetcher)
}

/** Validates request data, the published artwork snapshot, and Turnstile server-side. */
export async function validateContactRequest(
	request: Request,
	env: ContactEnvironment,
	fetcher: ContactFetch = fetch,
): Promise<ContactRequestValidation> {
	if (request.method !== 'POST') {
		return rejected({ ok: false, code: 'invalidRequest' }, 405, { allow: 'POST' })
	}

	const recipient = env.CONTACT_RECIPIENT?.trim()
	const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim()
	if (!isValidRecipient(recipient) || !turnstileSecret) {
		return rejected({ ok: false, code: 'deliveryUnavailable' }, 503)
	}

	let formData: FormData
	try {
		formData = await request.formData()
	} catch {
		return rejected({ ok: false, code: 'invalidRequest' }, 400)
	}

	const localeValue = readFormText(formData, 'locale')
	if (localeValue !== 'es' && localeValue !== 'en') {
		return rejected({ ok: false, code: 'invalidRequest' }, 400)
	}

	const fields = ['name', 'email', 'message', 'institution', 'phone', 'artworkId', 'turnstileToken'] as const
	if (fields.some((field) => isFileValue(formData.get(field)))) {
		return rejected({ ok: false, code: 'invalidRequest' }, 400)
	}

	const inquiryInput = {
		name: readFormText(formData, 'name') ?? '',
		email: readFormText(formData, 'email') ?? '',
		message: readFormText(formData, 'message') ?? '',
		locale: localeValue as PublicationLanguage,
		...(readFormText(formData, 'institution') !== undefined
			? { institution: readFormText(formData, 'institution') }
			: {}),
		...(readFormText(formData, 'phone') !== undefined
			? { phone: readFormText(formData, 'phone') }
			: {}),
		...(readFormText(formData, 'artworkId') !== undefined
			? { artworkId: readFormText(formData, 'artworkId') }
			: {}),
	}
	const validation = validateContactInquiry(inquiryInput)
	if (Object.keys(validation.errors).length > 0 || !validation.inquiry) {
		return rejected({ ok: false, code: 'validation', errors: validation.errors }, 400)
	}
	if (validation.inquiry.artworkId) {
		if (!env.ASSETS) return rejected({ ok: false, code: 'deliveryUnavailable' }, 503)

		let artworkIndex: unknown
		try {
			const indexUrl = new URL('/contact-artworks.json', request.url)
			const response = await env.ASSETS.fetch(new Request(indexUrl))
			if (!response.ok) return rejected({ ok: false, code: 'deliveryUnavailable' }, 503)
			artworkIndex = await response.json()
		} catch {
			return rejected({ ok: false, code: 'deliveryUnavailable' }, 503)
		}

		if (!isPublishedArtworkId(artworkIndex, validation.inquiry.artworkId, validation.inquiry.locale)) {
			return rejected({ ok: false, code: 'artworkUnavailable' }, 409)
		}
	}

	const token = readFormText(formData, 'turnstileToken')
	const expectedHostnames = getExpectedTurnstileHostnames(env.TURNSTILE_HOSTNAMES)
	if (
		!token?.trim()
		|| token.length > 2048
		|| expectedHostnames.size === 0
		|| !await verifyTurnstile(token, turnstileSecret, expectedHostnames, fetcher)
	) {
		return rejected({ ok: false, code: 'spamRejected' }, 403)
	}

	return { ok: true, inquiry: validation.inquiry }
}

function getExpectedTurnstileHostnames(value: string | undefined): Set<string> {
	return new Set(
		(value ?? '')
			.split(',')
			.map((hostname) => hostname.trim().toLowerCase())
			.filter(Boolean),
	)
}

async function verifyTurnstile(
	token: string,
	secret: string,
	expectedHostnames: ReadonlySet<string>,
	fetcher: ContactFetch,
): Promise<boolean> {
	try {
		const body = new URLSearchParams({ secret, response: token })
		const response = await fetcher(TURNSTILE_VERIFY_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			signal: AbortSignal.timeout(10_000),
			body,
		})
		if (!response.ok) return false
		const result: unknown = await response.json()
		return isRecord(result)
			&& result.success === true
			&& result.action === 'contact'
			&& typeof result.hostname === 'string'
			&& expectedHostnames.has(result.hostname.toLowerCase())
	} catch {
		return false
	}
}

function isValidRecipient(value: string | undefined): value is string {
	if (!value || value.toLowerCase() === PLACEHOLDER_RECIPIENT || value.toLowerCase().endsWith('.invalid')) {
		return false
	}
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)
}

function isValidSender(value: string | undefined): value is string {
	if (!value || /[\r\n]/u.test(value)) return false
	const displayAddress = /<([^<>]+)>$/u.exec(value.trim())?.[1]
	return isValidRecipient(displayAddress ?? value.trim())
}

async function sendInquiryViaResend(
	inquiry: NonNullable<ReturnType<typeof validateContactInquiry>['inquiry']>,
	env: ContactEnvironment,
	sender: string,
	apiKey: string,
	fetcher: ContactFetch,
): Promise<Response> {
	const recipient = env.CONTACT_RECIPIENT?.trim()
	if (!isValidRecipient(recipient)) {
		return jsonResponse({ ok: false, code: 'deliveryUnavailable' }, 503)
	}

	const subject = inquiry.locale === 'es' ? 'Consulta de contacto' : 'Contact inquiry'
	const body = [
		`Name: ${inquiry.name}`,
		`Email: ${inquiry.email}`,
		...(inquiry.institution ? [`Institution: ${inquiry.institution}`] : []),
		...(inquiry.phone ? [`Telephone: ${inquiry.phone}`] : []),
		...(inquiry.artworkId ? [`Artwork ID: ${inquiry.artworkId}`] : []),
		`Language: ${inquiry.locale}`,
		'',
		inquiry.message,
	].join('\n')

	try {
		const response = await fetcher('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: sender,
				to: [recipient],
				reply_to: inquiry.email,
				subject,
				text: body,
			}),
		})
		if (!response.ok) return jsonResponse({ ok: false, code: 'deliveryUnavailable' }, 503)

		const result: unknown = await response.json()
		if (!isRecord(result) || typeof result.id !== 'string' || !result.id.trim()) {
			return jsonResponse({ ok: false, code: 'deliveryUnavailable' }, 503)
		}

		return jsonResponse({ ok: true, code: 'accepted' }, 200)
	} catch {
		return jsonResponse({ ok: false, code: 'deliveryUnavailable' }, 503)
	}
}

function readFormText(formData: FormData, field: string): string | undefined {
	const value = formData.get(field)
	return typeof value === 'string' ? value : undefined
}

function isFileValue(value: FormDataEntryValue | null): value is File {
	return value !== null && typeof value !== 'string'
}

function rejected(
	body: Record<string, unknown>,
	status: number,
	extraHeaders: Record<string, string> = {},
): ContactRequestValidation {
	return {
		ok: false,
		response: jsonResponse(body, status, extraHeaders),
	}
}

function jsonResponse(
	body: Record<string, unknown>,
	status: number,
	extraHeaders: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'cache-control': 'no-store',
			'content-type': 'application/json; charset=utf-8',
			...extraHeaders,
		},
	})
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}
