import {ArrowLeft,ArrowRight,Pause,Play,RotateCcw,Volume2,VolumeX,X} from 'lucide-react';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import type {TourJourney,TourStatus} from './types';

const clock=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;

export function TourExperience({journey,index,status,narrationEnabled,onNarrationEnabled,onNarration,onSelect,onClose,onRetry}:{journey:TourJourney;index:number;status:TourStatus;narrationEnabled:boolean;onNarrationEnabled:(enabled:boolean)=>void;onNarration:(phase:number,playing:boolean)=>void;onSelect:(index:number)=>void;onClose:()=>void;onRetry:()=>void}){
 const active=journey.beats[index]??journey.beats[0];
 const evidence=active.factIds.map(id=>journey.facts[id]).filter(Boolean);
 const audioRef=useRef<HTMLAudioElement>(null),[playing,setPlaying]=useState(false),[blocked,setBlocked]=useState(false),[elapsed,setElapsed]=useState(0);
 const duration=active.audio?.durationSeconds??0;
 const play=async()=>{const audio=audioRef.current;if(!audio||!active.audio)return;try{await audio.play();setBlocked(false);setPlaying(true);onNarrationEnabled(true)}catch{setBlocked(true);setPlaying(false);onNarration(0,false)}};
 useEffect(()=>{const audio=audioRef.current;setElapsed(0);setPlaying(false);onNarration(0,false);if(!audio||!active.audio)return;audio.load();if(narrationEnabled)void play();return()=>{audio.pause();};},[active.id,active.audio?.audioUrl]);
 useEffect(()=>{if(!narrationEnabled&&audioRef.current){audioRef.current.pause();setPlaying(false);onNarration(duration?elapsed/duration:0,false)}},[narrationEnabled]);
 const toggleSound=()=>{if(blocked||!narrationEnabled){onNarrationEnabled(true);void play();}else{onNarrationEnabled(false);audioRef.current?.pause();}};
 const togglePlayback=()=>{const audio=audioRef.current;if(!audio)return;if(audio.paused)void play();else{audio.pause();setPlaying(false);onNarration(duration?elapsed/duration:0,false)}};
 const update=()=>{const audio=audioRef.current;if(!audio)return;const next=audio.currentTime,total=audio.duration||duration;setElapsed(next);onNarration(total?Math.min(1,next/total):0,!audio.paused)};
 const finish=()=>{setElapsed(duration);setPlaying(false);onNarration(1,false);if(narrationEnabled&&index<journey.beats.length-1)onSelect(index+1)};
 if(status==='recoverable-error')return <section className="abdomen-experience" aria-label="Không thể mở hành trình"><aside className="abdomen-narrative tour-recovery"><span className="abdomen-kicker">Chưa thể mở nội dung</span><h2>Hành trình tạm gián đoạn.</h2><p className="abdomen-lead">Dữ liệu an toàn chưa tải xong. Bạn có thể thử lại hoặc trở về toàn thân.</p><div className="abdomen-pager"><button onClick={onClose}><X size={18}/><span>Thoát</span></button><div/><button onClick={onRetry}><span>Thử lại</span><RotateCcw size={18}/></button></div></aside></section>;
 return <section className="abdomen-experience" style={{'--study-accent':active.scene.accent} as CSSProperties} aria-label={`Hành trình ${journey.title}`} aria-busy={!['ready','playing','paused','complete'].includes(status)}>
  <nav className="abdomen-chapters" aria-label="Các chương">
   <span className="abdomen-vertical-label">{journey.title.toUpperCase()}</span>
   {journey.beats.map((beat,i)=><button key={beat.id} className={beat.id===active.id?'active':''} aria-current={beat.id===active.id?'step':undefined} onClick={()=>onSelect(i)}><span>{beat.number}</span><strong>{beat.kicker}</strong></button>)}
  </nav>
  <aside className="abdomen-narrative" aria-live="polite">
   <div className="abdomen-narrative-top"><span>{active.number} / {String(journey.beats.length).padStart(2,'0')}</span><button className="icon-button" onClick={onClose} aria-label="Đóng hành trình"><X size={20}/></button></div>
   <span className="abdomen-kicker">{active.kicker}</span>
   <h2>{active.title}</h2>
   <p className="abdomen-lead">{active.lead}</p>
   {active.audio&&<div className={'narration-player '+(blocked?'blocked':'')}>
    <audio ref={audioRef} src={active.audio.audioUrl} preload="metadata" onPlay={()=>{setPlaying(true);setBlocked(false)}} onPause={()=>setPlaying(false)} onTimeUpdate={update} onEnded={finish}/>
    <button className="narration-play" onClick={togglePlayback} aria-label={playing?'Tạm dừng thuyết minh':'Phát thuyết minh'}>{playing?<Pause size={15}/>:<Play size={15}/>}</button>
    <div className="narration-track"><span><strong>{blocked?'Bắt đầu thuyết minh':journey.narration.voiceName??'Thuyết minh tiếng Việt'}</strong><small>{clock(elapsed)} / {clock(duration)}</small></span><input aria-label="Tiến độ thuyết minh" type="range" min="0" max="1000" value={duration?Math.round(elapsed/duration*1000):0} onChange={event=>{const audio=audioRef.current;if(!audio)return;audio.currentTime=+event.target.value/1000*(audio.duration||duration);update()}}/></div>
    <button className="narration-sound" onClick={toggleSound} aria-label={narrationEnabled&&!blocked?'Tắt thuyết minh':'Bật thuyết minh'}>{narrationEnabled&&!blocked?<Volume2 size={16}/>:<VolumeX size={16}/>}</button>
   </div>}
   <p className="abdomen-body">{active.body}</p>
   <div className="abdomen-fact"><span>{active.factLabel}</span><p>{active.factText}</p></div>
   <div className="evidence-row"><span>{active.disclosure}</span><i/><small>{evidence.map(fact=>fact.copy).join(' ')}</small></div>
   <details className="tour-transcript"><summary>Bản chữ thuyết minh</summary><p>{active.transcript??journey.narration.transcript}</p></details>
   <div className="abdomen-pager">
    <button onClick={()=>onSelect(index-1)} disabled={index===0} aria-label="Chương trước"><ArrowLeft size={18}/><span>Trước</span></button>
    <div><i style={{width:`${(index+1)/journey.beats.length*100}%`}}/></div>
    <button onClick={index===journey.beats.length-1?onClose:()=>onSelect(index+1)}><span>{index===journey.beats.length-1?'Kết thúc':'Tiếp'}</span><ArrowRight size={18}/></button>
   </div>
  </aside>
 </section>;
}
