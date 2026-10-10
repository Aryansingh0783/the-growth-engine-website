// About links are authored in the shared native navigation components.
// Document navigation loads each route's own readiness and enhancement scripts.
(()=>{
 addEventListener('click',event=>{
  const a=event.target.closest?.('a[href]');if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname!=='/about/')return;
  event.preventDefault();event.stopImmediatePropagation();
  if(location.pathname==='/about/'){
   const open=[...document.querySelectorAll('button.framer-R5ksj.framer-v-6bdkbe')].find(e=>e.getBoundingClientRect().width>0);
   open?.click();window.TGEScroll?.scrollTo(0);
  }else location.assign('/about/');
 },true);
})();
