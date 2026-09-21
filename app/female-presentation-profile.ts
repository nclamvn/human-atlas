const PROFILE_POINTS:[number,number,number][]=[
 [0,.96,.96], [.28,.92,.92], [.55,.88,.89], [.78,.91,.9],
 [.94,.86,.84], [1.08,.72,.76], [1.2,.78,.84], [1.31,.86,.94],
 [1.4,.87,.92], [1.48,.93,.94], [1.55,.98,.98], [1.7,1,1],
];

function smooth(value:number){return value*value*(3-2*value)}
function ramp(a:number,b:number,value:number){return smooth(Math.max(0,Math.min(1,(value-a)/(b-a))))}
export function femalePresentationScale(y:number):[number,number]{
 if(y<=PROFILE_POINTS[0][0])return [PROFILE_POINTS[0][1],PROFILE_POINTS[0][2]];
 for(let i=1;i<PROFILE_POINTS.length;i++){const a=PROFILE_POINTS[i-1],b=PROFILE_POINTS[i];if(y<=b[0]){const t=smooth((y-a[0])/(b[0]-a[0]));return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}}
 return [1,1];
}

export function femaleSilhouetteOffset(x:number,y:number,z:number):[number,number,number]{
 const [width,depth]=femalePresentationScale(y),centerZ=-.055;
 const centerWeight=1-ramp(.075,.18,Math.abs(x));
 const neckBand=ramp(1.36,1.43,y)*(1-ramp(1.52,1.58,y))*centerWeight;
 const headLift=ramp(1.42,1.57,y)*centerWeight*.042;
 return [x*(width-1-.15*neckBand),headLift,(z-centerZ)*(depth-1-.08*neckBand)];
}
