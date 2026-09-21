export type NarrationStatus='silent'|'loading'|'playing'|'paused'|'unavailable'|'error';
export class NarrationController{
 private audio:HTMLAudioElement|null=null;status:NarrationStatus='silent';
 async load(url?:string){this.stop();if(!url){this.status='unavailable';return false}this.status='loading';const audio=new Audio(url);this.audio=audio;audio.preload='metadata';audio.addEventListener('ended',()=>{this.status='paused'},{once:false});audio.addEventListener('error',()=>{this.status='error'},{once:true});this.status='paused';return true}
 async play(){if(!this.audio)return false;try{await this.audio.play();this.status='playing';return true}catch{this.status='error';return false}}
 pause(){this.audio?.pause();if(this.audio)this.status='paused'}
 setSpeed(speed:number){if(this.audio)this.audio.playbackRate=Math.min(2,Math.max(.5,speed))}
 stop(){if(this.audio){this.audio.pause();this.audio.removeAttribute('src');this.audio.load()}this.audio=null;this.status='silent'}
}
