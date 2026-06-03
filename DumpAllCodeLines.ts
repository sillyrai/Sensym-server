import fs from 'node:fs/promises';
import path from 'node:path';

async function collectTypeScriptFiles(rootDir: string, ignoredNames = new Set(['node_modules', '.git', 'dist', 'build'])): Promise<string[]> {
	const entries = await fs.readdir(rootDir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name === '.git') {
			continue;
		}

		const fullPath = path.join(rootDir, entry.name);

		if (entry.isDirectory()) {
			if (ignoredNames.has(entry.name) || entry.name.startsWith('.')) {
				continue;
			}

			files.push(...await collectTypeScriptFiles(fullPath, ignoredNames));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.ts')) {
			files.push(fullPath);
		}
	}

	return files;
}

async function readSourceText(filePath: string): Promise<string> {
	return (await fs.readFile(filePath, 'utf8')).trimEnd();
}

async function main() {
	const rootDir = process.cwd();
	const outputFile = path.resolve(rootDir, 'ts-code-dump.txt');
	const scriptFile = path.resolve(__filename);
	const allFiles = await collectTypeScriptFiles(rootDir);
	const sortedFiles = allFiles
		.filter((filePath) => path.resolve(filePath) !== scriptFile)
		.sort((left, right) => left.localeCompare(right));

	const sections: string[] = [];

	for (const filePath of sortedFiles) {
		const contents = await readSourceText(filePath);
		sections.push(`${path.resolve(filePath)}\n[CODE]\n${contents}`);
	}

	await fs.writeFile(outputFile, sections.join('\n\n') + '\n', 'utf8');
	console.log(`Wrote ${sortedFiles.length} TypeScript file(s) to ${outputFile}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
