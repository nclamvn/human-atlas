import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const SYSTEMS=new Set(['skeletal','muscular','arterial','venous','nervous','digestive','respiratory','urinary','reproductive','lymphatic','endocrine','integumentary','adipose','connective','sensory','cardiac','pregnancy']);
const CAMERAS=new Set(['abdomen-wide','abdomen-front','abdomen-close','pelvis-side','pelvis-circulation','vena-cava-close','right-heart-close','pulmonary-wide','gas-exchange','left-heart-close','aorta-launch','systemic-wide','circulation-overview']);
const EFFECTS=new Set(['none','study-flow','blood-return','blood-right-heart','blood-to-lungs','blood-oxygenate','blood-left-heart','blood-aorta','blood-systemic','blood-cycle']);
const STATUSES=new Set(['corroborated','sourced','disputed','honest_null']);
const LEVELS=new Set(['source_geometry','curated_knowledge','educational_illustration']);

function invariant(value,message){if(!value)throw new Error(message)}
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'))}
function jsonFiles(dir){return fs.readdirSync(dir).filter(name=>name.endsWith('.json')).sort().map(name=>path.join(dir,name))}
function sha(data){return crypto.createHash('sha256').update(data).digest('hex')}
function ordered(value){if(Array.isArray(value))return value.map(ordered);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,ordered(value[key])]));return value}
function stable(value){return JSON.stringify(ordered(value))}
function canonicalFiles(root){
 const files=[];
 for(const folder of ['sources','facts','assets','journeys','narration','voice']){const base=path.join(root,folder);if(!fs.existsSync(base))continue;for(const entry of fs.readdirSync(base,{recursive:true,withFileTypes:true})){if(entry.isFile())files.push(path.relative(root,path.join(entry.parentPath,entry.name)))}}
 return files.filter(file=>!file.endsWith('registry-lock.json')&&!file.endsWith('verification.log')).sort();
}

