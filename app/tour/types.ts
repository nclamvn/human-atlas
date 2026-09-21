import type {SystemId} from '../anatomy';

export type EvidenceLevel='source_geometry'|'curated_knowledge'|'educational_illustration';
export type FactStatus='corroborated'|'sourced'|'disputed'|'honest_null';
export type CameraCueId='abdomen-wide'|'abdomen-front'|'abdomen-close'|'pelvis-side'|'pelvis-circulation'|'vena-cava-close'|'right-heart-close'|'pulmonary-wide'|'gas-exchange'|'left-heart-close'|'aorta-launch'|'systemic-wide'|'circulation-overview';
export type EffectCueId='none'|'study-flow'|'blood-return'|'blood-right-heart'|'blood-to-lungs'|'blood-oxygenate'|'blood-left-heart'|'blood-aorta'|'blood-systemic'|'blood-cycle';

export interface SceneCue{
 atlas:'male'|'female'; systems:SystemId[]; focusConcepts:string[]; isolate:boolean;
 lens:'solid'|'xray'; camera:CameraCueId; effect:EffectCueId; accent:string;
}
export interface TourFact{ id:string;status:FactStatus;evidenceLevel:EvidenceLevel;sourceId:string;copy:string }
export interface TourSource{ id:string;title:string;url:string;license:string;capturedAt:string;snapshotSha256:string }
export interface TourBeatAudio{beatId:string;audioUrl:string;alignmentUrl:string;durationSeconds:number;audioSha256:string;alignmentSha256:string}
export interface TourBeat{
 id:string;number:string;kicker:string;title:string;lead:string;body:string;
 factLabel:string;factText:string;factIds:string[];disclosure:string;transcript?:string;audio?:TourBeatAudio;scene:SceneCue;
}
export interface NarrationRecord{ optional:boolean;speed:number;transcript:string;audioUrl?:string;provider?:string;modelId?:string;languageCode?:string;voiceName?:string }
export interface TourJourney{
 schemaVersion:1;id:string;title:string;eyebrow:string;summary:string;locale:'vi-VN';atlas:'male'|'female';
 hero:{countLabel:string;accent:string};beats:TourBeat[];narration:NarrationRecord;
 facts:Record<string,TourFact>;sources:Record<string,TourSource>;digest:string;
}
export interface TourCatalogItem{ id:string;title:string;eyebrow:string;summary:string;atlas:'male'|'female';hero:{countLabel:string;accent:string};beatCount:number;path:string }
export interface TourCatalog{ schemaVersion:1;digest:string;tours:TourCatalogItem[] }

export type TourStatus='idle'|'resolving'|'atlas-loading'|'beat-entering'|'ready'|'playing'|'paused'|'completing'|'complete'|'recoverable-error';
export interface TourState{status:TourStatus;catalog:TourCatalog|null;journey:TourJourney|null;tourId:string|null;beatIndex:number;requestId:number;error:string|null}
export type TourEvent=
 |{type:'CATALOG_READY';catalog:TourCatalog}
 |{type:'OPEN';tourId:string;requestId:number}
 |{type:'JOURNEY_READY';journey:TourJourney;requestId:number;beatIndex:number}
 |{type:'ATLAS_READY'}|{type:'BEAT_READY'}|{type:'SELECT_BEAT';index:number}
 |{type:'PLAY'}|{type:'PAUSE'}|{type:'COMPLETE'}|{type:'CLOSE'}
 |{type:'ERROR';message:string;requestId?:number};
