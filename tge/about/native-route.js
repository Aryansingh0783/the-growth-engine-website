// One shared Framer/Lenis runtime. Cross-page links load the destination's own assets.
(()=>{
 const began=performance.now();let resolve,interacted=false;
 for(const name of ['wheel','touchstart','keydown'])addEventListener(name,()=>{interacted=true;},{once:true,passive:true});
 window.TGEEntryReady=new Promise(r=>resolve=r);
 const probe=()=>{if(window.TGEScroll&&document.querySelector('.framer-E2waI')){Promise.all([document.fonts.load('600 32px Manrope'),...['allen.webp','harshit.webp','soumya.webp'].map(file=>{const image=new Image();image.src='/tge/about/'+file;return image.decode();})]).catch(()=>{}).then(()=>{if(!interacted&&!location.hash)window.TGEScroll.scrollTo(0,{immediate:true});resolve();});return;}if(performance.now()-began>6000){resolve();return;}setTimeout(probe,40);};probe();
 window.addEventListener('click',event=>{
  const a=event.target.closest?.('a[href]');if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
  if(url.pathname==='/'&&url.hash==='#top'){event.preventDefault();event.stopImmediatePropagation();window.TGEScroll?.scrollTo(0);return;}
  if(url.pathname==='/'){event.preventDefault();event.stopImmediatePropagation();location.assign(url.href);}
 },true);
 const labelMenus=()=>document.querySelectorAll('button.framer-R5ksj').forEach(button=>{const open=button.classList.contains('framer-v-6bdkbe');button.setAttribute('aria-label',open?'Close menu':'Open menu');button.setAttribute('aria-expanded',String(open));});
 document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(labelMenus).observe(document.getElementById('main'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});labelMenus();},{once:true});
})();
