import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateContent} from './compile-content.mjs';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const base=path.join(repo,'content');
function bite(name,mutate,pattern){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'human-atlas-bite-'));
 fs.cpSync(base,path.join(root,'content'),{recursive:true});
 mutate(path.join(root,'content'));
 assert.throws(()=>validateContent({repoRoot:repo,contentRoot:path.join(root,'content'),skipLock:true}),pattern,name);
 fs.rmSync(root,{recursive:true,force:true});
}
function edit(root,relative,mutate){const file=path.join(root,relative);const value=JSON.parse(fs.readFileSync(file));mutate(value);fs.writeFileSync(file,JSON.stringify(value));}

bite('missing source',root=>edit(root,'facts/female-abdomen.json',v=>v.facts[0].sourceId='ghost'),/unknown source/);
bite('bad evidence span',root=>edit(root,'facts/female-abdomen.json',v=>v.facts[0].evidenceSpan='fabricated evidence'),/evidence span absent/);
bite('disputed hard fact',root=>edit(root,'facts/female-abdomen.json',v=>v.facts[0].status='disputed'),/cannot produce hard copy/);
bite('unknown concept',root=>edit(root,'journeys/female-abdomen.json',v=>v.beats[0].scene.focusConcepts=['imaginary organ']),/unknown concept/);
bite('arbitrary effect',root=>edit(root,'journeys/female-abdomen.json',v=>v.beats[0].scene.effect='eval-javascript'),/unknown effect cue/);
bite('narration checksum drift',root=>edit(root,'narration/blood-journey.json',v=>v.beats[0].audioSha256='0'.repeat(64)),/narration checksum mismatch/);
bite('product voice checksum drift',root=>edit(root,'voice/product.json',v=>v.clips[0].audioSha256='0'.repeat(64)),/product voice checksum mismatch/);
console.log('Content bites: 7/7 corruptions were blocked.');
