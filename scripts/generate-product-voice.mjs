import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LESSONS,ORGAN_TEXT,SYSTEM_VI,translatedName} from '../app/education.ts';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const apiKey=process.env.ELEVENLABS_API_KEY,voiceId=process.env.ELEVENLABS_VOICE_ID;
const modelId=process.env.ELEVENLABS_MODEL_ID??'eleven_v3',languageCode=process.env.ELEVENLABS_LANGUAGE_CODE??'vi';
if(!apiKey||!voiceId)throw new Error('Thiếu ELEVENLABS_API_KEY hoặc ELEVENLABS_VOICE_ID trong môi trường chạy.');

const outputRoot=path.join(repo,'public/audio/product');
const stagingRoot=path.join(repo,'public/audio',`.product-staging-${process.pid}`);
const alignmentRoot=path.join(stagingRoot,'alignment');
const manifestPath=path.join(repo,'content/voice/product.json');
fs.mkdirSync(alignmentRoot,{recursive:true});
fs.mkdirSync(path.dirname(manifestPath),{recursive:true});

const clips=[
 {id:'intro',group:'interface',transcript:'Chào mừng bạn đến với Cơ thể người, một thế giới bên trong bạn. Hãy chọn một hành trình, một hệ cơ quan, hoặc chạm trực tiếp vào mô hình để bắt đầu khám phá.'},
 {id:'about',group:'interface',transcript:'Mô hình nam sử dụng dữ liệu Body Parts 3D. Mô hình nữ sử dụng Human Reference Atlas của Hub Map. Đây là trải nghiệm giáo dục giúp hình dung cơ thể, không phải công cụ chẩn đoán y khoa.'},
 ...LESSONS.flatMap(lesson=>lesson.steps.map((step,index)=>({id:`lesson-${lesson.id}-${String(index+1).padStart(2,'0')}`,group:'lesson',transcript:`${lesson.name}. ${step.title}. ${step.body}`}))),
 ...Object.entries(SYSTEM_VI).map(([id,system])=>({id:`system-${id}`,group:'system',transcript:`${system.name}. ${system.description}`})),
 ...Object.entries(ORGAN_TEXT).map(([id,description])=>({id:`organ-${id}`,group:'organ',transcript:`${translatedName(id)??id}. ${description}`})),
];

const sha256=data=>crypto.createHash('sha256').update(data).digest('hex');
const spokenVietnamese=text=>text
 .replace(/carbon dioxide/gi,'các-bon đi-ô-xít')
 .replace(/ôxy|oxy/gi,'ô-xi')
 .replace(/nephron/gi,'nép-rôn')
 .replace(/protein/gi,'prô-tê-in')
 .replace(/insulin/gi,'in-su-lin')
 .replace(/testosterone/gi,'tes-tốt-tê-rôn');
const request=async(url,options={})=>{
 const response=await fetch(url,{...options,headers:{'xi-api-key':apiKey,...options.headers}});
 if(!response.ok){const detail=(await response.text()).slice(0,500);throw new Error(`ElevenLabs ${response.status}: ${detail}`)}
 return response;
};

try{
 const voiceResponse=await request(`https://api.elevenlabs.io/v1/voices/${encodeURIComponent(voiceId)}`),voice=await voiceResponse.json();
 const voiceName=process.env.ELEVENLABS_VOICE_NAME??voice.name?.split(/\s+[–—-]\s+/u)[0]??'Narrator';
 const manifest={schemaVersion:1,collectionId:'product',locale:'vi-VN',provider:'ElevenLabs',modelId,languageCode,voiceId,voiceName,outputFormat:'mp3_44100_128',generatedAt:new Date().toISOString(),clips:[]};
 for(let index=0;index<clips.length;index++){
  const clip=clips[index],spokenText=spokenVietnamese(clip.transcript),audioName=`${clip.id}.mp3`,alignmentName=`${clip.id}.json`;
  const response=await request(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:spokenText,model_id:modelId,language_code:languageCode,voice_settings:{stability:.55,similarity_boost:.8,style:.12,use_speaker_boost:true,speed:.94}})}),payload=await response.json();
  if(!payload.audio_base64||!payload.alignment)throw new Error(`${clip.id}: phản hồi thiếu audio hoặc alignment`);
  const audio=Buffer.from(payload.audio_base64,'base64'),alignment=payload.normalized_alignment??payload.alignment,duration=Math.max(...alignment.character_end_times_seconds,0);
  const alignmentDocument={schemaVersion:1,clipId:clip.id,languageCode,spokenText,characters:alignment.characters,characterStartTimesSeconds:alignment.character_start_times_seconds,characterEndTimesSeconds:alignment.character_end_times_seconds,durationSeconds:duration};
  const alignmentBytes=Buffer.from(JSON.stringify(alignmentDocument,null,2)+'\n');
  fs.writeFileSync(path.join(stagingRoot,audioName),audio);fs.writeFileSync(path.join(alignmentRoot,alignmentName),alignmentBytes);
  manifest.clips.push({...clip,audioUrl:`/audio/product/${audioName}`,alignmentUrl:`/audio/product/alignment/${alignmentName}`,durationSeconds:duration,audioSha256:sha256(audio),alignmentSha256:sha256(alignmentBytes)});
  console.log(`${String(index+1).padStart(2,'0')}/${clips.length} ${clip.id} · ${duration.toFixed(2)} s`);
 }
 if(fs.existsSync(outputRoot))fs.rmSync(outputRoot,{recursive:true,force:true});
 fs.renameSync(stagingRoot,outputRoot);
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 console.log(`Product voice generated with ${voiceName} · ${manifest.clips.length} clips.`);
}catch(error){
 fs.rmSync(stagingRoot,{recursive:true,force:true});
 throw error;
}
