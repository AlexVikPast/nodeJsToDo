import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));

// console.log('*********');
// console.log(currentDir);
// console.log('*********');


export { currentDir };