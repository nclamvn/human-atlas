const KEY='human-atlas:tour-progress:v1';
export interface StoredTourProgress{version:1;tourId:string;beatId:string;narration:boolean;speed:number}
export function readTourProgress(storage:Pick<Storage,'getItem'|'removeItem'>=localStorage):StoredTourProgress|null{
 try{const raw=storage.getItem(KEY);if(!raw)return null;const value=JSON.parse(raw) as Partial<StoredTourProgress>;if(value.version!==1||typeof value.tourId!=='string'||typeof value.beatId!=='string'||typeof value.narration!=='boolean'||typeof value.speed!=='number'){storage.removeItem(KEY);return null}return value as StoredTourProgress;}catch{storage.removeItem(KEY);return null}
}
export function writeTourProgress(value:Omit<StoredTourProgress,'version'>,storage:Pick<Storage,'setItem'>=localStorage){try{storage.setItem(KEY,JSON.stringify({version:1,...value}))}catch{/* Private mode/storage quota: the tour continues without resume. */}}
export function clearTourProgress(storage:Pick<Storage,'removeItem'>=localStorage){try{storage.removeItem(KEY)}catch{/* no-op */}}
