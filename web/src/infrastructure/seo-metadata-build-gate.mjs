import { promises as fs } from 'node:fs';
import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function createSeoMetadataBuildGate(assertUniqueSeoMetadata) {
	return {
		name: 'seo-metadata-build-gate',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				await assertUniqueSeoMetadataInBuild(dir, assertUniqueSeoMetadata);
			},
		},
	};
}

export async function assertUniqueSeoMetadataInBuild(outputDirectory, assertUniqueSeoMetadata) {
	const rootPath = fileURLToPath(outputDirectory);
	const htmlFiles = await collectHtmlFiles(rootPath, rootPath);
	const entries = [];

	for (const file of htmlFiles) {
		const path = normalizePath(file.relativePath);
		if (isNotFoundPath(path)) continue;

		const html = await fs.readFile(file.absolutePath, 'utf8');
		const title = extractTitle(html);
		const description = extractDescription(html);
		entries.push({ path: pagePath(path), title, ...(description ? { description } : {}) });
	}

	assertUniqueSeoMetadata(entries);
}

async function collectHtmlFiles(directory, rootPath) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const nestedFiles = await Promise.all(entries.map(async (entry) => {
		const absolutePath = `${directory}${sep}${entry.name}`;
		if (entry.isDirectory()) return collectHtmlFiles(absolutePath, rootPath);
		if (!entry.isFile() || !entry.name.endsWith('.html')) return [];
		return [{ absolutePath, relativePath: relative(rootPath, absolutePath) }];
	}));
	return nestedFiles.flat();
}

function normalizePath(path) {
	return path.replaceAll(sep, '/');
}

function isNotFoundPath(path) {
	return path === '404.html' || path === '404/index.html';
}

function pagePath(relativePath) {
	if (relativePath === 'index.html') return '/';
	if (relativePath.endsWith('/index.html')) {
		return `/${relativePath.slice(0, -'index.html'.length)}`;
	}
	return `/${relativePath.replace(/\.html$/u, '')}`;
}

function extractTitle(html) {
	return html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/iu)?.[1]?.trim() ?? '';
}

function extractDescription(html) {
	const tag = html.match(/<meta\b[^>]*>/giu)
		?.find((candidate) => readAttribute(candidate, 'name')?.toLowerCase() === 'description');
	if (!tag) return undefined;

	const description = readAttribute(tag, 'content')?.trim();
	return description || undefined;
}

function readAttribute(tag, attribute) {
	const match = tag.match(new RegExp(`(?:^|\\s)${attribute}=["']([^"']*)["']`, 'iu'));
	return match?.[1];
}
