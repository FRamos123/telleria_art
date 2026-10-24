import { describe, expect, it, vi } from 'vitest'
import { onRequest, validateContactRequest, type ContactEnvironment } from './contact'

const turnstileVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const publishedArtworkIndex = { es: ['artwork-es'], en: ['artwork-en'] }

function createFormData(overrides: Record<string, string> = {}): FormData {
	const values: Record<string, string> = {
		name: '  [TEST] Ana  ',
		email: ' ana@example.org ',
		message: ' [TEST] Consulta sintética ',
		locale: 'es',
		turnstileToken: 'turnstile-test-token',
		...overrides,
	}
	const formData = new FormData()
	for (const [name, value] of Object.entries(values)) formData.set(name, value)
	return formData
}

function createRequest(formData: FormData, method = 'POST'): Request {
	return new Request('https://portfolio.test/api/contact', { method, body: formData })
}

function createEnvironment(overrides: Partial<ContactEnvironment> = {}): ContactEnvironment {
	return {
		CONTACT_RECIPIENT: 'consultas@gmail.com',
		TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
		TURNSTILE_HOSTNAMES: 'portfolio.test',
		RESEND_API_KEY: 'test-resend-api-key',
		CONTACT_FROM: 'Alejandro Fernández Tellería <contact@example.org>',
		ASSETS: {
			fetch: vi.fn(async () => new Response(JSON.stringify(publishedArtworkIndex), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			})),
		},
		...overrides,
	}
}

function turnstileFetcher(result: boolean | Record<string, unknown>, expectedToken = 'turnstile-test-token') {
	return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
		expect(String(input)).toBe(turnstileVerifyUrl)
		expect(init?.method).toBe('POST')
		expect(init?.signal).toBeInstanceOf(AbortSignal)
		const body = init?.body as URLSearchParams
		expect(body.get('secret')).toBe('test-turnstile-secret')
		expect(body.get('response')).toBe(expectedToken)
		const siteverifyResult = typeof result === 'boolean'
			? { success: result, action: 'contact', hostname: 'portfolio.test' }
			: result
		return new Response(JSON.stringify(siteverifyResult), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		})
	})
}

function resendFetcher(options: {
	turnstileSuccess?: boolean
	turnstileResult?: Record<string, unknown>
	resendStatus?: number
	resendBody?: unknown
	resendError?: Error
} = {}) {
	const calls: Array<{ url: string; init?: RequestInit }> = []
	const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(input)
		calls.push({ url, init })
		if (url === turnstileVerifyUrl) {
			const siteverifyResult = options.turnstileResult
				?? { success: options.turnstileSuccess ?? true, action: 'contact', hostname: 'portfolio.test' }
			return new Response(JSON.stringify(siteverifyResult), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			})
		}
		if (url === 'https://api.resend.com/emails') {
			if (options.resendError) throw options.resendError
			return new Response(JSON.stringify(options.resendBody ?? { id: 'resend-test-id' }), {
				status: options.resendStatus ?? 200,
				headers: { 'content-type': 'application/json' },
			})
		}
		throw new Error(`Unexpected request URL: ${url}`)
	})
	return { fetcher, calls }
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
	return await response.json() as Record<string, unknown>
}

