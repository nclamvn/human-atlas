import {useEffect,useRef} from 'react';
import * as T from 'three/webgpu';
import {attribute,texture,vec2,float,positionLocal,uniform,mix,color,varying,sin,mx_noise_float} from 'three/tsl';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {createExplosionLayout} from './explosion-layout';
import {decodeModelResponse} from './model-download';
import {PointerTap} from './pointer-tap';
import {SYSTEMS,type Atlas,type SceneState} from './anatomy';
import {labelFor} from './education';
interface Props {atlas:Atlas;state:SceneState;onSelect:(id:string)=>void;onProgress:(n:number)=>void;onError:(s:string)=>void}
export default function AnatomyScene({atlas,state,onSelect,onProgress,onError}:Props){
 const host=useRef<HTMLDivElement>(null),latest=useRef(state),select=useRef(onSelect);
 latest.current=state;select.current=onSelect;
 useEffect(()=>{
  const el=host.current!;let disposed=false,frame=0,dirty=true,ready=false,lastView='',lastReset=-1,lastIsolate='',layoutKey='',amount=0;
  let lastState:SceneState|null=null;
  const abort=new AbortController();
  let renderer:T.WebGPURenderer;
  try{renderer=new T.WebGPURenderer({antialias:true,alpha:false,forceWebGL:new URLSearchParams(location.search).has('webgl')});}catch{onError('Không thể mở mô hình 3D trên thiết bị này. Hãy thử trình duyệt có hỗ trợ đồ họa.');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.5:2));renderer.setClearColor('#101c25');renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','Mô hình giải phẫu tương tác. Kéo để xoay, cuộn để phóng to, chạm vào cơ quan để tìm hiểu.');
  let rendererReady=false;
  let cameraGoal:T.Vector3|null=null,targetGoal:T.Vector3|null=null;const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flyTo=(target:T.Vector3,position:T.Vector3)=>{if(!ready||reducedMotion){controls.target.copy(target);camera.position.copy(position);}else{targetGoal=target.clone();cameraGoal=position.clone();}dirty=true;};
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.005,100),controls=new OrbitControls(camera,renderer.domElement);
  camera.position.set(1.4,1.05,3.6);controls.target.set(0,.85,0);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=.07;controls.maxDistance=40;controls.maxPolarAngle=Math.PI*.96;controls.addEventListener('change',()=>{dirty=true;});
  let env:T.RenderTarget|undefined;
  renderer.init().then(()=>{if(disposed)return;const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();env=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();scene.environment=env.texture;scene.environmentIntensity=.45;rendererReady=true;el.dataset.backend=('isWebGPUBackend' in renderer.backend&&renderer.backend.isWebGPUBackend)?'webgpu':'webgl2';dirty=true;}).catch(()=>{if(!disposed)onError('Không thể khởi tạo đồ họa. Hãy tải lại trang hoặc dùng một trình duyệt khác.');});
  scene.add(new T.HemisphereLight(0xd9ebff,0x192733,1.1));
  const key=new T.DirectionalLight(0xffeee5,2.1);key.position.set(-2,4,3);scene.add(key);
  const rim=new T.DirectionalLight(0x93caff,2.8);rim.position.set(2,2,-3);scene.add(rim);
  const fill=new T.DirectionalLight(0xf5dae6,.45);fill.position.set(2,1,3);scene.add(fill);
  const ground=new T.Mesh(new T.CircleGeometry(30,96),new T.MeshStandardNodeMaterial({color:0x101c25,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.019;scene.add(ground);
  const platform=new T.Mesh(new T.CylinderGeometry(.62,.64,.018,100),new T.MeshStandardNodeMaterial({color:0x203640,metalness:.2,roughness:.65}));platform.position.y=-.016;scene.add(platform);
  const ring=new T.Mesh(new T.RingGeometry(.60,.601,128),new T.MeshBasicNodeMaterial({color:0x8cafb9,transparent:true,opacity:.28,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.001;scene.add(ring);
  const innerRing=new T.Mesh(new T.RingGeometry(.55,.551,128),new T.MeshBasicNodeMaterial({color:0xa4aeb8,transparent:true,opacity:.1,side:T.DoubleSide}));innerRing.rotation.x=-Math.PI/2;innerRing.position.y=.001;scene.add(innerRing);
  const width=T.MathUtils.ceilPowerOfTwo(atlas.parts.length),data=new Float32Array(width*4),partTexture=new T.DataTexture(data,width,1,T.RGBAFormat,T.FloatType);partTexture.needsUpdate=true;
  const selectedData=new Uint8Array(width*4),selectionTexture=new T.DataTexture(selectedData,width,1);selectionTexture.needsUpdate=true;
  const materials:T.Material[]=[],geometries:T.BufferGeometry[]=[],pickers:(T.Mesh|undefined)[]=[],centers=atlas.parts.map(p=>new T.Vector3().fromArray(p.bounds[0]).add(new T.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5));
  const offsets:T.Vector3[]=[],bounds=atlas.parts.map(p=>new T.Box3(new T.Vector3().fromArray(p.bounds[0]),new T.Vector3().fromArray(p.bounds[1])));
  let packingWidth=1,packingHeight=1;
  const markerPositions=new Float32Array(atlas.parts.length*3),markerGeometry=new T.BufferGeometry();markerGeometry.setAttribute('position',new T.BufferAttribute(markerPositions,3));
  const markerMaterial=new T.PointsNodeMaterial({color:0x9bb8c5,size:2,sizeAttenuation:false,transparent:true,opacity:.4,depthTest:false});
  const markers=new T.Points(markerGeometry,markerMaterial);markers.frustumCulled=false;markers.renderOrder=10;markers.visible=false;scene.add(markers);
  const hover=document.createElement('div');hover.className='part-hover';hover.setAttribute('role','tooltip');hover.hidden=true;el.appendChild(hover);
  type Target={index:number;x:number;y:number;left:number;right:number;top:number;bottom:number};let targets:Target[]=[];
  const projected=new T.Vector3();
  const findTarget=(x:number,y:number,radius:number)=>{
   let best=-1,score=Infinity;
   for(const t of targets){const dx=Math.max(t.left-x,0,x-t.right),dy=Math.max(t.top-y,0,y-t.bottom),distance=Math.hypot(dx,dy);if(distance>radius)continue;const candidate=distance+Math.hypot(t.x-x,t.y-y)*.025;if(candidate<score){score=candidate;best=t.index;}}
   return best;
  };
  const phase=uniform(0),heartMotion=uniform(0),lungMotion=uniform(0);
  const anatomyMeshes:{mesh:T.Mesh;system:string}[]=[],ghosts=new Map<string,T.MeshBasicNodeMaterial>();let lastLens='solid';
  const stateUv=vec2(attribute<'float'>('partIndex','float').add(.5).div(width),.5);
  const partState=texture(partTexture,stateUv),selectedState=varying(texture(selectionTexture,stateUv).r);
  const materialFor=(system:string)=>{
   const colors:Record<string,string>={skeletal:'#eee4d0',muscular:'#a14e44',cardiac:'#c65451',arterial:'#e35f55',venous:'#507dc2',respiratory:'#db9dab',digestive:'#c98863',nervous:'#e8c779',urinary:'#b76560',integumentary:'#cda58e'};
   const base=colors[system]??SYSTEMS.find(s=>s.id===system)?.color??'#c9b0b8';
   const m=new T.MeshPhysicalNodeMaterial({color:base,roughness:system==='skeletal'?.48:.36,metalness:0,clearcoat:system==='skeletal'?.05:.2,clearcoatRoughness:.35,side:T.DoubleSide,transparent:system==='integumentary',opacity:system==='integumentary'?.16:1,depthWrite:system!=='integumentary'});
   const center=attribute<'vec3'>('partCenter','vec3');
   const pulse=sin(phase.mul(Math.PI*8)).max(0).mul(-.025).mul(heartMotion);
   const breath=sin(phase.mul(Math.PI)).mul(.045).mul(lungMotion);
   const scale=system==='cardiac'?pulse.add(1):system==='respiratory'?breath.add(1):float(1);
   m.positionNode=positionLocal.sub(center).mul(scale).add(center).add(partState.xyz);
   m.maskNode=varying(partState.w).greaterThan(.5);
   m.colorNode=mix(color(base),color('#f7d4a0'),selectedState.mul(.045)).mul(mx_noise_float(positionLocal.mul(180)).mul(.035).add(.96));
   m.roughnessNode=mx_noise_float(positionLocal.mul(230)).mul(.07).add(system==='skeletal'?.52:.4);
   m.emissiveNode=color('#aa7041').mul(selectedState.mul(.06));
   // A separate unlit single-pass material avoids recompiling heavy physical
   // shaders and rendering every surface twice when enabling transparency.
   const ghost=new T.MeshBasicNodeMaterial({color:base,transparent:true,opacity:system==='integumentary'?.045:.14,depthWrite:false,side:T.FrontSide});
   ghost.positionNode=m.positionNode;ghost.maskNode=m.maskNode;
   ghost.colorNode=mix(color(base),color('#d8f4ff'),selectedState.mul(.65));
   ghosts.set(system,ghost);materials.push(ghost);
   materials.push(m);return m;
  };
  const mats=new Map(SYSTEMS.map(s=>[s.id,materialFor(s.id)]));
  let loaded=0;
  const loadChunk=async(ci:number)=>{
   const chunk=atlas.chunks[ci],compressed=!!chunk.gzip&&typeof DecompressionStream!=='undefined';const response=await fetch(compressed?chunk.gzip!:chunk.url,{signal:abort.signal});const buffer=await decodeModelResponse(response,chunk.bytes,compressed);if(disposed)return;
   const groups=new Map<string,T.BufferGeometry[]>();
   atlas.parts.forEach((p,i)=>{
    if(p.chunk!==ci)return;
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(buffer,p.positions,p.vertexCount*3),3));
    // GPU normalized signed-short normals keep the complete atlas compact in memory.
    g.setAttribute('normal',new T.BufferAttribute(new Int16Array(buffer,p.normals,p.vertexCount*3),3,true));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,p.indices,p.indexCount),1));
    g.boundingBox=bounds[i].clone();g.computeBoundingSphere();const pick=new T.Mesh(g);pick.matrixAutoUpdate=false;pickers[i]=pick;geometries.push(g);
    g.setAttribute('partIndex',new T.BufferAttribute(new Float32Array(p.vertexCount).fill(i),1));
    const centerData=new Float32Array(p.vertexCount*3);for(let v=0;v<p.vertexCount;v++)centers[i].toArray(centerData,v*3);g.setAttribute('partCenter',new T.BufferAttribute(centerData,3));
    const list=groups.get(p.system)??[];list.push(g);groups.set(p.system,list);
   });
   groups.forEach((gs,system)=>{const geometry=mergeGeometries(gs,false);if(!geometry)throw new Error('Không thể ghép mô hình giải phẫu.');geometries.push(geometry);if(!mats.has(system as never))mats.set(system as never,materialFor(system));const mesh:T.Mesh=new T.Mesh(geometry,mats.get(system as never));mesh.frustumCulled=false;anatomyMeshes.push({mesh,system});if(latest.current.lens==='xray')mesh.material=ghosts.get(system)!;scene.add(mesh);});
   lastState=null;loaded++;onProgress(Math.round(loaded/atlas.chunks.length*100));dirty=true;
  };
  (async()=>{try{let cursor=0;await Promise.all(Array.from({length:3},async()=>{while(cursor<atlas.chunks.length){const i=cursor++;await loadChunk(i);}}));if(!disposed){ready=true;dirty=true;}}catch(e){if(!disposed)onError(e instanceof Error?e.message:'Không thể tải dữ liệu giải phẫu.');}})();
  const fit=(view:string,extent=0)=>{
   const aspect=camera.aspect,mobile=el.clientWidth<768,normalDistance=mobile?1.95*el.clientHeight/Math.max(180,el.clientHeight-475)/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2))):4.8;
   const reservedHeight=mobile?350:270;const availableAspect=Math.max(.35,(el.clientWidth-(mobile?40:340))/Math.max(160,el.clientHeight-reservedHeight));const atlasDistance=Math.max(packingHeight,packingWidth/availableAspect)/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))*(el.clientHeight/Math.max(160,el.clientHeight-reservedHeight))*1.08;
   const distance=T.MathUtils.lerp(normalDistance,Math.max(.2,atlasDistance),extent);if(extent>.8)view='front';
   const direction=view==='front'?new T.Vector3(0,.02,1):view==='back'?new T.Vector3(0,.02,-1):view==='side'?new T.Vector3(1,.02,0):new T.Vector3(.35,.06,1).normalize();
   if(!latest.current.isolate){if(mobile&&extent<.1){const top=190,bottom=el.clientHeight-285;camera.setViewOffset(el.clientWidth,el.clientHeight,0,el.clientHeight/2-(top+bottom)/2,el.clientWidth,el.clientHeight);}else camera.clearViewOffset();}
   const target=new T.Vector3(extent>.1&&el.clientWidth>767?-packingWidth*.12:0,extent>.1?.85:mobile?.9:.8,0);flyTo(target,target.clone().addScaledVector(direction,distance));controls.update();dirty=true;
  };
  const resize=()=>{if(disposed||el.clientWidth<1||el.clientHeight<1)return;layoutKey='';lastState=null;lastIsolate='';renderer.setPixelRatio(Math.min(devicePixelRatio,el.clientWidth<768||el.clientHeight<600?1.5:2));camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);fit(latest.current.view,amount);};const observer=new ResizeObserver(resize);observer.observe(el);
  const raycaster=new T.Raycaster(),pointer=new T.Vector2(),tap=new PointerTap(),worldBox=new T.Box3(),hitPoint=new T.Vector3();
  const down=(e:PointerEvent)=>{cameraGoal=null;targetGoal=null;hover.hidden=true;tap.down(e.pointerId,e.clientX,e.clientY,e.pointerType==='touch'?12:5);};
  const move=(e:PointerEvent)=>{tap.move(e.pointerId,e.clientX,e.clientY);if(e.buttons||amount<.5||e.pointerType==='touch'){hover.hidden=true;return;}const rect=el.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,index=findTarget(x,y,12);hover.hidden=index<0;renderer.domElement.style.cursor=index<0?'grab':'pointer';if(index>=0){hover.textContent=labelFor(atlas.parts[index]);hover.style.left=`${Math.max(8,Math.min(x+14,el.clientWidth-260))}px`;hover.style.top=`${Math.max(8,Math.min(y+18,el.clientHeight-55))}px`;}};
  const cancel=(e:PointerEvent)=>tap.cancel(e.pointerId);
  const up=(e:PointerEvent)=>{
   const validTap=tap.up(e.pointerId,e.clientX,e.clientY);if(!validTap||!ready)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
   let nearest=Infinity,found=-1;const hasSolid=atlas.parts.some((p,i)=>p.system!=='integumentary'&&data[i*4+3]>.5);
   pickers.forEach((mesh,i)=>{if(!mesh||data[i*4+3]<.5||(hasSolid&&atlas.parts[i].system==='integumentary'))return;worldBox.copy(bounds[i]).translate(mesh.position);if(!raycaster.ray.intersectBox(worldBox,hitPoint))return;const hits=raycaster.intersectObject(mesh,false);if(hits[0]&&hits[0].distance<nearest){nearest=hits[0].distance;found=i;}});
   if(found<0&&amount>.45)found=findTarget(e.clientX-rect.left,e.clientY-rect.top,e.pointerType==='touch'?24:16);if(found>=0){hover.hidden=true;select.current(atlas.parts[found].id);}
  };
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',cancel);
  const clock=new T.Timer();clock.connect(document);let lastExtent=-1;
  const animate=()=>{
   if(disposed)return;frame=requestAnimationFrame(animate);clock.update();const dt=Math.min(clock.getDelta(),.05),s=latest.current;
   const safePhase=Number.isFinite(s.phase)?Math.max(0,Math.min(1,s.phase!)):0;if(phase.value!==safePhase){phase.value=safePhase;dirty=true;}
   heartMotion.value=s.lesson==='heart'?1:0;lungMotion.value=s.lesson==='lungs'?1:0;
   if(lastLens!==s.lens){for(const {mesh,system} of anatomyMeshes)mesh.material=s.lens==='xray'?ghosts.get(system)!:mats.get(system as never)!;lastLens=s.lens??'solid';dirty=true;}
   const changed=lastState?.visible!==s.visible||lastState?.selected!==s.selected||lastState?.isolate!==s.isolate;
   const moving=Math.abs(amount-s.explode)>.0001;
   if(moving){amount=T.MathUtils.damp(amount,s.explode,8,dt);dirty=true;}
   if(changed||moving||lastExtent<0){
    const visible=new Set(s.visible),selection=new Set(s.selected);
    const visibleParts=atlas.parts.filter(p=>s.isolate?selection.has(p.id):visible.has(p.system)||selection.has(p.id));
    const nextLayoutKey=visibleParts.map(p=>p.id).join(',')+':'+camera.aspect.toFixed(3);
    if(nextLayoutKey!==layoutKey){const layout=createExplosionLayout(visibleParts,camera.aspect);packingWidth=layout.width;packingHeight=layout.height;atlas.parts.forEach((p,i)=>{const cell=layout.cells.get(p.id);offsets[i]=cell?new T.Vector3(cell.x,cell.y+.85,0):centers[i].clone();});layoutKey=nextLayoutKey;if(amount>.05&&!s.isolate)fit(s.view,Math.max(0,(amount-.3)/.7));}

    atlas.parts.forEach((p,i)=>{
     const c=centers[i],destination=offsets[i];let dx=0,dy=0,dz=0;
     if(amount<=.45){const t=amount/.45;const group=SYSTEMS.findIndex(sys=>sys.id===p.system);const angle=group/SYSTEMS.length*Math.PI*2;dx=Math.sin(angle)*t*.48;dy=(c.y-.85)*t*.28;dz=Math.cos(angle)*t*.48;}
     else {const t=(amount-.45)/.55,group=SYSTEMS.findIndex(sys=>sys.id===p.system),angle=group/SYSTEMS.length*Math.PI*2;dx=T.MathUtils.lerp(Math.sin(angle)*.48,destination.x-c.x,t);dy=T.MathUtils.lerp((c.y-.85)*.28,destination.y-c.y,t);dz=T.MathUtils.lerp(Math.cos(angle)*.48,-c.z,t);}
     const selected=selection.has(p.id);data.set([dx,dy,dz,(s.isolate?selected:visible.has(p.system)||selected)?1:0],i*4);selectedData[i*4]=selected?255:0;
     markerPositions.set(data[i*4+3]>.5?[c.x+dx,c.y+dy,c.z+dz]:[10000,10000,10000],i*3);const mesh=pickers[i];if(mesh){mesh.position.set(dx,dy,dz);mesh.updateMatrix();mesh.updateMatrixWorld(true);}
    });partTexture.needsUpdate=true;selectionTexture.needsUpdate=true;markerGeometry.attributes.position.needsUpdate=true;lastState=s;lastExtent=amount;dirty=true;
   }
   if(s.view!==lastView||s.reset!==lastReset){fit(s.view,amount);lastView=s.view;lastReset=s.reset;}
   if(moving&&!s.isolate)fit(amount>.5?'front':s.view,Math.max(0,(amount-.3)/.7));
   const isolateKey=s.isolate?s.selected.join(',')+':'+s.reset+':'+s.inspectorOpen+':'+camera.aspect:'';
   if(isolateKey!==lastIsolate||(s.isolate&&moving)){
    if(s.isolate){const box=new T.Box3();atlas.parts.forEach((p,i)=>{if(s.selected.includes(p.id))box.union(bounds[i].clone().translate(new T.Vector3(data[i*4],data[i*4+1],data[i*4+2])));});
     if(!box.isEmpty()){const center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());const w=el.clientWidth,h=el.clientHeight,mobile=w<768,landscape=w>h&&h<=600;let left=20,right=w-20,top=mobile?175:110,bottom=h-170;if(s.inspectorOpen){if(landscape){right=w-335;top=100;bottom=h-125;}else if(mobile){const sheet=document.querySelector('.detail-sheet')?.getBoundingClientRect(),header=document.querySelector('.identity')?.getBoundingClientRect();top=Math.max(150,(header?.bottom??94)+16);bottom=(sheet?.top??h*.58-139)-16;}else{right=w-370;left=w>1100?285:25;}}const availableWidth=Math.max(150,right-left),availableHeight=Math.max(40,bottom-top);camera.setViewOffset(w,h,w/2-(left+right)/2,h/2-(top+bottom)/2,w,h);const distance=Math.max(.07,Math.max(size.y*h/availableHeight,size.x*w/availableWidth/camera.aspect,size.z)/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))*1.35);controls.maxDistance=Math.max(40,distance*2);flyTo(center,center.clone().add(new T.Vector3(.2,.1,1).normalize().multiplyScalar(distance)));controls.update();dirty=true;}
    }else if(lastIsolate){camera.clearViewOffset();fit(s.view,amount);}
    lastIsolate=isolateKey;
   }
   if(cameraGoal&&targetGoal){const ease=1-Math.exp(-dt*9);camera.position.lerp(cameraGoal,ease);controls.target.lerp(targetGoal,ease);dirty=true;if(camera.position.distanceTo(cameraGoal)<.00005){camera.position.copy(cameraGoal);controls.target.copy(targetGoal);cameraGoal=null;targetGoal=null;}}
   controls.enableRotate=amount<.8;controls.mouseButtons.LEFT=amount<.8?T.MOUSE.ROTATE:T.MOUSE.PAN;controls.touches.ONE=amount<.8?T.TOUCH.ROTATE:T.TOUCH.PAN;ground.visible=false;platform.visible=ring.visible=innerRing.visible=amount<.5&&!s.isolate;markers.visible=amount>.75;controls.autoRotate=s.rotate&&!s.isolate&&amount<.4;controls.autoRotateSpeed=.65;controls.update();if(controls.autoRotate)dirty=true;
   if(dirty&&rendererReady&&el.clientWidth>0&&el.clientHeight>0){try{renderer.render(scene,camera);}catch{rendererReady=false;onError('Phiên đồ họa bị gián đoạn. Hãy tải lại mô hình để tiếp tục.');return;}targets=[];if(amount>.45){const hasSolid=atlas.parts.some((p,i)=>p.system!=='integumentary'&&data[i*4+3]>.5);atlas.parts.forEach((p,i)=>{if(data[i*4+3]<.5||(hasSolid&&p.system==='integumentary'))return;let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;for(let corner=0;corner<8;corner++){projected.set(p.bounds[(corner&1)?1:0][0]+data[i*4],p.bounds[(corner&2)?1:0][1]+data[i*4+1],p.bounds[(corner&4)?1:0][2]+data[i*4+2]).project(camera);const x=(projected.x+1)*el.clientWidth/2,y=(1-projected.y)*el.clientHeight/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}projected.copy(centers[i]).add(new T.Vector3(data[i*4],data[i*4+1],data[i*4+2])).project(camera);if(projected.z< -1||projected.z>1)return;targets.push({index:i,x:(projected.x+1)*el.clientWidth/2,y:(1-projected.y)*el.clientHeight/2,left,right,top,bottom});});}dirty=false;}

  };animate();
  const contextLost=(e:Event)=>{e.preventDefault();onError('Thiết bị đã tạm dừng phiên đồ họa. Hãy tải lại để tiếp tục.');};renderer.domElement.addEventListener('webglcontextlost',contextLost);
  return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);clock.disconnect();observer.disconnect();controls.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());scene.traverse(o=>{if(o instanceof T.Mesh&&!geometries.includes(o.geometry)){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});env?.dispose();partTexture.dispose();selectionTexture.dispose();markerGeometry.dispose();markerMaterial.dispose();hover.remove();renderer.dispose();renderer.domElement.remove();};
 },[atlas]);
 return <div className="scene" ref={host}/>;
}
