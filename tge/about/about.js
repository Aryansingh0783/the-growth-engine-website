import Lenis from './about-lenis.mjs';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('#about-menu');
const trigger = document.querySelector('[data-menu-open]');
const topButton = document.querySelector('[data-back-top]');
const portraits = [...document.querySelectorAll('.portrait')];
const process = document.querySelector('.process-rail');
let lenis = null, frame = 0, observer = null, lastY = -1;

function scrollTo(target, options = {}) {
  if (lenis) { lenis.resize(); lenis.scrollTo(target, {force:true, ...options, immediate:reduced.matches || options.immediate}); }
  else { const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY; window.scrollTo({top:y,behavior:'instant'}); }
}
function tick(time) {
  lenis?.raf(time);
  if (lastY !== scrollY) {
    lastY = scrollY;
    topButton.classList.toggle('is-visible', scrollY > innerHeight * .7);
    topButton.tabIndex = scrollY > innerHeight * .7 ? 0 : -1;
    if (!reduced.matches) {
      for (const portrait of portraits) {
        const rect = portrait.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) portrait.style.setProperty('--portrait-shift', `${Math.max(-20,Math.min(20,(rect.top + rect.height / 2 - innerHeight / 2) * -.035))}px`);
      }
    }
    const rect = process.getBoundingClientRect();
    const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .9 - rect.top) / (innerHeight * .55)));
    process.style.setProperty('--progress', progress);
    [...process.children].forEach((step,i) => step.classList.toggle('is-active', progress >= i / 5));
  }
  frame = requestAnimationFrame(tick);
}
function reveal(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if (!reduced.matches && entry.target.animate) entry.target.animate(
      [{opacity:.25,transform:'translateY(32px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:900,easing:'cubic-bezier(.16,1,.3,1)'}
    );
  });
}
function start() {
  if (frame) return;
  if (!reduced.matches) lenis = new Lenis({duration:innerWidth <= 1199 ? 4 : 3.5,wheelMultiplier:1.1,touchMultiplier:1,smoothWheel:true,syncTouch:false,autoResize:true});
  window.TGEScroll = {scrollTo,get position(){return lenis?.animatedScroll ?? scrollY;}};
  observer = new IntersectionObserver(reveal,{threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  lastY = -1; frame = requestAnimationFrame(tick);
}
function stop() {
  cancelAnimationFrame(frame); frame = 0;
  observer?.disconnect(); observer = null;
  lenis?.destroy(); lenis = null;
  delete window.TGEScroll;
}
function closeMenu() {
  menu.close();trigger.setAttribute('aria-expanded','false');lenis?.start();document.documentElement.style.overflow='';trigger.focus({preventScroll:true});
}
trigger.addEventListener('click',()=>{
  menu.showModal();trigger.setAttribute('aria-expanded','true');lenis?.stop();document.documentElement.style.overflow='hidden';
  if (!reduced.matches) menu.animate([{opacity:0,transform:'translateY(-25px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.16,1,.3,1)'});
});
document.querySelector('[data-menu-close]').addEventListener('click',closeMenu);
menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu();});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
topButton.addEventListener('click',()=>scrollTo(0));
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href]');if(!link || e.button!==0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)return;
  const url=new URL(link.href);if(url.origin!==location.origin || url.pathname!==location.pathname || !url.hash)return;
  const target=document.getElementById(url.hash.slice(1));if(!target)return;
  e.preventDefault();scrollTo(target);history.replaceState(null,'',url.hash);
});
reduced.addEventListener('change',()=>{stop();start();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame){if(!lenis&&!reduced.matches)start();else{lastY=-1;frame=requestAnimationFrame(tick);}}});
addEventListener('pagehide',stop);addEventListener('pageshow',start);
start();
window.TGEEntryReady = Promise.allSettled([document.fonts.load('600 32px Manrope'),document.querySelector('.brand img').decode()]).then(()=>{lenis?.resize();return {ready:true};});
