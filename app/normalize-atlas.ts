import type {Atlas} from './anatomy';

/** Keep absent source labels explicit. Local IDs are not invented ontology identifiers. */
export function normalizeAtlas(input:Atlas):Atlas{
 const singleton=new Map(input.concepts.filter(c=>c.elements.length===1&&c.id!=='-').map(c=>[c.elements[0],c]));
 const parts=input.parts.map(p=>{
  const missing=!p.name.trim()||p.name==='-';
  return {...p,name:missing?p.id:p.name,conceptId:p.conceptId==='-'?(singleton.get(p.id)?.id??'SOURCE:'+p.id):p.conceptId};
 });
 const concepts=input.concepts.map(c=>({...c,name:!c.name.trim()||c.name==='-'?c.id:c.name}));
 return {...input,parts,concepts};
}
