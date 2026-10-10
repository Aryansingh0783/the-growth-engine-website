// Close through the original Framer button; never maintain a second menu state.
(()=>{'use strict';if(window.__tgeMenuAccessibility)return;window.__tgeMenuAccessibility=true;
let restore=null,observer=null;
const visible=node=>{const r=node.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(node).visibility!=='hidden';};
function restoreFocus(){if(!restore)return;const opened=[...document.querySelectorAll('button.framer-R5ksj.framer-v-6bdkbe')].some(visible);if(opened)return;const target=restore.isConnected&&visible(restore)?restore:[...document.querySelectorAll('button.framer-R5ksj')].find(visible);restore=null;target?.focus({preventScroll:true});}
document.addEventListener('keydown',event=>{if(event.key!=='Escape'||event.defaultPrevented)return;const button=[...document.querySelectorAll('button.framer-R5ksj.framer-v-6bdkbe')].find(visible);if(!button)return;event.preventDefault();event.stopPropagation();restore=button;button.click();queueMicrotask(restoreFocus);},true);
function start(){if(observer)return;observer=new MutationObserver(restoreFocus);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});}
window.addEventListener('pagehide',()=>{observer?.disconnect();observer=null;restore=null;});window.addEventListener('pageshow',start);start();})();
