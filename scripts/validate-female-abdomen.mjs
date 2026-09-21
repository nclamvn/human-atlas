import fs from 'node:fs';
import assert from 'node:assert/strict';
import {normalizeAtlas} from '../app/normalize-atlas.ts';
import {resolveTourSelection} from '../app/tour/selection.ts';

const atlas=normalizeAtlas(JSON.parse(fs.readFileSync(new URL('../public/models/atlas-female.json',import.meta.url))));
const journey=JSON.parse(fs.readFileSync(new URL('../public/content/journeys/female-abdomen.json',import.meta.url)));
assert.equal(journey.beats.length,5,'The accepted slice contains five beats');
assert.equal(new Set(journey.beats.map(beat=>beat.id)).size,5,'Beat IDs must be unique');
for(const beat of journey.beats){const selection=resolveTourSelection(atlas,beat.scene);assert.deepEqual(selection.missing,[],`${beat.id}: missing concepts`);assert.ok(selection.ids.length,`${beat.id}: must resolve source meshes`);for(const id of selection.ids)assert.ok(atlas.parts.some(part=>part.id===id),`${beat.id}: missing ${id}`)}
const supplement=atlas.parts.filter(part=>part.system==='adipose');
assert.equal(supplement.length,4,'Expected three subcutaneous regions and one omentum mesh');
assert.equal(supplement.reduce((sum,part)=>sum+part.indexCount/3,0),111864);
for(const part of supplement){assert.ok(part.bounds[0][1]>.8&&part.bounds[1][1]<1.1,`${part.id}: not aligned to female abdominal stage coordinates`);assert.ok(part.bounds[0].every(Number.isFinite)&&part.bounds[1].every(Number.isFinite))}
assert.ok(atlas.concepts.some(concept=>concept.name==='subcutaneous abdominal adipose tissue'&&concept.elements.length===3));
assert.ok(atlas.concepts.some(concept=>concept.name==='omentum'&&concept.elements.length===1));
console.log('Female abdomen: generated five-beat journey, source meshes, semantic selection and stage alignment passed.');
