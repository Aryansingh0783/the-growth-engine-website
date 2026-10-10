/* Motion port: velocity-marquee.framer.website, shared-lib.CDNrutvz.mjs io().
 * Exact authored .5/.8/6/.06 equations; passive native-scroll observation, no scroll controller.
 * Adaptations: distinct row contents, per-row widths, reduced motion, focus pause, lifecycle.
 */
(()=>{'use strict';if(window.TGEMarquee)return;
const instances=new Map(),reduce=matchMedia('(prefers-reduced-motion: reduce)');
function mount(root){
 if(instances.has(root))return instances.get(root);
 const tracks=[...root.querySelectorAll('.tge-marquee-track')],groups=tracks.map(t=>t.firstElementChild),rows=tracks.map(()=>({width:0,x:0}));
 let frame=0,last=0,boost=0,previousY=scrollY,dirty=false,hover=false,focused=false,visible=!('IntersectionObserver'in window),dead=false;
 const events=new AbortController(),opts={signal:events.signal};
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function wake(){if(!dead&&!frame&&visible&&!document.hidden&&!reduce.matches)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(dead||!root.isConnected){destroy();return;}if(!visible||document.hidden||reduce.matches)return;last||=now;const ratio=Math.min(64,now-last)/16.6667;last=now;
 if(dirty){dirty=false;const y=scrollY;boost=Math.max(-6,Math.min(6,boost+(y-previousY)*.8));previousY=y;}
 rows.forEach((r,i)=>{const dir=i%2?1:-1;if(!hover&&!focused)r.x+=(.5*dir+boost*dir)*ratio;if(r.width>0){r.x=((r.x%r.width)+r.width)%r.width;if(r.x>0)r.x-=r.width;}tracks[i].style.transform='translate3d('+r.x+'px,0,0)';});
 boost+=(0-boost)*.06*ratio;wake();}
 function measure(){tracks.forEach((track,i)=>{track.querySelectorAll('[data-clone]').forEach(n=>n.remove());rows[i].width=groups[i].scrollWidth;const count=Math.max(2,Math.min(40,Math.ceil(root.clientWidth*2/Math.max(1,rows[i].width))+1));for(let j=1;j<count;j++){const clone=groups[i].cloneNode(true);clone.dataset.clone='';clone.setAttribute('aria-hidden','true');clone.inert=true;track.appendChild(clone);}});wake();}
 function preference(){root.dataset.reduced=String(reduce.matches);previousY=scrollY;dirty=false;boost=0;stop();if(reduce.matches)tracks.forEach(t=>t.style.transform='none');else wake();}
 function destroy(){if(dead)return;dead=true;stop();events.abort();resize?.disconnect();intersection?.disconnect();reduce.removeEventListener('change',preference);tracks.forEach(t=>{t.style.transform='';t.querySelectorAll('[data-clone]').forEach(n=>n.remove());});delete root.dataset.ready;instances.delete(root);}
 window.addEventListener('scroll',()=>{dirty=true;wake();},{passive:true,...opts});
 root.addEventListener('pointerenter',()=>{hover=true;root.dataset.hover='true';},opts);root.addEventListener('pointerleave',()=>{hover=false;delete root.dataset.hover;root.querySelector('.tge-marquee-lens').style.opacity='0';},opts);
 root.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduce.matches)return;const r=root.getBoundingClientRect(),lens=root.querySelector('.tge-marquee-lens');lens.style.transform='translate3d('+(e.clientX-r.left-14)+'px,'+(e.clientY-r.top-14)+'px,0)';lens.style.opacity='1';},opts);
 root.addEventListener('focusin',()=>focused=true,opts);root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))focused=false;},opts);
 document.addEventListener('visibilitychange',()=>{stop();previousY=scrollY;dirty=false;wake();},opts);
 const resize='ResizeObserver'in window?new ResizeObserver(measure):null;if(resize)resize.observe(root);else window.addEventListener('resize',measure,opts);
 const intersection='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(!visible)stop();else{previousY=scrollY;dirty=false;wake();}}):null;intersection?.observe(root);
 reduce.addEventListener('change',preference);instances.set(root,{destroy,measure});measure();root.dataset.ready='true';preference();return instances.get(root);
}
function scan(){document.querySelectorAll('[data-tge-marquee]').forEach(mount);for(const [node,api]of instances)if(!node.isConnected)api.destroy();}
let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scan();});});observer.observe(document.documentElement,{childList:true,subtree:true});scan();
window.addEventListener('pagehide',()=>{observer.disconnect();for(const api of [...instances.values()])api.destroy();});window.addEventListener('pageshow',()=>{observer.observe(document.documentElement,{childList:true,subtree:true});scan();});window.TGEMarquee={mount,destroyAll(){for(const api of [...instances.values()])api.destroy();}};
})();
