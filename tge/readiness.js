(() => {
 if(window.TGEEntryReady)return;
 const began=performance.now(),limit=8000;
 const state=window.TGEEntryReadiness={startedAt:began,ready:false,degraded:false,checks:[],elapsedMs:0};
 let finish;window.TGEEntryReady=new Promise(resolve=>finish=resolve);
 const dom=document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true})):Promise.resolve();
 const check=async(name,task)=>{try{await task();if(!settled)state.checks.push({name,ready:true,atMs:performance.now()-began});}catch(error){if(!settled)state.checks.push({name,ready:false,error:String(error?.message||error),atMs:performance.now()-began});}};
 let settled=false,timer;
 const complete=()=>{if(settled)return;settled=true;clearTimeout(timer);state.elapsedMs=performance.now()-began;state.ready=state.checks.length===4&&state.checks.every(c=>c.ready);state.degraded=!state.ready;finish({...state,checks:state.checks.slice()});};
 timer=setTimeout(()=>{state.checks.push({name:'deadline',ready:false,error:'Entry readiness exceeded 8000ms'});complete();},limit);
 const scrollReady=new Promise((resolve,reject)=>{const probe=()=>{if(window.TGEScroll)return resolve();if(settled)return reject(Error('Authored scroll was not ready before deadline'));setTimeout(probe,40);};probe();});
 Promise.all([
  check('brand-font',async()=>{await dom;if(document.fonts){const faces=await document.fonts.load('600 32px Manrope');if(!faces.length)throw Error('Manrope did not load');}}),
  check('authored-scroll',()=>scrollReady),
  check('local-artwork',async()=>{
   await dom;await scrollReady;await new Promise(resolve=>requestAnimationFrame(resolve));
   if(settled)throw Error('Artwork readiness deadline elapsed');
   const urls=[...new Set(Array.from(document.querySelectorAll('#services img, #clients img')).map(img=>{
    try{const url=new URL(img.currentSrc||img.src,location.href);return url.origin===location.origin&&url.pathname.startsWith('/tge/')?url.href:null;}catch{return null;}
   }).filter(Boolean))];
   state.artwork={count:urls.length,decoded:0,urls};
   if(!urls.length)throw Error("Mounted local service/client artwork not found");
   let next=0;
   const worker=async()=>{while(next<urls.length&&!settled){const url=urls[next++],image=new Image();image.decoding='async';image.src=url;await image.decode();if(!settled)state.artwork.decoded++;}};
   // Bound concurrent decode work instead of flooding the first frame.
   await Promise.all(Array.from({length:Math.min(4,urls.length)},worker));
   if(settled)throw Error('Artwork readiness deadline elapsed');
  }),
  check('hero-media',async()=>{await dom;await scrollReady;
   const brand=document.querySelector('img[src="/tge/tge-logo.png"]');if(brand)await brand.decode();
   // Start only the visible hero's source media; never eagerly fetch lower-page media.
   const video=Array.from(document.querySelectorAll('video')).find(v=>{const r=v.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;});
   if(!video)return;
   if(video.readyState<2)await new Promise((resolve,reject)=>{let timeout;const done=()=>{clearTimeout(timeout);video.removeEventListener('loadeddata',good);video.removeEventListener('error',bad);};const good=()=>{done();resolve();};const bad=()=>{done();reject(Error('Hero video failed to load'));};video.addEventListener('loadeddata',good,{once:true});video.addEventListener('error',bad,{once:true});video.preload='auto';if(video.networkState===0)video.load();timeout=setTimeout(()=>{done();reject(Error('Hero video decoded-frame timeout'));},Math.max(1,limit-(performance.now()-began)));});
   // loadeddata guarantees a decoded current frame without starting another player.
  })
 ]).then(complete);
})();
