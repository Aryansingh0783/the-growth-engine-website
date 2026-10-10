(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function mount(root){
  if(root.dataset.reportReady)return;root.dataset.reportReady='true';
  const rows=[...root.querySelectorAll('.report-row')],buttons=rows.map(row=>row.querySelector('.report-toggle'));
  const timers=new WeakMap();
  function select(button){
   rows.forEach(row=>{
    const own=row.querySelector('.report-toggle'),open=own===button,wasOpen=row.classList.contains('is-open'),panel=row.querySelector('.report-disclosure');
    clearTimeout(timers.get(row));
    own.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));panel.inert=!open;
    row.classList.toggle('is-closing',!open&&wasOpen);row.classList.toggle('is-open',open);
    if(!open&&wasOpen)timers.set(row,setTimeout(()=>row.classList.remove('is-closing'),reduced.matches?0:720));
   });
  }
  buttons.forEach((button,index)=>{
   button.addEventListener('click',()=>select(button));
   button.addEventListener('keydown',event=>{
    const key=event.key;let next=index;
    if(key==='ArrowDown')next=(index+1)%buttons.length;
    else if(key==='ArrowUp')next=(index+buttons.length-1)%buttons.length;
    else if(key==='Home')next=0;else if(key==='End')next=buttons.length-1;else return;
    event.preventDefault();buttons[next].focus();
   });
  });
  if(!reduced.matches&&'IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const elements=[root.querySelector('.report-heading h2'),...buttons];
    elements.forEach((el,index)=>el.animate([{opacity:.35,transform:'translateY(28px)',clipPath:'inset(0 0 12% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0% 0)'}],{duration:950,delay:index*65,easing:'cubic-bezier(.16,1,.3,1)'}));
    observer.disconnect();
   }),{threshold:.16});observer.observe(root);
  }
 }
 const scan=()=>document.querySelectorAll('.tge-reporting-editorial').forEach(mount);
 scan();new MutationObserver(scan).observe(document.getElementById('main')||document.body,{childList:true,subtree:true});
})();
