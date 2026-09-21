import type {EffectCueId} from '../tour/types';

export interface EffectCue{studyFlow:boolean;focusAperture:boolean;bloodFlow:boolean}
export const EFFECT_CUES:Record<EffectCueId,EffectCue>={
 none:{studyFlow:false,focusAperture:false,bloodFlow:false},
 'study-flow':{studyFlow:true,focusAperture:true,bloodFlow:false},
 'blood-return':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-right-heart':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-to-lungs':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-oxygenate':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-left-heart':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-aorta':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-systemic':{studyFlow:false,focusAperture:false,bloodFlow:true},
 'blood-cycle':{studyFlow:false,focusAperture:false,bloodFlow:true},
};
export function effectCue(id:EffectCueId){return EFFECT_CUES[id]}
