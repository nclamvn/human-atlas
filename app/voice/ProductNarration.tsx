import {Pause,Play,Volume2,VolumeX} from 'lucide-react';
import {useEffect,useMemo,useRef,useState} from 'react';
import productVoice from '../../content/voice/product.json';

interface ProductVoiceClip{
 id:string;audioUrl:string;durationSeconds:number;
}

const clips=new Map((productVoice.clips as ProductVoiceClip[]).map(clip=>[clip.id,clip]));
const clock=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;

export function ProductNarration({clipId,enabled,onEnabled,autoPlay=false,speed=1,onProgress,onEnded}:{clipId:string;enabled:boolean;onEnabled:(enabled:boolean)=>void;autoPlay?:boolean;speed?:number;onProgress?:(progress:number,playing:boolean)=>void;onEnded?:()=>void}){
 const clip=useMemo(()=>clips.get(clipId),[clipId]);
 const audioRef=useRef<HTMLAudioElement>(null),[playing,setPlaying]=useState(false),[blocked,setBlocked]=useState(false),[elapsed,setElapsed]=useState(0);
 const duration=clip?.durationSeconds??0;
 const play=async()=>{const audio=audioRef.current;if(!audio||!clip)return;try{audio.playbackRate=speed;await audio.play();setBlocked(false);setPlaying(true);onEnabled(true)}catch{setBlocked(true);setPlaying(false);onProgress?.(0,false)}};
 useEffect(()=>{const audio=audioRef.current;setElapsed(0);setPlaying(false);onProgress?.(0,false);if(!audio||!clip)return;audio.load();audio.playbackRate=speed;if(autoPlay&&enabled)void play();return()=>audio.pause();},[clipId,clip?.audioUrl]);
 useEffect(()=>{if(audioRef.current)audioRef.current.playbackRate=speed},[speed]);
 useEffect(()=>{if(!enabled&&audioRef.current){audioRef.current.pause();setPlaying(false);onProgress?.(duration?elapsed/duration:0,false)}},[enabled]);
 if(!clip)return null;
 const update=()=>{const audio=audioRef.current;if(!audio)return;const next=audio.currentTime,total=audio.duration||duration;setElapsed(next);onProgress?.(total?Math.min(1,next/total):0,!audio.paused)};
 const togglePlayback=()=>{const audio=audioRef.current;if(!audio)return;if(audio.paused)void play();else{audio.pause();setPlaying(false);onProgress?.(duration?elapsed/duration:0,false)}};
 const toggleSound=()=>{if(blocked||!enabled)void play();else onEnabled(false)};
 const finish=()=>{setElapsed(duration);setPlaying(false);onProgress?.(1,false);onEnded?.()};
 return <div className={'narration-player '+(blocked?'blocked ':'')+(playing?'playing':'')}>
  <audio ref={audioRef} src={clip.audioUrl} preload="metadata" onPlay={()=>{setPlaying(true);setBlocked(false)}} onPause={()=>setPlaying(false)} onTimeUpdate={update} onEnded={finish}/>
  <button className="narration-play" onClick={togglePlayback} aria-label={playing?'Tạm dừng thuyết minh':'Phát thuyết minh'}>{playing?<Pause size={15}/>:<Play size={15}/>}</button>
  <div className="narration-track"><span><strong>{blocked?'Bắt đầu thuyết minh':productVoice.voiceName}</strong><small>{clock(elapsed)} / {clock(duration)}</small></span><input aria-label="Tiến độ thuyết minh" type="range" min="0" max="1000" value={duration?Math.round(elapsed/duration*1000):0} onChange={event=>{const audio=audioRef.current;if(!audio)return;audio.currentTime=+event.target.value/1000*(audio.duration||duration);update()}}/></div>
  <button className="narration-sound" onClick={toggleSound} aria-label={enabled&&!blocked?'Tắt thuyết minh':'Bật thuyết minh'}>{enabled&&!blocked?<Volume2 size={16}/>:<VolumeX size={16}/>}</button>
 </div>;
}