describe('contact Pages Function', () => {
	it('rejects methods other than POST without making external requests', async () => {
		const fetcher = vi.fn()
		const response = await onRequest({
			request: new Request('https://portfolio.test/api/contact', { method: 'GET' }),
			env: createEnvironment(),
		}, fetcher)

		expect(response.status).toBe(405)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'invalidRequest' })
		expect(response.headers.get('allow')).toBe('POST')
		expect(fetcher).not.toHaveBeenCalled()
	})

	it.each([
		[{ CONTACT_RECIPIENT: undefined }, 'missing recipient'],
		[{ CONTACT_RECIPIENT: 'consultas@example.invalid' }, 'placeholder recipient'],
		[{ TURNSTILE_SECRET_KEY: undefined }, 'missing Turnstile secret'],
	])('fails closed for %s', async (environment, _caseName) => {
		const fetcher = vi.fn()
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(environment),
		}, fetcher)

		expect(response.status).toBe(503)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'deliveryUnavailable' })
		expect(fetcher).not.toHaveBeenCalled()
	})

	it('returns field-level validation errors before contacting Turnstile', async () => {
		const fetcher = vi.fn()
		const result = await validateContactRequest(
			createRequest(createFormData({ email: 'not-an-email', message: '   ' })),
			createEnvironment(),
			fetcher,
		)

		expect(result.ok).toBe(false)
		if (!result.ok) {
			expect(result.response.status).toBe(400)
			expect(await responseBody(result.response)).toEqual({
				ok: false,
				code: 'validation',
				errors: { email: 'invalidFormat', message: 'required' },
			})
		}
		expect(fetcher).not.toHaveBeenCalled()
	})

	it('accepts a valid general inquiry without a consent field', async () => {
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(),
		}, resendFetcher().fetcher)

		expect(response.status).toBe(200)
		expect(await responseBody(response)).toEqual({ ok: true, code: 'accepted' })
	})

	it('rejects artwork absent from the deployed locale index without exposing artwork data', async () => {
		const env = createEnvironment()
		const fetcher = vi.fn()
		const response = await onRequest({
			request: createRequest(createFormData({ artworkId: 'unpublished-artwork' })),
			env,
		}, fetcher)

		expect(response.status).toBe(409)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'artworkUnavailable' })
		expect(env.ASSETS?.fetch).toHaveBeenCalledWith(expect.any(Request))
		expect(fetcher).not.toHaveBeenCalled()
	})

	it('fails closed if the deployed artwork index cannot be read', async () => {
		const env = createEnvironment({
			ASSETS: { fetch: vi.fn(async () => new Response('missing', { status: 404 })) },
		})
		const response = await onRequest({
			request: createRequest(createFormData({ artworkId: 'artwork-es' })),
			env,
		}, turnstileFetcher(true))

		expect(response.status).toBe(503)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'deliveryUnavailable' })
	})

	it('rejects failed Turnstile verification without exposing the token', async () => {
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(),
		}, turnstileFetcher(false))

		expect(response.status).toBe(403)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'spamRejected' })
	})

	it.each([
		{ siteverifyResult: { success: true }, label: 'missing action and hostname' },
		{ siteverifyResult: { success: true, hostname: 'portfolio.test' }, label: 'missing action' },
		{ siteverifyResult: { success: true, action: 'contact' }, label: 'missing hostname' },
		{ siteverifyResult: { success: true, action: 'newsletter', hostname: 'portfolio.test' }, label: 'unexpected action' },
		{ siteverifyResult: { success: true, action: 'contact', hostname: 'other.test' }, label: 'unapproved hostname' },
	])('rejects Siteverify results with $label', async ({ siteverifyResult }) => {
		const { fetcher, calls } = resendFetcher({ turnstileResult: siteverifyResult })
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(),
		}, fetcher)

		expect(response.status).toBe(403)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'spamRejected' })
		expect(calls.map(({ url }) => url)).toEqual([turnstileVerifyUrl])
	})

	it.each([
		{ environment: { TURNSTILE_HOSTNAMES: undefined }, label: 'missing hostname allowlist' },
		{ environment: { TURNSTILE_HOSTNAMES: '   ' }, label: 'empty hostname allowlist' },
	])('fails closed before Siteverify for $label', async ({ environment }) => {
		const fetcher = vi.fn()
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(environment),
		}, fetcher)

		expect(response.status).toBe(403)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'spamRejected' })
		expect(fetcher).not.toHaveBeenCalled()
	})

	it.each(['', '   ', 'x'.repeat(2049), `${' '.repeat(2048)}x`])('rejects a Turnstile token outside the 1–2048 character limit', async (token) => {
		const fetcher = vi.fn()
		const response = await onRequest({
			request: createRequest(createFormData({ turnstileToken: token })),
			env: createEnvironment(),
		}, fetcher)

		expect(response.status).toBe(403)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'spamRejected' })
		expect(fetcher).not.toHaveBeenCalled()
	})

	it('accepts a Turnstile token at the 2048-character limit', async () => {
		const token = 'x'.repeat(2048)
		const result = await validateContactRequest(
			createRequest(createFormData({ turnstileToken: token })),
			createEnvironment(),
			turnstileFetcher(true, token),
		)

		expect(result.ok).toBe(true)
	})

	it('uses a 10-second timeout for Siteverify', async () => {
		const timeoutSpy = vi.spyOn(AbortSignal, 'timeout')
		try {
			await validateContactRequest(
				createRequest(createFormData()),
				createEnvironment(),
				turnstileFetcher(true),
			)
			expect(timeoutSpy).toHaveBeenCalledWith(10_000)
		} finally {
			timeoutSpy.mockRestore()
		}
	})

	it('rejects a Siteverify timeout or network failure without calling Resend', async () => {
		const { fetcher, calls } = resendFetcher({ turnstileResult: { success: true } })
		fetcher.mockImplementation(async (input) => {
			const url = String(input)
			calls.push({ url })
			if (url === turnstileVerifyUrl) throw new Error('simulated timeout')
			throw new Error(`Unexpected request URL: ${url}`)
		})
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(),
		}, fetcher)

		expect(response.status).toBe(403)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'spamRejected' })
		expect(calls.map(({ url }) => url)).toEqual([turnstileVerifyUrl])
	})

	it('returns a validated normalized inquiry after Turnstile and locale-specific artwork checks pass', async () => {
		const env = createEnvironment()
		const fetcher = turnstileFetcher(true)
		const result = await validateContactRequest(
			createRequest(createFormData({ artworkId: 'artwork-es' })),
			env,
			fetcher,
		)

		expect(result).toEqual({
			ok: true,
			inquiry: {
				name: '[TEST] Ana',
				email: 'ana@example.org',
				message: '[TEST] Consulta sintética',
				locale: 'es',
				artworkId: 'artwork-es',
			},
		})
		expect(env.ASSETS?.fetch).toHaveBeenCalledWith(expect.any(Request))
		expect(fetcher).toHaveBeenCalledTimes(1)
	})

	it('does not log submitted personal data or the Turnstile token', async () => {
		const logSpies = [
			vi.spyOn(console, 'log').mockImplementation(() => undefined),
			vi.spyOn(console, 'info').mockImplementation(() => undefined),
			vi.spyOn(console, 'warn').mockImplementation(() => undefined),
			vi.spyOn(console, 'error').mockImplementation(() => undefined),
		]
		try {
			await validateContactRequest(
				createRequest(createFormData()),
				createEnvironment(),
				turnstileFetcher(true),
			)
			expect(logSpies.every((spy) => spy.mock.calls.length === 0)).toBe(true)
		} finally {
			logSpies.forEach((spy) => spy.mockRestore())
		}
	})

	it('sends to Resend only after validation and Turnstile, then returns acceptance without provider details', async () => {
		const { fetcher, calls } = resendFetcher()
		const response = await onRequest({
			request: createRequest(createFormData({ artworkId: 'artwork-es' })),
			env: createEnvironment(),
		}, fetcher)

		const resendRequest = calls[1]
		const headers = new Headers(resendRequest?.init?.headers)
		const email = JSON.parse(String(resendRequest?.init?.body)) as Record<string, unknown>

		const responseData = await responseBody(response)
		expect(response.status).toBe(200)
		expect(responseData).toEqual({ ok: true, code: 'accepted' })
		expect(calls.map(({ url }) => url)).toEqual([turnstileVerifyUrl, 'https://api.resend.com/emails'])
		expect(headers.get('authorization')).toBe('Bearer test-resend-api-key')
		expect(email).toMatchObject({
			from: 'Alejandro Fernández Tellería <contact@example.org>',
			to: ['consultas@gmail.com'],
			reply_to: 'ana@example.org',
			subject: 'Consulta de contacto',
		})
		expect(email.text).toContain('[TEST] Ana')
		expect(email.text).toContain('[TEST] Consulta sintética')
		expect(email.text).toContain('artwork-es')
		expect(JSON.stringify(responseData)).not.toContain('test-resend-api-key')
	})

	it('does not call Resend when server validation fails', async () => {
		const { fetcher, calls } = resendFetcher()
		const response = await onRequest({
			request: createRequest(createFormData({ email: 'invalid-email' })),
			env: createEnvironment(),
		}, fetcher)

		expect(response.status).toBe(400)
		expect(await responseBody(response)).toMatchObject({
			ok: false,
			code: 'validation',
			errors: { email: 'invalidFormat' },
		})
		expect(calls).toHaveLength(0)
	})

	it.each([
		{ resendStatus: 500, resendBody: { message: '[TEST] private provider error' } },
		{ resendStatus: 200, resendBody: {} },
		{ resendError: new Error('simulated timeout') },
	])('fails closed when Resend does not confirm acceptance: $resendStatus', async (resendOptions) => {
		const { fetcher, calls } = resendFetcher(resendOptions)
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment(),
		}, fetcher)
		const body = await responseBody(response)

		expect(response.status).toBe(503)
		expect(body).toEqual({ ok: false, code: 'deliveryUnavailable' })
		expect(JSON.stringify(body)).not.toContain('private provider error')
		expect(JSON.stringify(body)).not.toContain('test-resend-api-key')
		expect(calls.map(({ url }) => url)).toEqual([turnstileVerifyUrl, 'https://api.resend.com/emails'])
	})

	it('does not call Resend if its credentials or sender are missing', async () => {
		const { fetcher, calls } = resendFetcher()
		const response = await onRequest({
			request: createRequest(createFormData()),
			env: createEnvironment({ RESEND_API_KEY: undefined, CONTACT_FROM: undefined }),
		}, fetcher)

		expect(response.status).toBe(503)
		expect(await responseBody(response)).toEqual({ ok: false, code: 'deliveryUnavailable' })
		expect(calls).toEqual([])
	})
})
