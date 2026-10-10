import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { assertUniqueSeoMetadata } from '../domain/catalog-presentation.ts';
import { createSeoMetadataBuildGate } from './seo-metadata-build-gate.mjs';

const temporaryDirectories = [];

afterEach(async () => {
	await Promise.all(temporaryDirectories.splice(0).map((directory) =>
		rm(directory, { recursive: true, force: true }),
	));
});

describe('assertUniqueSeoMetadataInBuild', () => {
	it('fails the build gate for duplicate titles across rendered pages', async () => {
		const output = await createOutput({
			'index.html': '<title>Repeated title</title>',
			'obras/index.html': '<title>Repeated title</title>',
		});

		await expect(runBuildGate(output)).rejects.toThrow(/duplicate title/i);
	});

	it('fails the build gate for duplicate descriptions across rendered pages', async () => {
		const output = await createOutput({
			'index.html': '<title>Home ES</title><meta name="description" content="Repeated description">',
			'en/index.html': '<title>Home EN</title><meta name="description" content="Repeated description">',
		});

		await expect(runBuildGate(output)).rejects.toThrow(/duplicate description/i);
	});

	it('excludes absent metadata and the bilingual 404 page from comparisons', async () => {
		const output = await createOutput({
			'index.html': '<title>Home ES</title>',
			'en/index.html': '<title>Home EN</title><meta name="description" content="">',
			'404.html': '<title>Home ES</title><meta name="description" content="">',
		});

		await expect(runBuildGate(output)).resolves.toBeUndefined();
	});
});

async function runBuildGate(directory) {
	const integration = createSeoMetadataBuildGate(assertUniqueSeoMetadata);
	return integration.hooks['astro:build:done']({ dir: directory });
}

async function createOutput(files) {
	const directory = await mkdtemp(join(tmpdir(), 'aft-seo-metadata-'));
	temporaryDirectories.push(directory);

	await Promise.all(Object.entries(files).map(async ([filePath, content]) => {
		const absolutePath = join(directory, filePath);
		await mkdir(join(absolutePath, '..'), { recursive: true });
		await writeFile(absolutePath, content);
	}));

	return pathToFileURL(directory);
}
