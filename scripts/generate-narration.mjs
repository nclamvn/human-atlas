import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const journeyId=process.argv.find(value=>!value.startsWith('-')&&value!==process.argv[0]&&value!==process.argv[1])??'blood-journey';
const force=process.argv.includes('--force');
const apiKey=process.env.ELEVENLABS_API_KEY,voiceId=process.env.ELEVENLABS_VOICE_ID;
const modelId=process.env.ELEVENLABS_MODEL_ID??'eleven_v3',languageCode=process.env.ELEVENLABS_LANGUAGE_CODE??'vi';
if(!apiKey||!voiceId)throw new Error('Thiếu ELEVENLABS_API_KEY hoặc ELEVENLABS_VOICE_ID trong môi trường chạy.');

const journeyPath=path.join(repo,'content/journeys',`${journeyId}.json`);
const journey=JSON.parse(fs.readFileSync(journeyPath,'utf8'));
const outputDir=path.join(repo,'public/audio',journeyId),alignmentDir=path.join(outputDir,'alignment'),manifestDir=path.join(repo,'content/narration');
fs.mkdirSync(alignmentDir,{recursive:true});fs.mkdirSync(manifestDir,{recursive:true});

const sha256=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const spokenVietnamese=text=>text
 .replace(/carbon dioxide/gi,'các-bon đi-ô-xít')
 .replace(/\boxy\b/gi,'ô-xi');
const request=async(url,options={})=>{
 const response=await fetch(url,{...options,headers:{'xi-api-key':apiKey,...options.headers}});
 if(!response.ok){const detail=(await response.text()).slice(0,500);throw new Error(`ElevenLabs ${response.status}: ${detail}`)}
 return response;
};

const voiceResponse=await request(`https://api.elevenlabs.io/v1/voices/${encodeURIComponent(voiceId)}`),voice=await voiceResponse.json();
const voiceName=process.env.ELEVENLABS_VOICE_NAME??voice.name?.split(/\s+[–—-]\s+/u)[0]??'Narrator';
const manifest={version:1,journeyId,provider:'ElevenLabs',modelId,languageCode,voiceId,voiceName,outputFormat:'mp3_44100_128',generatedAt:new Date().toISOString(),beats:[]};

for(let index=0;index<journey.beats.length;index++){
 const beat=journey.beats[index],stem=`${String(index+1).padStart(2,'0')}-${beat.id}`,audioFile=path.join(outputDir,`${stem}.mp3`),alignmentFile=path.join(alignmentDir,`${stem}.json`);
 if(!beat.transcript)throw new Error(`${beat.id}: thiếu transcript`);
 const spokenText=spokenVietnamese(beat.transcript);
 if(!force&&(fs.existsSync(audioFile)||fs.existsSync(alignmentFile)))throw new Error(`${stem}: asset đã tồn tại; dùng --force để tạo lại có chủ đích.`);
 const response=await request(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:spokenText,model_id:modelId,language_code:languageCode,voice_settings:{stability:.55,similarity_boost:.8,style:.12,use_speaker_boost:true,speed:.94}})}),payload=await response.json();
 if(!payload.audio_base64||!payload.alignment)throw new Error(`${beat.id}: phản hồi thiếu audio hoặc alignment`);
 fs.writeFileSync(audioFile,Buffer.from(payload.audio_base64,'base64'));
 const alignment=payload.normalized_alignment??payload.alignment,duration=Math.max(...alignment.character_end_times_seconds,0);
 fs.writeFileSync(alignmentFile,JSON.stringify({version:1,beatId:beat.id,languageCode,spokenText,characters:alignment.characters,characterStartTimesSeconds:alignment.character_start_times_seconds,characterEndTimesSeconds:alignment.character_end_times_seconds,durationSeconds:duration},null,2)+'\n');
 manifest.beats.push({beatId:beat.id,audioUrl:`/audio/${journeyId}/${stem}.mp3`,alignmentUrl:`/audio/${journeyId}/alignment/${stem}.json`,durationSeconds:duration,audioSha256:sha256(audioFile),alignmentSha256:sha256(alignmentFile)});
 console.log(`${String(index+1).padStart(2,'0')}/${journey.beats.length} ${beat.id} · ${duration.toFixed(2)} s`);
}

fs.writeFileSync(path.join(manifestDir,`${journeyId}.json`),JSON.stringify(manifest,null,2)+'\n');
console.log(`Narration generated with voice ${manifest.voiceName} (${voiceId}) · ${manifest.beats.length} beat.`);
