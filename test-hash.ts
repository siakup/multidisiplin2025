import { createHash } from 'crypto';
const input = '1234';
const hash = createHash('sha256').update(input).digest('hex');
console.log(`Input: ${input}`);
console.log(`Hash: ${hash}`);
