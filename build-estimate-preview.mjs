// Rebuild the unchanged v0.5.0 browser-only estimator from its transfer archive.
// No passwords, customer records, local databases or service credentials are included.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const root = new URL('./', import.meta.url);
const expected = 'fc65082c74d54fa9c9a3b033956121cf403b617886dfac3770dca7a08d798e3d';
const parts = await Promise.all(Array.from({length:20}, (_,i) => readFile(new URL(`estimate-preview/part-${String(i+1).padStart(2,'0')}.txt`, root), 'utf8')));
const encoded = parts.join('').replace(/\s/g, '');
if (encoded.length !== 79532 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) throw new Error('Invalid estimator transfer archive');
const html = brotliDecompressSync(Buffer.from(encoded, 'base64'));
const actual = createHash('sha256').update(html).digest('hex');
if (actual !== expected || html.length !== 398502) throw new Error('Estimator integrity check failed; deployment stopped');
const text = html.toString('utf8');
if (!text.includes('noindex,nofollow,noarchive') || !text.includes("connect-src 'none'") || text.includes('data-runtime="server"')) throw new Error('Estimator preview safeguards missing');
await mkdir(new URL('dist/estimate/', root), {recursive:true});
await writeFile(new URL('dist/estimate/index.html', root), html);
console.log(`Estimator v0.5.0 ready at /estimate/ (${html.length} bytes; SHA-256 ${actual}). Browser storage only; no cloud sync or customer delivery.`);
