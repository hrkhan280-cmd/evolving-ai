const C='evolving-ai-v6',FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 // only handle our own files and the WebLLM library; WebLLM caches model weights itself
 if(u.origin!==location.origin&&!u.hostname.includes('jsdelivr')&&u.hostname!=='cdnjs.cloudflare.com')return;
 e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{
  if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match('index.html'))))});
