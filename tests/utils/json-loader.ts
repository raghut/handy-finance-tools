import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load a JSON file from the fixtures directory
 */
export function loadJsonFixture(filename: string) {
  const filePath = join(process.cwd(), 'tests', 'fixtures', filename);
  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
} 