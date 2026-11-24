const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.svg'))){
  const src=fs.readFileSync(path.join(dir,f),'utf8');
  await p.setContent(`<body style="margin:0">${src}</body>`);
  const bb=await p.evaluate(()=>{const s=document.querySelector('svg');const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    // regroupe tout sauf defs pour mesurer
    [...s.children].filter(c=>c.tagName!=='defs').forEach(c=>g.appendChild(c));s.appendChild(g);const r=g.getBBox();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  const side=Math.max(bb.w,bb.h)*1.1, cx=bb.x+bb.w/2, cy=bb.y+bb.h/2;
  const vb=`${(cx-side/2).toFixed(1)} ${(cy-side/2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`;
  fs.writeFileSync(path.join(dir,f),src.replace(/viewBox="[^"]*"/,`viewBox="${vb}"`));
  console.log(f,vb);
}
await b.close()})();
