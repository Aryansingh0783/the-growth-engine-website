(() => {
 if(window.__tgeClientPosters)return;
 window.__tgeClientPosters=true;
 const rows=[
  {slug:'frenchify-with-vyom',kind:'frenchify',title:'Frenchify',line:'WITH VYOM',type:'LANGUAGE EDUCATION',image:'/tge/frenchify-portrait.jpg',alt:'Vyom Sharma, official Frenchify channel portrait'},
  {slug:'the-global-axis',kind:'axis',title:'GLOBAL',line:'AXIS',type:'IMMIGRATION CONSULTING',logo:'/tge/axis-logo.png'},
  {slug:'nuwave-music-kp-singh',kind:'music',title:'NUWAVE',line:'KP SINGH',type:'MUSIC PRODUCTION',image:'/tge/kp-singh.webp',alt:'KP Singh at a music industry event'},
  {slug:'restart-medical-academy',kind:'rma',title:'RMA',line:'RESTART MEDICAL ACADEMY',type:'MEDICAL EDUCATION',image:'/tge/rma-training.jpg',alt:'Restart Medical Academy training team, official academy website'},
  {slug:'dr-sw-clinics',kind:'drsw',title:'Dr SW',line:'CLINICS',type:'HEALTHCARE',image:'/tge/drsw-official.jpg',alt:'Dr SW Clinics consultation room'}
 ];
 const cards=new Map();let frame=0,active=true,backdrop=null;
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 // The captured image component maps [start end,end start] to [-150,+150].
 // Its host keeps the captured hover scale 1.1 -> 1 and entry reveal.
 function paint(){frame=0;const vh=innerHeight,visible=[],stale=[];
  // Read every layout before changing styles or removing detached layers.
  for(const [node,entry] of cards){if(!node.isConnected){stale.push([node,entry]);continue;}
   const rect=node.getBoundingClientRect(),host=entry.host.getBoundingClientRect();
   const progress=Math.max(0,Math.min(1,(vh-host.top)/(vh+host.height)));
   const p=Math.max(-1,Math.min(1,(rect.top+rect.height*.5-vh*.5)/vh));
   visible.push({entry,center:rect.top+rect.height*.5,progress,p});
  }
  for(const [node,entry] of stale){entry.layer?.remove();cards.delete(node);}
  for(const {entry,progress,p} of visible){
   entry.poster.style.setProperty('--cp-parallax',media.matches?'0px':`${-150+300*progress}px`);
   entry.poster.style.setProperty('--cp-y',media.matches?'0px':`${p*52}px`);
   entry.poster.style.setProperty('--cp-x',media.matches?'0px':`${p*-28}px`);
  }
  // Five compositions share one sticky backdrop; adjacent layers crossfade
  // continuously around the midpoint between their card centres, reversible.
  visible.sort((a,b)=>a.center-b.center);
  let first=0,second=0,mix=0;
  if(visible.length){const center=vh*.5;
   if(center>=visible.at(-1).center)first=second=visible.length-1;
   else for(let i=0;i<visible.length-1;i++)if(center>=visible[i].center&&center<visible[i+1].center){first=i;second=i+1;const t=(center-visible[i].center)/(visible[i+1].center-visible[i].center);mix=Math.max(0,Math.min(1,(t-.3)/.4));mix=mix*mix*(3-2*mix);break;}
   visible.forEach(({entry},i)=>{const opacity=i===first?1-mix:i===second?mix:0;entry.layer.style.opacity=String(opacity);});
  }
 }
 function request(){if(active&&!frame)frame=requestAnimationFrame(paint);}
 function mount(){const section=document.getElementById('clients');if(!section)return;section.classList.add('tge-client-posters');
  const bgHost=section.querySelector('.framer-lrkxhk-container');
  if(bgHost){
   const baked=Array.from(bgHost.children).filter(n=>n.classList.contains('cp-backdrops'));
   backdrop=baked[0]||null;
   baked.slice(1).forEach(n=>n.remove());
   if(!backdrop){backdrop=document.createElement('div');backdrop.className='cp-backdrops';backdrop.setAttribute('aria-hidden','true');bgHost.append(backdrop);}
  }else backdrop=null;
  if(!backdrop)return;
  // Hydration can replace all cards while retaining the baked backdrop.
  // Release stale ownership before the new cards reuse those same layers.
  for(const [node] of cards)if(!node.isConnected)cards.delete(node);
  for(const row of rows){const node=Array.from(section.querySelectorAll('.framer-1sphto1')).find(n=>n.id.startsWith(row.slug+'-'));if(!node)continue;const host=node.querySelector('.framer-xg3b0x');if(!host)continue;
   const prior=cards.get(node);
   if(prior?.poster.parentElement===host&&prior?.layer.parentElement===backdrop)continue;
   const bakedPosters=Array.from(host.children).filter(n=>n.classList.contains('tge-client-poster'));
   let poster=bakedPosters.find(n=>n.dataset.kind===row.kind);
   bakedPosters.filter(n=>n!==poster).forEach(n=>n.remove());
   if(!poster){
   poster=document.createElement('div');poster.className='tge-client-poster';poster.dataset.kind=row.kind;poster.setAttribute('aria-label',row.alt||row.title+' official brand composition');
   const type=document.createElement('span');type.className='cp-type';type.textContent=row.type;poster.append(type);
   const words=document.createElement('div');words.className='cp-words';words.setAttribute('aria-hidden','true');const strong=document.createElement('strong');strong.textContent=row.title;const sub=document.createElement('span');sub.textContent=row.line;words.append(strong,sub);poster.append(words);
   if(row.image){const frame=document.createElement('div');frame.className='cp-photo';const img=document.createElement('img');img.src=row.image;img.alt=row.alt;img.loading='lazy';img.decoding='async';frame.append(img);poster.append(frame);}
   if(row.logo){const logo=document.createElement('img');logo.className='cp-logo';logo.src=row.logo;logo.alt='The Global Axis';poster.append(logo);}
   if(row.kind==='rma'&&!row.image){const emblem=document.createElement('span');emblem.className='cp-emblem';emblem.textContent='R';emblem.setAttribute('aria-hidden','true');poster.append(emblem);}
   host.append(poster);
   }
   host.classList.add('tge-poster-host');
   if(!poster.querySelector(':scope > .cp-composition')){
    const composition=document.createElement('div');composition.className='cp-composition';
    while(poster.firstChild)composition.append(poster.firstChild);
    poster.append(composition);
   }
   const bakedLayers=Array.from(backdrop.children).filter(n=>n.classList.contains('cp-backdrop-layer')&&n.dataset.kind===row.kind);
   let layer=bakedLayers[0];bakedLayers.slice(1).forEach(n=>n.remove());
   if(!layer){layer=poster.cloneNode(true);layer.classList.add('cp-backdrop-layer');layer.removeAttribute('aria-label');layer.setAttribute('aria-hidden','true');layer.querySelectorAll('img').forEach(img=>{img.alt='';});backdrop.append(layer);}
   if(!layer.querySelector(':scope > .cp-composition')){
    const composition=document.createElement('div');composition.className='cp-composition';
    while(layer.firstChild)composition.append(layer.firstChild);
    layer.append(composition);
   }
   cards.set(node,{poster,host,layer});
  }request();
 }
 const observer=new MutationObserver(mount);
 function start(){active=true;observer.observe(document.documentElement,{childList:true,subtree:true});mount();}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});media.addEventListener('change',request);
 addEventListener('pagehide',()=>{active=false;observer.disconnect();cancelAnimationFrame(frame);frame=0;});addEventListener('pageshow',start);start();
})();
