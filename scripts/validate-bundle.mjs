import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const assets=fs.readdirSync('dist/assets');
function gzip(name){return zlib.gzipSync(fs.readFileSync(path.join('dist/assets',name))).length}
const app=assets.find(name=>/^index-.*\.js$/.test(name)),scene=assets.find(name=>/^scene-.*\.js$/.test(name));
if(!app||!scene)throw new Error('Không tìm thấy các bundle ứng dụng/đồ họa.');
const journeyFiles=fs.readdirSync('public/content/journeys').filter(name=>name.endsWith('.json')),journeySizes=journeyFiles.map(name=>fs.statSync(path.join('public/content/journeys',name)).size);
const sizes={app:gzip(app),graphics:gzip(scene),journey:Math.max(...journeySizes)};
const limits={app:90_000,graphics:270_000,journey:100_000};
for(const key of Object.keys(limits))if(sizes[key]>limits[key])throw new Error(`${key} vượt ngân sách: ${sizes[key]} > ${limits[key]}`);
console.log(`Bundle budgets passed · app ${sizes.app} B gzip · graphics ${sizes.graphics} B gzip · journey ${sizes.journey} B raw.`);
