import { join } from 'node:path';
import { readFileSync } from 'node:fs';

import { currentDir } from '../utility.js';

const dataFileName = join(currentDir, 'data', 'todos.json');

// console.log('*********');
// console.log(currentDir);
// console.log('*********');

const dataFile = readFileSync(dataFileName, 'utf8');
const database = JSON.parse(dataFile);
export { database };