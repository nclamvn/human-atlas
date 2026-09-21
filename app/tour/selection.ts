import type {Atlas} from '../anatomy';
import type {SceneCue} from './types';

export function resolveTourSelection(atlas:Atlas,cue:SceneCue){
 const wanted=new Set(cue.focusConcepts.map(name=>name.toLowerCase()));
 const found=new Set<string>(),ids:string[]=[];
 for(const concept of atlas.concepts){if(!wanted.has(concept.name.toLowerCase()))continue;found.add(concept.name.toLowerCase());for(const id of concept.elements)if(!ids.includes(id))ids.push(id)}
 const missing=cue.focusConcepts.filter(name=>!found.has(name.toLowerCase()));
 return {ids,missing};
}
