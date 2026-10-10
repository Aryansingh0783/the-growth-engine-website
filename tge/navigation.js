// Register before Framer's router so same-page TGE anchors stay on the mounted page.
(()=>{
 const routes={'/about-us':'#e3sqjn','/projects':'#clients','/blog':'#services','/career':'#strategy','/contacts':'#contact','/404':'#reporting'};
 window.addEventListener('click',event=>{
  const a=event.target.closest?.('a[href]');if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
  const hash=routes[url.pathname]||(url.pathname==='/'?url.hash:'');if(!hash)return;
  const target=document.getElementById(hash.slice(1));if(!target)return;
  event.preventDefault();event.stopImmediatePropagation();
  const openMenu=Array.from(document.querySelectorAll('.framer-R5ksj.framer-v-6bdkbe')).find(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0});
  if(openMenu)openMenu.click();
  const immediate=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(window.TGEScroll)window.TGEScroll.scrollTo(target,{immediate});
  else target.scrollIntoView({behavior:'instant',block:'start'});
  history.replaceState(null,'',location.pathname+location.search+hash);
 },true);
})();
