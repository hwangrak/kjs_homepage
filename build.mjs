import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(await readFile('assets-manifest.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
let cursor=0;
await Promise.all(Array.from({length:6},async()=>{
 while(cursor<manifest.files.length){
  const item=manifest.files[cursor++];
  if(item.path.includes('..')||item.path.startsWith('/'))throw Error('Invalid asset path');
  const target='dist/'+item.path;
  try{if(hash(await readFile(target))===item.sha256)continue;}catch{}
  let bytes;
  for(let attempt=0;attempt<3;attempt++){
   try{const res=await fetch(new URL(item.path,manifest.origin+'/'),{signal:AbortSignal.timeout(60000)});if(!res.ok)throw Error(`HTTP ${res.status}`);bytes=Buffer.from(await res.arrayBuffer());if(bytes.length!==item.size||hash(bytes)!==item.sha256)throw Error('Asset checksum mismatch');break;}catch(err){if(attempt===2)throw Error(`${item.path}: ${err.message}`);}
  }
  await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);
 }
}));
execFileSync(process.execPath,['generate.mjs'],{stdio:'inherit'});
async function canonical(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await canonical(p);else if(/\.(html|xml|txt)$/.test(p)){const text=await readFile(p,'utf8');await writeFile(p,text.replaceAll(manifest.origin,'https://kjs-elec.kr'));}}}
await canonical('dist');
execFileSync(process.execPath,['verify.mjs'],{stdio:'inherit'});
