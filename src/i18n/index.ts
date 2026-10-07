import { en } from './en';
import { es } from './es';

export type Locale = 'es' | 'en';
export type Messages = { [Key in keyof typeof es]: string };

export const messages: Record<Locale, Messages> = { es, en };

export function getMessages(locale: Locale): Messages {
	return messages[locale];
}

export function getLocaleFromPath(path: string): Locale | undefined {
	if (path === '/') return 'es';
	if (path === '/en/') return 'en';
	return undefined;
}
