import { readFile } from 'node:fs/promises';
import type { Persona } from './types.js';

export async function loadPersona(path: string): Promise<Persona> {
  const content = await readFile(path, 'utf8');
  return JSON.parse(content) as Persona;
}
