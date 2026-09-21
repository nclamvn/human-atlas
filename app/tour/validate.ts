import type {TourCatalog,TourJourney} from './types';

const CAMERAS=new Set(['abdomen-wide','abdomen-front','abdomen-close','pelvis-side','pelvis-circulation','vena-cava-close','right-heart-close','pulmonary-wide','gas-exchange','left-heart-close','aorta-launch','systemic-wide','circulation-overview']);
const EFFECTS=new Set(['none','study-flow','blood-return','blood-right-heart','blood-to-lungs','blood-oxygenate','blood-left-heart','blood-aorta','blood-systemic','blood-cycle']);
function object(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==='object'&&!Array.isArray(value)}
function text(value:unknown){return typeof value==='string'&&value.length>0}
export function isTourCatalog(value:unknown):value is TourCatalog{
 if(!object(value)||value.schemaVersion!==1||!text(value.digest)||!Array.isArray(value.tours))return false;
 return value.tours.every(item=>object(item)&&text(item.id)&&text(item.title)&&text(item.path)&&typeof item.beatCount==='number'&&(item.atlas==='male'||item.atlas==='female'));
}
export function isTourJourney(value:unknown):value is TourJourney{
 if(!object(value)||value.schemaVersion!==1||!text(value.id)||value.locale!=='vi-VN'||!text(value.digest)||!Array.isArray(value.beats)||!object(value.facts)||!object(value.sources))return false;
 if(value.atlas!=='male'&&value.atlas!=='female')return false;
 return value.beats.length>0&&value.beats.every(beat=>{
  if(!object(beat)||!text(beat.id)||!text(beat.title)||!Array.isArray(beat.factIds)||!object(beat.scene))return false;
  const cue=beat.scene;
  return (cue.atlas==='male'||cue.atlas==='female')&&Array.isArray(cue.systems)&&Array.isArray(cue.focusConcepts)&&cue.focusConcepts.every(text)&&CAMERAS.has(String(cue.camera))&&EFFECTS.has(String(cue.effect))&&(cue.lens==='solid'||cue.lens==='xray')&&text(cue.accent);
 });
}
