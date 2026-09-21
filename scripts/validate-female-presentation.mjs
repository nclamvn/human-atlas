import assert from 'node:assert/strict';
import {femalePresentationScale,femaleSilhouetteOffset} from '../app/female-presentation-profile.ts';

const waist=femalePresentationScale(1.08),hips=femalePresentationScale(.78),shoulders=femalePresentationScale(1.4),head=femalePresentationScale(1.7);
assert.ok(waist[0]<hips[0]-.15,'waist must read narrower than hips');
assert.ok(waist[1]<hips[1]-.1,'abdomen depth must be lighter than hips');
assert.ok(shoulders[0]<.9,'shoulder line must be visually refined');
assert.deepEqual(head,[1,1],'head proportions must stay unchanged');
assert.ok(femaleSilhouetteOffset(0,1.08,-.055).every(value=>Math.abs(value)<1e-9),'body centerline must remain stable');
const neck=femaleSilhouetteOffset(.05,1.48,-.055);assert.ok(neck[0]<0&&neck[1]>0,'neck must become slimmer and visually longer');
for(let y=0;y<=1.7;y+=.01){const [x,z]=femalePresentationScale(y);assert.ok(x>=.7&&x<=1&&z>=.7&&z<=1,'profile must remain bounded')}
console.log('Female presentation profile: bounded proportions, stable centerline and waist–hip curve passed.');
