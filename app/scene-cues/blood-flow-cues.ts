import type {EffectCueId} from '../tour/types';

export type Point3=[number,number,number];
export interface BloodLane{points:Point3[];start:string;end:string;speed:number;reverse?:boolean}
export interface BloodFlowVisual{lanes:BloodLane[]}

const venous='#6288df',arterial='#f06d65',transition='#c984a7';

export const BLOOD_FLOW_CUES:Partial<Record<EffectCueId,BloodFlowVisual>>={
 'blood-return':{lanes:[
  {points:[[-.015,1.388,.035],[-.015,1.365,.038],[-.01,1.34,.045],[-.003,1.31,.055]],start:venous,end:venous,speed:.105},
  {points:[[-.014,1.03,.036],[-.014,1.12,.039],[-.012,1.21,.044],[-.006,1.28,.052],[-.003,1.31,.056]],start:venous,end:venous,speed:.082},
  {points:[[-.02,1.04,.025],[-.019,1.15,.029],[-.016,1.24,.036],[-.008,1.3,.049]],start:venous,end:venous,speed:.082}
 ]},
 'blood-right-heart':{lanes:[
  {points:[[-.004,1.34,.067],[-.02,1.315,.073],[-.008,1.278,.079],[.025,1.286,.075],[.029,1.34,.066]],start:venous,end:venous,speed:.14},
  {points:[[-.006,1.345,.054],[-.025,1.318,.06],[-.013,1.273,.067],[.02,1.29,.063],[.025,1.343,.057]],start:venous,end:venous,speed:.13}
 ]},
 'blood-to-lungs':{lanes:[
  {points:[[.028,1.34,.064],[.02,1.375,.058],[-.015,1.39,.045],[-.06,1.35,.035],[-.09,1.275,.025]],start:venous,end:venous,speed:.12},
  {points:[[.028,1.34,.064],[.025,1.38,.058],[.05,1.39,.045],[.075,1.36,.035],[.095,1.31,.025]],start:venous,end:venous,speed:.12}
 ]},
 'blood-oxygenate':{lanes:[
  {points:[[-.09,1.22,.085],[-.105,1.29,.087],[-.095,1.38,.09],[-.06,1.415,.092],[-.035,1.35,.095],[-.055,1.27,.097]],start:venous,end:arterial,speed:.085},
  {points:[[.095,1.23,.085],[.11,1.3,.087],[.1,1.39,.09],[.075,1.42,.092],[.045,1.36,.095],[.06,1.29,.097]],start:venous,end:arterial,speed:.085},
  {points:[[-.06,1.31,.099],[-.03,1.34,.101],[0,1.35,.102],[.03,1.34,.101],[.06,1.31,.099]],start:transition,end:arterial,speed:.07}
 ]},
 'blood-left-heart':{lanes:[
  {points:[[-.095,1.33,.073],[-.06,1.35,.078],[-.025,1.34,.084],[.018,1.315,.09],[.04,1.285,.094]],start:arterial,end:arterial,speed:.115},
  {points:[[.095,1.33,.073],[.065,1.35,.078],[.035,1.34,.084],[.02,1.315,.09],[.04,1.285,.094]],start:arterial,end:arterial,speed:.115}
 ]},
 'blood-aorta':{lanes:[
  {points:[[.04,1.285,.079],[.032,1.335,.078],[.025,1.385,.07],[.005,1.405,.06],[-.012,1.38,.052]],start:arterial,end:arterial,speed:.13},
  {points:[[-.008,1.385,.052],[.004,1.27,.049],[.012,1.15,.046],[.012,1.03,.043]],start:arterial,end:arterial,speed:.105}
 ]},
 'blood-systemic':{lanes:[
  {points:[[.005,1.38,.04],[.002,1.405,.038],[0,1.43,.035],[-.006,1.455,.031]],start:arterial,end:arterial,speed:.085},
  {points:[[.01,1.2,.041],[.0,1.16,.039],[-.025,1.125,.036],[-.04,1.112,.032]],start:arterial,end:arterial,speed:.09},
  {points:[[.012,1.08,.041],[.015,.96,.038],[.035,.8,.034],[.06,.56,.03]],start:arterial,end:arterial,speed:.078}
 ]},
 'blood-cycle':{lanes:[
  {points:[[.02,1.34,.07],[.09,1.35,.055],[.105,1.4,.045],[.07,1.425,.052],[.02,1.32,.082],[.04,1.28,.085],[.0,1.39,.055],[.012,1.16,.045],[.02,1.03,.04],[-.014,1.16,.043],[-.003,1.31,.068]],start:venous,end:arterial,speed:.055},
  {points:[[.02,1.34,.07],[-.085,1.35,.055],[-.105,1.4,.045],[-.07,1.425,.052],[.02,1.32,.082],[.04,1.28,.085],[.0,1.4,.052],[-.006,1.45,.045],[-.015,1.39,.042],[-.003,1.31,.068]],start:venous,end:arterial,speed:.052}
 ]}
};

export function bloodFlowCue(id:EffectCueId|undefined){return id?BLOOD_FLOW_CUES[id]:undefined}
