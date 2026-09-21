const KEY='human-atlas.voice.v1';

export function readVoicePreference(storage:Pick<Storage,'getItem'|'removeItem'>=localStorage):boolean|null{
 try{const value=storage.getItem(KEY);if(value==='on')return true;if(value==='off')return false;if(value!==null)storage.removeItem(KEY);return null}catch{return null}
}

export function writeVoicePreference(enabled:boolean,storage:Pick<Storage,'setItem'>=localStorage){
 try{storage.setItem(KEY,enabled?'on':'off')}catch{/* Voice remains usable when storage is unavailable. */}
}
