import type {View} from '../anatomy';
import type {CameraCueId} from '../tour/types';

export interface CameraCue{view:View;direction:[number,number,number];distanceScale:number}
export const CAMERA_CUES:Record<CameraCueId,CameraCue>={
 'abdomen-wide':{view:'three-quarter',direction:[.2,.1,1],distanceScale:1.08},
 'abdomen-front':{view:'front',direction:[0,.04,1],distanceScale:1.02},
 'abdomen-close':{view:'three-quarter',direction:[.16,.05,1],distanceScale:.94},
 'pelvis-side':{view:'side',direction:[1,.03,.08],distanceScale:.98},
 'pelvis-circulation':{view:'three-quarter',direction:[.28,.08,1],distanceScale:1.02},
 'vena-cava-close':{view:'three-quarter',direction:[.22,.06,1],distanceScale:1.06},
 'right-heart-close':{view:'three-quarter',direction:[.32,.08,1],distanceScale:.91},
 'pulmonary-wide':{view:'front',direction:[0,.03,1],distanceScale:1.04},
 'gas-exchange':{view:'front',direction:[0,.03,1],distanceScale:.98},
 'left-heart-close':{view:'three-quarter',direction:[-.24,.07,1],distanceScale:.91},
 'aorta-launch':{view:'three-quarter',direction:[-.2,.08,1],distanceScale:.96},
 'systemic-wide':{view:'front',direction:[0,.02,1],distanceScale:1.12},
 'circulation-overview':{view:'three-quarter',direction:[.2,.05,1],distanceScale:1.08},
};
export function cameraCue(id:CameraCueId){return CAMERA_CUES[id]}
