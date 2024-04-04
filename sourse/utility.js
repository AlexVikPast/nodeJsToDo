import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));

export { currentDir };

const pbkdf2Promisified = promisify(pbkdf2);
export { pbkdf2Promisified };