export function validateContent({repoRoot=REPO,contentRoot=path.join(repoRoot,'content'),skipLock=false}={}){
 const sourcesDoc=readJson(path.join(contentRoot,'sources/sources.json'));
 const factDocs=jsonFiles(path.join(contentRoot,'facts')).map(readJson);
 const assetDocs=jsonFiles(path.join(contentRoot,'assets')).map(readJson);
 const journeys=jsonFiles(path.join(contentRoot,'journeys')).map(readJson);
 const narrationRoot=path.join(contentRoot,'narration'),narrationDocs=fs.existsSync(narrationRoot)?jsonFiles(narrationRoot).map(readJson):[];
 const voiceRoot=path.join(contentRoot,'voice'),voiceDocs=fs.existsSync(voiceRoot)?jsonFiles(voiceRoot).map(readJson):[];
 invariant(sourcesDoc.version===1&&Array.isArray(sourcesDoc.sources),'sources.json: unsupported schema');
 invariant(factDocs.every(doc=>doc.version===1&&Array.isArray(doc.facts)),'facts: unsupported schema');
 invariant(assetDocs.every(doc=>doc.version===1&&Array.isArray(doc.assets)),'assets: unsupported schema');
 invariant(journeys.length&&journeys.every(journey=>journey.schemaVersion===1&&Array.isArray(journey.beats)),'journey: unsupported schema');

 const sources=new Map();
 for(const source of sourcesDoc.sources){
  invariant(source.id&&!sources.has(source.id),`source id invalid/duplicate: ${source.id}`);invariant(source.title&&source.url&&source.license&&source.snapshot,`${source.id}: incomplete provenance`);
  const snapshotPath=path.join(contentRoot,'sources/snapshots',source.snapshot);invariant(fs.existsSync(snapshotPath),`${source.id}: missing snapshot`);const snapshot=fs.readFileSync(snapshotPath);sources.set(source.id,{...source,snapshotText:snapshot.toString('utf8'),snapshotSha256:sha(snapshot)});
 }
 const facts=new Map();
 for(const fact of factDocs.flatMap(doc=>doc.facts)){
  invariant(fact.id&&!facts.has(fact.id),`fact id invalid/duplicate: ${fact.id}`);invariant(STATUSES.has(fact.status),`${fact.id}: invalid status`);invariant(LEVELS.has(fact.evidenceLevel),`${fact.id}: invalid evidence level`);
  const source=sources.get(fact.sourceId);invariant(source,`${fact.id}: unknown source ${fact.sourceId}`);invariant(fact.evidenceSpan&&source.snapshotText.includes(fact.evidenceSpan),`${fact.id}: evidence span absent from snapshot`);invariant(fact.copy&&typeof fact.copy==='string',`${fact.id}: missing public copy`);facts.set(fact.id,fact);
 }
 const sourceIds=new Set(sources.keys()),assets=assetDocs.flatMap(doc=>doc.assets),assetIds=new Set();
 for(const asset of assets){
  invariant(asset.id&&!assetIds.has(asset.id)&&sourceIds.has(asset.sourceId),`${asset.id}: duplicate asset or unknown source`);assetIds.add(asset.id);invariant(asset.url&&asset.license&&asset.version&&asset.coordinateNote,`${asset.id}: incomplete asset provenance`);
  if(asset.localPath){const file=path.join(repoRoot,asset.localPath);invariant(fs.existsSync(file),`${asset.id}: missing local asset`);invariant(sha(fs.readFileSync(file))===asset.sha256,`${asset.id}: checksum mismatch`)}
 }
 const journeyIds=new Set();
 for(const journey of journeys){
  invariant(journey.id&&!journeyIds.has(journey.id)&&journey.title&&journey.locale==='vi-VN',`journey: invalid/duplicate identity or locale`);journeyIds.add(journey.id);invariant(journey.atlas==='male'||journey.atlas==='female',`${journey.id}: invalid atlas`);invariant(journey.beats.length>0,`${journey.id}: empty journey`);
  const atlas=readJson(path.join(repoRoot,`public/models/${journey.atlas==='male'?'atlas.json':'atlas-female.json'}`)),conceptNames=new Set(atlas.concepts.map(item=>item.name.toLowerCase())),beatIds=new Set();
  for(const beat of journey.beats){
   invariant(beat.id&&!beatIds.has(beat.id),`${journey.id}: duplicate/invalid beat ${beat.id}`);beatIds.add(beat.id);invariant(beat.title&&beat.lead&&beat.body&&beat.factLabel&&beat.factText,`${beat.id}: incomplete Vietnamese copy`);invariant(Array.isArray(beat.factIds)&&beat.factIds.length,`${beat.id}: factIds required`);
   for(const id of beat.factIds){const fact=facts.get(id);invariant(fact,`${beat.id}: unknown fact ${id}`);invariant(!['disputed','honest_null'].includes(fact.status),`${beat.id}: ${id} cannot produce hard copy with ${fact.status}`)}
   const cue=beat.scene;invariant(cue&&cue.atlas===journey.atlas,`${beat.id}: invalid atlas cue`);invariant(Array.isArray(cue.systems)&&cue.systems.every(id=>SYSTEMS.has(id)),`${beat.id}: unknown system`);invariant(Array.isArray(cue.focusConcepts)&&cue.focusConcepts.length,`${beat.id}: focus required`);for(const name of cue.focusConcepts)invariant(conceptNames.has(name.toLowerCase()),`${beat.id}: unknown concept ${name}`);invariant(CAMERAS.has(cue.camera),`${beat.id}: unknown camera cue ${cue.camera}`);invariant(EFFECTS.has(cue.effect),`${beat.id}: unknown effect cue ${cue.effect}`);invariant(['solid','xray'].includes(cue.lens),`${beat.id}: invalid lens`);invariant(/^#[0-9a-f]{6}$/i.test(cue.accent),`${beat.id}: invalid accent`);
  }
 }
 const narrationByJourney=new Map();
 for(const narration of narrationDocs){
  invariant(narration.version===1&&journeyIds.has(narration.journeyId)&&!narrationByJourney.has(narration.journeyId),`narration: invalid/duplicate journey ${narration.journeyId}`);invariant(narration.provider&&narration.modelId&&narration.voiceId&&narration.voiceName&&Array.isArray(narration.beats),`${narration.journeyId}: incomplete narration manifest`);invariant(!narration.languageCode||/^[a-z]{2}$/i.test(narration.languageCode),`${narration.journeyId}: invalid narration language`);
  const journey=journeys.find(item=>item.id===narration.journeyId),beatIds=new Set(journey.beats.map(beat=>beat.id));invariant(narration.beats.length===journey.beats.length,`${narration.journeyId}: narration beat count mismatch`);
  for(const asset of narration.beats){
   invariant(beatIds.has(asset.beatId)&&asset.audioUrl&&asset.alignmentUrl&&asset.durationSeconds>0,`${narration.journeyId}: invalid narration beat ${asset.beatId}`);
   const audioPath=path.join(repoRoot,'public',asset.audioUrl.replace(/^\/+/,'')),alignmentPath=path.join(repoRoot,'public',asset.alignmentUrl.replace(/^\/+/,''));invariant(fs.existsSync(audioPath)&&fs.existsSync(alignmentPath),`${asset.beatId}: missing narration asset`);invariant(sha(fs.readFileSync(audioPath))===asset.audioSha256&&sha(fs.readFileSync(alignmentPath))===asset.alignmentSha256,`${asset.beatId}: narration checksum mismatch`);
   const alignment=readJson(alignmentPath);invariant(alignment.beatId===asset.beatId&&Math.abs(alignment.durationSeconds-asset.durationSeconds)<.001,`${asset.beatId}: invalid narration alignment`);
  }
  narrationByJourney.set(narration.journeyId,narration);
 }
 const voiceCollections=new Set();
 for(const voice of voiceDocs){
  invariant(voice.schemaVersion===1&&voice.collectionId&&!voiceCollections.has(voice.collectionId),`voice: invalid/duplicate collection ${voice.collectionId}`);voiceCollections.add(voice.collectionId);invariant(voice.locale==='vi-VN'&&voice.provider&&voice.modelId&&voice.languageCode==='vi'&&voice.voiceId&&voice.voiceName&&Array.isArray(voice.clips)&&voice.clips.length,`${voice.collectionId}: incomplete product voice manifest`);
  const clipIds=new Set();for(const clip of voice.clips){invariant(clip.id&&!clipIds.has(clip.id)&&clip.transcript&&clip.audioUrl&&clip.alignmentUrl&&clip.durationSeconds>0,`${voice.collectionId}: invalid/duplicate clip ${clip.id}`);clipIds.add(clip.id);const audioPath=path.join(repoRoot,'public',clip.audioUrl.replace(/^\/+/,'')),alignmentPath=path.join(repoRoot,'public',clip.alignmentUrl.replace(/^\/+/,''));invariant(fs.existsSync(audioPath)&&fs.existsSync(alignmentPath),`${clip.id}: missing product voice asset`);invariant(sha(fs.readFileSync(audioPath))===clip.audioSha256&&sha(fs.readFileSync(alignmentPath))===clip.alignmentSha256,`${clip.id}: product voice checksum mismatch`);const alignment=readJson(alignmentPath);invariant(alignment.clipId===clip.id&&Math.abs(alignment.durationSeconds-clip.durationSeconds)<.001,`${clip.id}: invalid product voice alignment`)}
 }
 const fingerprints=Object.fromEntries(canonicalFiles(contentRoot).map(relative=>[relative,sha(fs.readFileSync(path.join(contentRoot,relative)))]));
 if(!skipLock){const lockPath=path.join(contentRoot,'registry-lock.json');invariant(fs.existsSync(lockPath),'registry-lock.json missing; run npm run content:accept after owner-approved changes');const lock=readJson(lockPath);invariant(stable(lock.files)===stable(fingerprints),'canonical content drifted; validate changes then run npm run content:accept')}
 const publicSources=Object.fromEntries([...sources].map(([id,source])=>[id,{id,title:source.title,url:source.url,license:source.license,capturedAt:source.capturedAt,snapshotSha256:source.snapshotSha256}]));
 const publicFacts=Object.fromEntries([...facts].map(([id,fact])=>[id,{id,status:fact.status,evidenceLevel:fact.evidenceLevel,sourceId:fact.sourceId,copy:fact.copy}]));
 const runtimes=journeys.map(journey=>{const narration=narrationByJourney.get(journey.id),audioByBeat=new Map(narration?.beats.map(asset=>[asset.beatId,asset])??[]);return {...journey,beats:journey.beats.map(beat=>audioByBeat.has(beat.id)?{...beat,audio:audioByBeat.get(beat.id)}:beat),narration:{...journey.narration,...(narration?{provider:narration.provider,modelId:narration.modelId,languageCode:narration.languageCode,voiceName:narration.voiceName}:null)},facts:publicFacts,sources:publicSources}});const contentDigest=sha(stable({runtimes,assets,fingerprints}));for(const runtime of runtimes)runtime.digest=contentDigest;
 const catalog={schemaVersion:1,digest:contentDigest,tours:runtimes.map(journey=>({id:journey.id,title:journey.title,eyebrow:journey.eyebrow,summary:journey.summary,atlas:journey.atlas,hero:journey.hero,beatCount:journey.beats.length,path:`/content/journeys/${journey.id}.json`}))};
 return {runtime:runtimes[0],runtimes,catalog,fingerprints,digest:contentDigest};
}

export function acceptBaseline({repoRoot=REPO,contentRoot=path.join(repoRoot,'content')}={}){const result=validateContent({repoRoot,contentRoot,skipLock:true});fs.writeFileSync(path.join(contentRoot,'registry-lock.json'),JSON.stringify({schemaVersion:1,algorithm:'sha256',files:result.fingerprints},null,2)+'\n');fs.appendFileSync(path.join(contentRoot,'verification.log'),JSON.stringify({acceptedAt:new Date().toISOString(),digest:result.digest,files:Object.keys(result.fingerprints).length})+'\n');return result}
export function writeGenerated(result,{repoRoot=REPO}={}){const dir=path.join(repoRoot,'public/content/journeys');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(repoRoot,'public/content/catalog.json'),JSON.stringify(result.catalog,null,2)+'\n');for(const runtime of result.runtimes){const output=path.join(dir,`${runtime.id}.json`);fs.writeFileSync(output,JSON.stringify(runtime,null,2)+'\n');invariant(fs.statSync(output).size<=100_000,`${runtime.id}: runtime journey exceeds 100 kB`)}fs.writeFileSync(path.join(repoRoot,'public/content/publish.json'),JSON.stringify({schemaVersion:1,digest:result.digest},null,2)+'\n')}

if(process.argv[1]===fileURLToPath(import.meta.url)){const accepting=process.argv.includes('--accept'),result=accepting?acceptBaseline():validateContent();writeGenerated(result);const bytes=result.runtimes.reduce((sum,runtime)=>sum+fs.statSync(path.join(REPO,`public/content/journeys/${runtime.id}.json`)).size,0);console.log(`Content ${accepting?'accepted and ':''}compiled: ${result.digest.slice(0,12)} · ${result.runtimes.length} journey · ${bytes} bytes`)}
