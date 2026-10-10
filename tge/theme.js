(()=>{
 const routes={'/about-us':'#e3sqjn','/projects':'#clients','/blog':'#services','/career':'#strategy','/contacts':'#contact','/404':'#reporting','/terms-of-services':'/preview-notes.html','/privacy':'/preview-notes.html'};
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const pausedForPreference=new Set();
 function mount(){
  const hero=document.querySelector('.framer-1enr2k3');if(hero)hero.id='top';
  const services=document.querySelector('section.framer-kleuev');if(services)services.id='services';
  const clients=document.querySelector('section.framer-1eh6nam');if(clients)clients.id='clients';
  document.querySelectorAll('.framer-R5ksj').forEach(el=>{const open=el.classList.contains('framer-v-6bdkbe');el.setAttribute('role','button');el.setAttribute('aria-label',open?'Close menu':'Open menu');el.setAttribute('aria-expanded',String(open));el.tabIndex=0});
  document.querySelectorAll('a[href]').forEach(a=>{
   const u=new URL(a.getAttribute('href'),location.href);
   if(u.origin===location.origin&&routes[u.pathname])a.setAttribute('href',routes[u.pathname]);
  });
  if(reduce.matches)document.querySelectorAll('video').forEach(v=>{if(!v.paused)pausedForPreference.add(v);v.pause()});
  else for(const video of pausedForPreference){const r=video.getBoundingClientRect();if(video.isConnected&&r.bottom>0&&r.top<innerHeight)video.play().catch(()=>{});pausedForPreference.delete(video);}
 }
 let scheduled=false;
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;mount()})});
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-framer-name','class']});mount();reduce.addEventListener('change',mount);
 window.addEventListener('pagehide',()=>observer.disconnect());
 window.addEventListener('pageshow',()=>{observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-framer-name','class']});mount()});
})();
