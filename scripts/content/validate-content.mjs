import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateContent} from './compile-content.mjs';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const result=validateContent({repoRoot:repo});
const generated=JSON.parse(fs.readFileSync(path.join(repo,'public/content/publish.json'),'utf8'));
if(generated.digest!==result.digest)throw new Error('Published content is stale; run npm run content:build');
const runtimes=result.runtimes.map(item=>fs.statSync(path.join(repo,`public/content/journeys/${item.id}.json`)).size),runtime=Math.max(...runtimes);
if(runtime>100_000)throw new Error(`Runtime journey exceeds 100 kB: ${runtime}`);
console.log(`Content gate: sources, evidence, concepts, assets, narration and digest passed · ${result.runtimes.length} journey · max ${runtime} bytes.`);
