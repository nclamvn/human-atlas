import {SYSTEMS, type Atlas, type Concept, type Part, type SystemId} from './anatomy';

export const SYSTEM_VI:Record<SystemId,{name:string;description:string}> = {
 skeletal:{name:'Bộ xương',description:'Xương nâng đỡ cơ thể, bảo vệ cơ quan và tạo chỗ bám cho cơ. Tủy trong một số xương tham gia tạo tế bào máu.'},
 muscular:{name:'Hệ cơ',description:'Cơ co lại để tạo lực, giúp ta vận động và giữ tư thế. Gân truyền lực từ cơ đến xương.'},
 cardiac:{name:'Tim',description:'Tim là khối cơ rỗng gồm bốn buồng. Mỗi nhịp co bóp đẩy máu qua phổi và đi khắp cơ thể.'},
 arterial:{name:'Động mạch',description:'Động mạch đưa máu rời tim. Trong vòng tuần hoàn phổi, động mạch phổi mang máu ít ôxy đến phổi.'},
 venous:{name:'Tĩnh mạch',description:'Tĩnh mạch đưa máu trở về tim. Tĩnh mạch phổi đưa máu giàu ôxy từ phổi về tâm nhĩ trái.'},
 nervous:{name:'Hệ thần kinh',description:'Não, tủy sống và các dây thần kinh tiếp nhận thông tin, điều khiển vận động và phối hợp hoạt động của cơ thể.'},
 digestive:{name:'Hệ tiêu hóa',description:'Ống tiêu hóa và các cơ quan hỗ trợ biến thức ăn thành những chất cơ thể có thể hấp thu, đồng thời xử lý phần còn lại.'},
 respiratory:{name:'Hệ hô hấp',description:'Đường dẫn khí đưa không khí vào phổi. Tại phế nang, ôxy đi vào máu và khí cacbonic đi theo chiều ngược lại.'},
 urinary:{name:'Hệ tiết niệu',description:'Thận điều chỉnh nước và các chất hòa tan trong máu. Nước tiểu đi qua niệu quản, được giữ ở bàng quang rồi ra ngoài qua niệu đạo.'},
 reproductive:{name:'Hệ sinh sản',description:'Các cơ quan sinh sản tham gia tạo tế bào sinh dục và hoóc-môn. Mỗi atlas thể hiện những cấu trúc có trong nguồn tham chiếu tương ứng.'},
 lymphatic:{name:'Hệ bạch huyết',description:'Mạch bạch huyết đưa dịch dư từ mô trở lại tuần hoàn. Hạch bạch huyết và các cơ quan liên quan tham gia bảo vệ cơ thể.'},
 endocrine:{name:'Hệ nội tiết',description:'Các tuyến nội tiết đưa hoóc-môn vào máu, góp phần điều hòa tăng trưởng, chuyển hóa và nhiều hoạt động khác.'},
 integumentary:{name:'Bề mặt cơ thể',description:'Da tạo hàng rào bảo vệ, tiếp nhận cảm giác và tham gia điều hòa thân nhiệt. Lớp bề mặt giúp định vị các cơ quan bên trong.'},
 connective:{name:'Mô liên kết',description:'Sụn, dây chằng và các mô liên kết nâng đỡ, kết nối và giữ ổn định các cấu trúc trong cơ thể.'},
 sensory:{name:'Cơ quan cảm giác',description:'Mắt, tai và những cấu trúc liên quan thu nhận thông tin từ môi trường rồi truyền đến hệ thần kinh.'},
 pregnancy:{name:'Tham chiếu thai kỳ',description:'Các mẫu nhau thai và dây rốn được tách riêng khỏi cấu trúc người trưởng thành mặc định.'},
};
export const VI_SYSTEMS=[...SYSTEMS.map(s=>({...s,...SYSTEM_VI[s.id]})),{id:'pregnancy' as SystemId,color:'#e8a1a5',...SYSTEM_VI.pregnancy}];
const names:Record<string,string>={
 heart:'Tim',brain:'Não',liver:'Gan',stomach:'Dạ dày',spleen:'Lách',pancreas:'Tụy','urinary bladder':'Bàng quang',trachea:'Khí quản',diaphragm:'Cơ hoành',lung:'Phổi',lungs:'Hai lá phổi',kidney:'Thận',uterus:'Tử cung',ovary:'Buồng trứng',vagina:'Âm đạo',testis:'Tinh hoàn',prostate:'Tuyến tiền liệt',penis:'Dương vật',clitoris:'Âm vật',breast:'Vú',placenta:'Nhau thai','umbilical cord':'Dây rốn',
 'small intestine':'Ruột non','large intestine':'Ruột già',duodenum:'Tá tràng',jejunum:'Hỗng tràng',ileum:'Hồi tràng',colon:'Đại tràng',rectum:'Trực tràng',esophagus:'Thực quản',gallbladder:'Túi mật',appendix:'Ruột thừa',tongue:'Lưỡi',pharynx:'Hầu',larynx:'Thanh quản',bronchus:'Phế quản',ureter:'Niệu quản',urethra:'Niệu đạo','thyroid gland':'Tuyến giáp','adrenal gland':'Tuyến thượng thận',thymus:'Tuyến ức','pituitary gland':'Tuyến yên',cerebellum:'Tiểu não','spinal cord':'Tủy sống',
 femur:'Xương đùi',tibia:'Xương chày',fibula:'Xương mác',humerus:'Xương cánh tay',radius:'Xương quay',ulna:'Xương trụ',scapula:'Xương vai',clavicle:'Xương đòn',sternum:'Xương ức',patella:'Xương bánh chè',mandible:'Xương hàm dưới',maxilla:'Xương hàm trên',sacrum:'Xương cùng',coccyx:'Xương cụt',skull:'Hộp sọ',rib:'Xương sườn','hip bone':'Xương chậu','vertebral column':'Cột sống',
 'ascending aorta':'Động mạch chủ lên','arch of aorta':'Cung động mạch chủ','descending aorta':'Động mạch chủ xuống','abdominal aorta':'Động mạch chủ bụng','superior vena cava':'Tĩnh mạch chủ trên','inferior vena cava':'Tĩnh mạch chủ dưới','pulmonary trunk':'Thân động mạch phổi','coronary sinus':'Xoang vành','aortic valve':'Van động mạch chủ','mitral valve':'Van hai lá','tricuspid valve':'Van ba lá','pulmonary valve':'Van động mạch phổi',
 'atrium of heart':'Tâm nhĩ','ventricle of heart':'Tâm thất','right atrium':'Tâm nhĩ phải','left atrium':'Tâm nhĩ trái','right ventricle':'Tâm thất phải','left ventricle':'Tâm thất trái',
 'biceps brachii':'Cơ nhị đầu cánh tay','triceps brachii':'Cơ tam đầu cánh tay',deltoid:'Cơ delta','pectoralis major':'Cơ ngực lớn','pectoralis minor':'Cơ ngực bé','rectus abdominis':'Cơ thẳng bụng',trapezius:'Cơ thang',
 'latissimus dorsi':'Cơ lưng rộng','external oblique':'Cơ chéo bụng ngoài','internal oblique':'Cơ chéo bụng trong','transversus abdominis':'Cơ ngang bụng','gluteus maximus':'Cơ mông lớn','gluteus medius':'Cơ mông nhỡ','gluteus minimus':'Cơ mông bé','rectus femoris':'Cơ thẳng đùi','vastus lateralis':'Cơ rộng ngoài','vastus medialis':'Cơ rộng trong','vastus intermedius':'Cơ rộng giữa','biceps femoris':'Cơ nhị đầu đùi','semitendinosus':'Cơ bán gân','semimembranosus':'Cơ bán màng',sartorius:'Cơ may',gracilis:'Cơ thon',gastrocnemius:'Cơ bụng chân',soleus:'Cơ dép','tibialis anterior':'Cơ chày trước','tibialis posterior':'Cơ chày sau',sternocleidomastoid:'Cơ ức đòn chũm',masseter:'Cơ cắn',temporalis:'Cơ thái dương',
 'optic nerve':'Thần kinh thị giác','sciatic nerve':'Thần kinh tọa','vagus nerve':'Thần kinh lang thang','median nerve':'Thần kinh giữa','ulnar nerve':'Thần kinh trụ','radial nerve':'Thần kinh quay','femoral nerve':'Thần kinh đùi',
 'common carotid artery':'Động mạch cảnh chung','internal carotid artery':'Động mạch cảnh trong','external carotid artery':'Động mạch cảnh ngoài','subclavian artery':'Động mạch dưới đòn','femoral artery':'Động mạch đùi','renal artery':'Động mạch thận','pulmonary artery':'Động mạch phổi','pulmonary vein':'Tĩnh mạch phổi','internal jugular vein':'Tĩnh mạch cảnh trong','portal vein':'Tĩnh mạch cửa',
 eyeball:'Nhãn cầu',eye:'Mắt',ear:'Tai',skin:'Da','body surface':'Bề mặt cơ thể','fallopian tube':'Vòi tử cung','uterine tube':'Vòi tử cung',
};
export function translatedName(name:string):string|null{
 let n=name.toLowerCase().trim().replace(/_/g,' ').replace(/\s+/g,' ');
 if(n.endsWith(' l'))n='left '+n.slice(0,-2).replace(/^left /,'');
 if(n.endsWith(' r'))n='right '+n.slice(0,-2).replace(/^right /,'');
 n=n.replace('heart left ventricle','left ventricle').replace('heart right ventricle','right ventricle').replace('skin of body','body surface').replace('mammary gland','breast');
 if(names[n])return names[n];
 const partPrefixes:Record<string,string>={'sternocostal part of ':'Phần ức sườn của ','clavicular part of ':'Phần đòn của ','abdominal part of ':'Phần bụng của ','long head of ':'Đầu dài của ','short head of ':'Đầu ngắn của ','lateral head of ':'Đầu ngoài của ','medial head of ':'Đầu trong của ','upper lobe of ':'Thùy trên của ','lower lobe of ':'Thùy dưới của ','middle lobe of ':'Thùy giữa của '};
 for(const [prefix,vi] of Object.entries(partPrefixes)){if(n.startsWith(prefix)){const rest=translatedName(n.slice(prefix.length));if(rest)return vi+rest.charAt(0).toLowerCase()+rest.slice(1);}}
 let side='';if(n.startsWith('left ')){side=' trái';n=n.slice(5);}else if(n.startsWith('right ')){side=' phải';n=n.slice(6);}
 if(names[n])return names[n]+side;
 const rib=n.match(/^(?:([a-z]+) )?rib(?: ([0-9]+))?$/);if(rib&&rib[2])return 'Xương sườn '+rib[2]+side;
 if(n.endsWith(' muscle')&&names[n.slice(0,-7)])return names[n.slice(0,-7)]+side;
 return null;
}
export function labelFor(c:{name:string;id:string;system?:SystemId},system?:SystemId){return translatedName(c.name)??`${SYSTEM_VI[c.system??system??'connective'].name} · ${c.id}`;}
export function educationalSelections(atlas:Atlas):Map<string,Concept>{
 const selections=new Map<string,Concept>();
 for(const c of [...atlas.concepts].filter(c=>translatedName(c.name)).sort((a,b)=>a.elements.length-b.elements.length))for(const id of c.elements)if(!selections.has(id))selections.set(id,c);
 return selections;
}
export const fold=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
export function conceptSystem(c:Concept,parts:Map<string,Part>):SystemId{
 const n=c.name.toLowerCase().replace(/^(left|right) /,'');
 if(/^(lung|lungs|trachea|bronchus)/.test(n))return 'respiratory';
 if(/^(heart|atrium|ventricle|aortic valve|mitral valve|tricuspid valve|pulmonary valve)/.test(n))return 'cardiac';
 if(/^(kidney|ureter|urethra|urinary bladder)/.test(n))return 'urinary';
 if(/^(brain|cerebellum|spinal cord)/.test(n))return 'nervous';
 if(/^(liver|stomach|spleen|pancreas|small intestine|large intestine|colon|rectum|esophagus)/.test(n))return n==='spleen'?'lymphatic':'digestive';
 const count=new Map<SystemId,number>();for(const id of c.elements){const s=parts.get(id)?.system;if(s)count.set(s,(count.get(s)??0)+1);}return [...count].sort((a,b)=>b[1]-a[1])[0]?.[0]??'connective';
}
export type LessonId='heart'|'lungs'|'digestion'|'kidneys';
export interface Lesson{ id:LessonId;name:string;question:string;summary:string;systems:SystemId[];focus:string[];duration:number;source:string;sourceName:string;steps:{title:string;body:string}[];fact:string; }
export const LESSONS:Lesson[]=[
 {id:'heart',name:'Một nhịp tim',question:'Máu đi đâu sau mỗi nhịp đập?',summary:'Theo dấu hành trình đưa ôxy đến từng phần cơ thể.',systems:['cardiac','arterial','venous'],focus:['heart'],duration:16,source:'https://www.nhlbi.nih.gov/health/heart/blood-flow',sourceName:'NHLBI · Viện Y tế Quốc gia Hoa Kỳ',fact:'Động mạch và tĩnh mạch được gọi tên theo hướng máu đi so với tim, không theo lượng ôxy.',steps:[
 {title:'Trở về tim',body:'Máu từ cơ thể trở về tâm nhĩ phải qua các tĩnh mạch chủ, rồi đi qua van ba lá xuống tâm thất phải.'},
 {title:'Đến phổi',body:'Tâm thất phải co, đưa máu qua van động mạch phổi đến phổi. Máu nhận ôxy và thải khí cacbonic.'},
 {title:'Trở lại tim trái',body:'Máu giàu ôxy theo tĩnh mạch phổi về tâm nhĩ trái, rồi qua van hai lá xuống tâm thất trái.'},
 {title:'Đi nuôi cơ thể',body:'Tâm thất trái co, đẩy máu qua van động mạch chủ đến các mô. Các van giúp giữ dòng máu đi một chiều.'}]},
 {id:'lungs',name:'Một hơi thở',question:'Điều gì khiến không khí đi vào phổi?',summary:'Quan sát cơ hoành, phổi và sự trao đổi khí.',systems:['respiratory'],focus:['lung','lungs','left lung','right lung','trachea','diaphragm'],duration:12,source:'https://www.nhlbi.nih.gov/health/lungs/breathing-benefits',sourceName:'NHLBI · Viện Y tế Quốc gia Hoa Kỳ',fact:'Phổi không tự kéo không khí vào. Sự thay đổi thể tích lồng ngực tạo ra chênh lệch áp suất.',steps:[
 {title:'Hít vào',body:'Cơ hoành co và hạ xuống; lồng ngực mở rộng. Áp suất trong phổi giảm, không khí theo đường dẫn khí đi vào.'},
 {title:'Trao đổi khí',body:'Trong phế nang, ôxy đi qua thành rất mỏng để vào máu. Khí cacbonic từ máu đi vào phế nang.'},
 {title:'Thở ra',body:'Khi thở ra yên tĩnh, cơ hoành giãn và phổi đàn hồi trở lại. Không khí mang khí cacbonic đi ra ngoài.'}]},
 {id:'digestion',name:'Hành trình thức ăn',question:'Bữa ăn trở thành năng lượng thế nào?',summary:'Từ dạ dày đến ruột, theo một hành trình liên tục.',systems:['digestive'],focus:['stomach','small intestine','large intestine','esophagus'],duration:20,source:'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works',sourceName:'NIDDK · Viện Y tế Quốc gia Hoa Kỳ',fact:'Nhu động là những đợt co cơ phối hợp, giúp trộn và đẩy thức ăn dọc ống tiêu hóa.',steps:[
 {title:'Đưa thức ăn xuống',body:'Sau khi nhai và nuốt, thức ăn đi qua thực quản. Những đợt co cơ đẩy thức ăn về phía dạ dày.'},
 {title:'Trộn trong dạ dày',body:'Dạ dày co bóp, trộn thức ăn với dịch tiêu hóa rồi đưa hỗn hợp xuống ruột non từng phần.'},
 {title:'Hấp thu ở ruột non',body:'Dịch từ tụy và mật hỗ trợ tiêu hóa. Phần lớn chất dinh dưỡng được hấp thu qua thành ruột non.'},
 {title:'Thu hồi nước',body:'Ruột già hấp thu thêm nước. Phần còn lại tạo thành phân, được giữ ở trực tràng trước khi ra ngoài.'}]},
 {id:'kidneys',name:'Bộ lọc của cơ thể',question:'Thận giữ lại điều gì, loại bỏ điều gì?',summary:'Hiểu lọc máu, tái hấp thu và tạo nước tiểu.',systems:['urinary'],focus:['left kidney','right kidney','kidney','urinary bladder','left ureter','right ureter'],duration:16,source:'https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work',sourceName:'NIDDK · Viện Y tế Quốc gia Hoa Kỳ',fact:'Sau khi lọc, thận còn đưa phần lớn nước và các chất cần thiết trở lại máu.',steps:[
 {title:'Máu đến thận',body:'Máu theo động mạch thận đến các đơn vị lọc rất nhỏ gọi là nephron.'},
 {title:'Lọc qua cầu thận',body:'Nước và nhiều chất nhỏ đi từ máu vào dịch lọc. Tế bào máu và phần lớn protein được giữ lại trong mạch.'},
 {title:'Giữ lại chất cần thiết',body:'Ống thận tái hấp thu phần lớn nước cùng nhiều chất cần thiết; đồng thời điều chỉnh các chất được thải ra.'},
 {title:'Tạo và dẫn nước tiểu',body:'Dịch còn lại trở thành nước tiểu, đi theo niệu quản xuống bàng quang để được lưu trữ.'}]},
];
export function lessonSelection(atlas:Atlas,lesson:Lesson):string[]{const ids=new Set<string>();for(const name of lesson.focus){const c=atlas.concepts.find(c=>c.name.toLowerCase()===name);c?.elements.forEach(id=>ids.add(id));}if(!ids.size)atlas.parts.filter(p=>lesson.systems.includes(p.system)).forEach(p=>ids.add(p.id));return [...ids];}
export function lessonFor(name:string,system:SystemId){if(/heart|atrium|ventricle/.test(name.toLowerCase())||system==='cardiac')return LESSONS[0];if(system==='respiratory'||/diaphragm/.test(name.toLowerCase()))return LESSONS[1];if(system==='digestive')return LESSONS[2];if(system==='urinary')return LESSONS[3];return null;}
const organText:Record<string,string>={heart:'Tim nằm trong lồng ngực, giữa hai lá phổi. Hai nửa tim phối hợp đưa máu qua phổi để nhận ôxy rồi đi nuôi các mô.',brain:'Não xử lý thông tin từ giác quan, phối hợp vận động, trí nhớ, ngôn ngữ và nhiều hoạt động tự động của cơ thể.',liver:'Gan xử lý nhiều chất dinh dưỡng từ ruột, sản xuất mật và tổng hợp nhiều protein cần thiết cho cơ thể.',stomach:'Dạ dày là túi cơ nối thực quản với ruột non. Nó chứa, nhào trộn thức ăn và phối hợp với dịch tiêu hóa.',pancreas:'Tụy tạo dịch tiêu hóa đưa vào ruột non và sản xuất hoóc-môn, trong đó có insulin giúp điều hòa đường huyết.',spleen:'Lách lọc máu, tham gia loại bỏ tế bào máu già và hỗ trợ đáp ứng miễn dịch.',uterus:'Tử cung là cơ quan có thành cơ trong khung chậu. Niêm mạc thay đổi theo chu kỳ và có thể hỗ trợ sự phát triển của thai.',ovary:'Buồng trứng chứa các tế bào trứng đang phát triển và sản xuất hoóc-môn sinh dục.',testis:'Tinh hoàn tạo tinh trùng và sản xuất hoóc-môn sinh dục, trong đó có testosterone.'};
export function describe(c:Concept,system:SystemId){const key=c.name.toLowerCase().replace(/^(left|right) /,'');return organText[key]??SYSTEM_VI[system].description;}
